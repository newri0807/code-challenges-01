"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import {Response_} from "@/lib/type";
import {revalidatePath} from "next/cache";
import {cookies} from "next/headers";
import {z} from "zod";

export async function addTweet(tweet: string, imageUrl: string | null) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const newTweet = await db.tweet.create({
        data: {
            tweet,
            image: imageUrl,
            userId: session.id!,
        },
    });
    revalidatePath(`/`);
    return newTweet;
}
export async function editTweet(id: number, tweet: string, imageUrl?: string | null) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const existingTweet = await db.tweet.findUnique({where: {id}});
    if (!existingTweet || existingTweet.userId !== session.id) {
        throw new Error("Forbidden");
    }

    const updatedTweet = await db.tweet.update({
        where: {id},
        data: {tweet, image: imageUrl ?? existingTweet.image},
    });
    revalidatePath(`/`);
    return updatedTweet;
}

export async function deleteTweet(id: number) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const existingTweet = await db.tweet.findUnique({where: {id}});
    if (!existingTweet || existingTweet.userId !== session.id) {
        throw new Error("Forbidden");
    }

    await db.tweet.delete({where: {id}});

    return {message: "Tweet deleted"};
}

export async function getTweetById(id: number) {
    const tweet = await db.tweet.findUnique({
        where: {id},
        include: {user: true, responses: true, likes: true},
    });

    if (!tweet) {
        throw new Error("Tweet not found");
    }

    return tweet;
}

export async function getTweetsByUserId(userId: number) {
    const tweets = await db.tweet.findMany({
        where: {userId},
        orderBy: {created_at: "desc"},
        include: {user: true, responses: true, likes: true},
    });

    return tweets;
}

const responseSchema = z.object({
    content: z.string().min(1).max(280),
});

export async function addResponse(tweetId: number, content: string): Promise<Response_> {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const validatedData = responseSchema.parse({content});

    const newResponse = await db.response.create({
        data: {
            content: validatedData.content,
            userId: session.id!,
            tweetId,
        },
        include: {
            user: true, // 사용자 정보를 포함하여 반환
        },
    });

    revalidatePath(`/tweets/${tweetId}`);

    return {
        id: newResponse.id,
        content: newResponse.content,
        userId: newResponse.userId,
        created_at: new Date(newResponse.created_at),
        updated_at: new Date(newResponse.updated_at),
        tweetId: newResponse.tweetId,
        user: {
            id: newResponse.user.id,
            username: newResponse.user.username,
            avatar: newResponse.user?.avatar,
        },
    };
}

export async function editResponse(responseId: number, content: string): Promise<Response_> {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const existingResponse = await db.response.findUnique({where: {id: responseId}, include: {user: true}});
    if (!existingResponse || existingResponse.userId !== session.id) {
        throw new Error("Forbidden");
    }

    const updatedResponse = await db.response.update({
        where: {id: responseId},
        data: {content},
        include: {
            user: true, // 사용자 정보를 포함하여 반환
        },
    });

    revalidatePath(`/tweets/${existingResponse.tweetId}`);

    return {
        id: updatedResponse.id,
        content: updatedResponse.content,
        userId: updatedResponse.userId,
        created_at: new Date(updatedResponse.created_at),
        updated_at: new Date(updatedResponse.updated_at),
        tweetId: updatedResponse.tweetId,
        user: {
            id: updatedResponse.user.id,
            username: updatedResponse.user.username,
            avatar: updatedResponse.user?.avatar,
        },
    };
}

export async function deleteResponse(responseId: number) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const existingResponse = await db.response.findUnique({where: {id: responseId}});
    if (!existingResponse || existingResponse.userId !== session.id) {
        throw new Error("Forbidden");
    }

    await db.response.delete({where: {id: responseId}});

    revalidatePath(`/tweets/${existingResponse.tweetId}`);
}

export async function getLikeStatus(tweetId: number) {
    const session = await getSession();
    if (!session || !session.id) {
        throw new Error("Not authenticated");
    }

    const likesCount = await db.like.count({
        where: {tweetId},
    });

    const userLike = await db.like.findUnique({
        where: {
            userId_tweetId: {
                userId: session.id,
                tweetId,
            },
        },
    });

    return {likes: likesCount, isLiked: !!userLike};
}

export async function toggleLike(tweetId: number) {
    const session = await getSession();
    if (!session || !session.id) {
        throw new Error("Not authenticated");
    }

    const existingLike = await db.like.findUnique({
        where: {
            userId_tweetId: {
                userId: session.id,
                tweetId,
            },
        },
    });

    if (existingLike) {
        await db.like.delete({
            where: {
                id: existingLike.id,
            },
        });
    } else {
        await db.like.create({
            data: {
                userId: session.id,
                tweetId,
            },
        });
    }

    //revalidatePath(`/tweets/${tweetId}`);
    return getLikeStatus(tweetId);
}

export async function getViewCount(tweetId: number): Promise<number> {
    const tweet = await db.tweet.findUnique({
        where: {id: tweetId},
        select: {views: true},
    });
    console.log(`Server: Get view count for tweet ${tweetId}: ${tweet?.views}`);
    return tweet?.views ?? 0;
}

export async function updateViewCount(tweetId: number): Promise<number> {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const userId = session.id;
    const cookieStore = cookies();
    const cookieKey = `viewedTweets_${userId}`;
    const viewedTweets = JSON.parse(cookieStore.get(cookieKey)?.value || "[]");

    if (!viewedTweets.includes(tweetId)) {
        console.log(`Updating view count for tweet ${tweetId} by user ${userId}`);

        // 데이터베이스에서 트윗의 조회 수 증가
        const tweet = await db.tweet.update({
            where: {id: tweetId},
            data: {views: {increment: 1}},
            select: {views: true},
        });

        // 쿠키에 현재 트윗 ID 추가
        viewedTweets.push(tweetId);
        cookieStore.set(cookieKey, JSON.stringify(viewedTweets), {maxAge: 60 * 60 * 24}); // 24시간

        console.log(`Server: Updated view count for tweet ${tweetId}: ${tweet.views}`);
        return tweet.views;
    } else {
        console.log(`Server: Tweet ${tweetId} already viewed by user ${userId}, not updating count`);
        return getViewCount(tweetId);
    }
}

export async function getCommentCount(tweetId: number) {
    const count = await db.response.count({
        where: {tweetId},
    });

    return count;
}

export async function getRetweetStatus(tweetId: number) {
    const session = await getSession();
    if (!session || !session.id) {
        throw new Error("Not authenticated");
    }

    const retweetCount = await db.retweet.count({
        where: {tweetId},
    });

    const userRetweet = await db.retweet.findUnique({
        where: {
            userId_tweetId: {
                userId: session.id,
                tweetId,
            },
        },
    });

    return {retweetCount, retweeted: !!userRetweet};
}

export async function toggleRetweet(tweetId: number) {
    const session = await getSession();
    if (!session || !session.id) {
        throw new Error("Not authenticated");
    }

    const existingRetweet = await db.retweet.findUnique({
        where: {
            userId_tweetId: {
                userId: session.id,
                tweetId,
            },
        },
    });

    if (existingRetweet) {
        await db.retweet.delete({
            where: {
                id: existingRetweet.id,
            },
        });
    } else {
        await db.retweet.create({
            data: {
                userId: session.id,
                tweetId,
            },
        });
    }

    //revalidatePath(`/tweets/${tweetId}`);
    return getRetweetStatus(tweetId);
}
