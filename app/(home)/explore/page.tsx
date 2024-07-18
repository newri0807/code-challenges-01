import React from "react";
import TweetItem from "@/components/TweetItem";
import getSession from "@/lib/session";
import {searchTweets} from "./actions";

type Tweet = {
    id: number;
    tweet: string;
    created_at: Date;
    updated_at: Date;
    user: {
        id: number;
        username: string;
        password: string;
        email: string;
        bio: string | null;
        avatar: string | null;
        created_at: Date;
        updated_at: Date;
    };
    likes: Array<{
        id: number;
        created_at: Date;
        userId: number;
        tweetId: number;
    }>;
    retweets: Array<{
        id: number;
        created_at: Date;
        userId: number;
        tweetId: number;
    }>;
};

export default async function SearchPage({searchParams}: {searchParams: {q: string}}) {
    const session = await getSession();
    const searchTerm = searchParams.q || "";
    const searchResults: Tweet[] = searchTerm ? await searchTweets(searchTerm) : [];

    return (
        <div className="bg-black text-white min-h-screen w-full">
            <div className="p-4 w-full">
                <h1 className="text-2xl font-bold mb-6 text-white">트윗 검색</h1>
                <form action="/explore" method="get" className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            name="q"
                            defaultValue={searchTerm}
                            placeholder="검색어를 입력하세요"
                            className="w-full p-3 pl-10 bg-gray-900 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-3.5 text-gray-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </form>
                {searchResults.length > 0 ? (
                    <div className="space-y-4">
                        {searchResults.map((tweet) => (
                            <div key={tweet.id} className="bg-gray-900 rounded-lg p-4 shadow-md">
                                <TweetItem tweet={tweet} sessionId={session?.id!} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">{searchTerm ? "검색 결과가 없습니다." : "검색어를 입력하세요."}</p>
                )}
            </div>
        </div>
    );
}
