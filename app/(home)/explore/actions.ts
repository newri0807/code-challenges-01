import db from '@/lib/db';

export async function searchTweets(searchTerm: string) {
  const tweets = await db.tweet.findMany({
    where: {
      OR: [
        { tweet: { contains: searchTerm, mode: 'insensitive' } },
        { user: { username: { contains: searchTerm, mode: 'insensitive' } } }
      ]
    },
    include: {
      user: true,
      likes: true,
      retweets: true,
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 20 // 검색 결과 제한
  });

  return tweets;
}