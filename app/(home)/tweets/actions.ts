"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

export async function addTweet(tweet: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("Unauthorized");
    }

    const newTweet = await db.tweet.create({
        data: {
            tweet,
            userId: session.id!,
        },
    });

    return newTweet;
}

export async function editTweet(id: number, tweet: string) {
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
        data: {tweet},
    });

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
        include: {user: true},
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
        include: {user: true},
    });

    return tweets;
}