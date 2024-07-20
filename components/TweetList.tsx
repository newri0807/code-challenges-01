import React from "react";
import Link from "next/link";
import {ArrowLeftIcon, ArrowRightIcon, ArrowPathRoundedSquareIcon, ChatBubbleLeftIcon, EyeIcon, HeartIcon} from "@heroicons/react/24/outline";
import {getTweets} from "@/app/actions";
import getSession from "@/lib/session";
import TweetItem from "./TweetItem";

interface TweetListProps {
    initialPage: number;
}

const TweetList: React.FC<TweetListProps> = async ({initialPage}) => {
    const limit = 10;
    const {tweets, totalPages} = await getTweets(initialPage, limit);
    const session = await getSession();

    return (
        <div className="flex-1 !pixel-border-r border-r border-gray-700 overflow-y-auto">
            <div className="!pixel-border-b border-b border-gray-700 p-4">
                <h2 className="text-xl font-bold">추천</h2>
            </div>
            <div className="p-4 space-y-4">
                {tweets.map((tweet) => (
                    <TweetItem key={tweet.id} tweet={tweet} sessionId={session?.id!} />
                ))}
            </div>
            <div className="flex justify-between items-center p-4 !pixel-border-t  border-t border-gray-700">
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
