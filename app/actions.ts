import db from "@/lib/db";

export async function getTweets(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [tweets, totalTweets] = await Promise.all([
        db.tweet.findMany({
            skip,
            take: limit,
            orderBy: {created_at: "desc"},
            include: {user: true, responses: {include: {user: true}}, likes: true},
        }),
        db.tweet.count(),
    ]);

    const totalPages = Math.ceil(totalTweets / limit);

    return {
        tweets,
        totalPages,
    };
}
