"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {ChatBubbleLeftIcon, ArrowPathRoundedSquareIcon, HeartIcon, EyeIcon} from "@heroicons/react/24/outline";
import PopupTweetActions from "./PopupTweetActions";
import Image from "next/image";

interface Tweet {
    id: number;
    tweet: string;
    created_at: Date;
    user: {
        username: string;
        id: number;
    };
}

interface TweetItemProps {
    tweet: Tweet;
    session: any;
}

const TweetItem: React.FC<TweetItemProps> = ({tweet, session}) => {
    const router = useRouter();

    const handleTweetClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest(".popup-actions")) {
            return;
        }
        router.push(`/tweets/${tweet.id}`);
    };

    return (
        <div className="relative">
            <div onClick={handleTweetClick} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-900 transition cursor-pointer">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-start space-x-3">
                        <Image
                            src={"/default-avatar.png"}
                            alt={tweet.user.id.toString()}
                            width={112}
                            height={112}
                            className="w-12 h-12 rounded-full border-4 border-black"
                        />
                        <div>
                            <p className="font-bold">{tweet.user.username}</p>
                            <p className="text-gray-500">
                                @{tweet.user.username.toLowerCase()} · {new Date(tweet.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {session.id === tweet.user.id && (
                        <div className="popup-actions">
                            <PopupTweetActions tweetId={tweet.id} />
                        </div>
                    )}
                </div>
                <p className="mt-2">{tweet.tweet}</p>
                <div className="flex justify-between pt-4">
                    <div className="flex items-center justify-center space-x-2 group hover:text-blue-500 cursor-pointer">
                        <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                        <span className="text-md font-bold">댓글</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 group hover:text-green-500">
                        <ArrowPathRoundedSquareIcon className="w-6 h-6 text-gray-400 group-hover:text-green-500 cursor-pointer" />
                        <span className="text-md font-bold">리트윗</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 group hover:text-red-500 cursor-pointer">
                        <HeartIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                        <span className="text-md font-bold">좋아요</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 group hover:text-yellow-500 cursor-pointer">
                        <EyeIcon className="w-6 h-6 text-gray-400 group-hover:text-yellow-500" />
                        <span className="text-md font-bold">조회수</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetItem;
