import React from "react";
import Link from "next/link";
import {ArrowLeftIcon, ArrowRightIcon, ArrowPathRoundedSquareIcon, ChatBubbleLeftIcon, EyeIcon, HeartIcon} from "@heroicons/react/24/outline";
import {getTweets} from "@/app/actions";

interface Tweet {
    id: number;
    tweet: string;
    created_at: Date;
    user: {
        username: string;
    };
}

interface TweetListProps {
    initialPage: number;
}

const TweetList: React.FC<TweetListProps> = async ({initialPage}) => {
    const limit = 10;
    const {tweets, totalPages} = await getTweets(initialPage, limit);

    return (
        <div className="flex-1 border-r border-gray-700 overflow-y-auto">
            <div className="border-b border-gray-700 p-4">
                <h2 className="text-xl font-bold">추천</h2>
            </div>
            <div className="p-4 space-y-4">
                {tweets.map((tweet: Tweet) => (
                    <Link href={`/tweets/${tweet.id}`} key={tweet.id} className="block">
                        <div className="border border-gray-700 rounded-lg p-4 hover:bg-gray-900 transition">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                                <div>
                                    <p className="font-bold">{tweet.user.username}</p>
                                    <p className="text-gray-500">
                                        @{tweet.user.username.toLowerCase()} · {new Date(tweet.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-2">{tweet.tweet}</p>
                            <div className="flex justify-between pt-4">
                                <div className="flex items-center justify-center space-x-2">
                                    <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400" />
                                    <span className="text-sm font-bold">댓글</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <ArrowPathRoundedSquareIcon className="w-6 h-6 text-gray-400" />
                                    <span className="text-sm font-bold">리트윗</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <HeartIcon className="w-6 h-6 text-gray-400" />
                                    <span className="text-sm font-bold">좋아요</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <EyeIcon className="w-6 h-6 text-gray-400" />
                                    <span className="text-sm font-bold">조회수</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flex justify-between items-center p-4 border-t border-gray-700">
                <Link href={`/?page=${initialPage > 1 ? initialPage - 1 : 1}`} className={`flex items-center ${initialPage <= 1 ? "invisible" : ""}`}>
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    이전
                </Link>
                <p>
                    페이지 {initialPage} / {totalPages}
                </p>
                <Link
                    href={`/?page=${initialPage < totalPages ? initialPage + 1 : totalPages}`}
                    className={`flex items-center ${initialPage >= totalPages ? "invisible" : ""}`}
                >
                    다음
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
};

export default TweetList;
