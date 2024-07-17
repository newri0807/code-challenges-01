"use client";

import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {ChatBubbleLeftIcon, ArrowPathRoundedSquareIcon, HeartIcon, EyeIcon} from "@heroicons/react/24/outline";
import PopupTweetActions from "./PopupTweetActions";
import Image from "next/image";
import {LikeButton} from "@/components/LikeButton";
import {CommentCount} from "@/components/CommentCount";
import {ViewCount} from "@/components/ViewCount";
import {RetweetButton} from "./RetweetButton";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

interface Tweet {
    id: number;
    tweet: string;
    created_at: Date;
    image?: string | null;
    user: {
        username: string;
        id: number;
        avatar: string | null;
    };
    likes: {id: number; userId: number; tweetId: number}[];
}

interface TweetItemProps {
    tweet: Tweet;
    sessionId: number;
}

const TweetItem: React.FC<TweetItemProps> = ({tweet, sessionId}) => {
    const router = useRouter();
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        if (typeof tweet.image === "string" && tweet.image.trim() !== "") {
            setShowImage(true);
            setIsImageLoading(true);
        }
    }, [tweet.image]);

    const handleTweetClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest(".no-propagation")) {
            return;
        }
        router.push(`/tweets/${tweet.id}`);
    };

    const handleActionClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    console.log(tweet.id, tweet.image);

    return (
        <div className="relative">
            <div onClick={handleTweetClick} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-900 transition cursor-pointer">
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-start space-x-3">
                        <Image
                            src={tweet.user.avatar || "/default-avatar.png"}
                            alt={tweet.user.id.toString()}
                            width={112}
                            height={112}
                            className="w-12 h-12 rounded-full border-4 border-black bg-white"
                            onClick={(event: React.MouseEvent) => {
                                event.stopPropagation();
                                router.push(`/profile/${tweet.user.id}`);
                            }}
                        />
                        <div>
                            <p className="font-bold">{tweet.user.username}</p>
                            <p className="text-gray-500">
                                @{tweet.user.username.toLowerCase()} · {new Date(tweet.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {sessionId === tweet.user.id && (
                        <div className="popup-actions no-propagation">
                            <PopupTweetActions tweetId={tweet.id} />
                        </div>
                    )}
                </div>
                <p className="mt-2">{tweet.tweet}</p>
                {showImage && (
                    <div className="my-4 relative">
                        {isImageLoading && <LoadingSpinner />}
                        <Image
                            src={tweet.image as string}
                            alt="Tweet image"
                            width={400}
                            height={300}
                            className={`rounded-lg max-h-60 w-full h-auto object-contain ${isImageLoading ? "invisible" : "visible"}`}
                            onLoad={() => setIsImageLoading(false)}
                            onError={() => setIsImageLoading(false)}
                        />
                    </div>
                )}
                <div className="flex justify-between pt-4">
                    <div
                        className="flex items-center justify-center space-x-2 group hover:text-blue-500 cursor-pointer no-propagation"
                        onClick={handleActionClick}
                    >
                        <CommentCount tweetId={tweet.id} />
                    </div>
                    <div className="flex items-center justify-center space-x-2 group hover:text-green-500 no-propagation" onClick={handleActionClick}>
                        <RetweetButton tweetId={tweet.id} />
                    </div>
                    <div
                        className="flex items-center justify-center space-x-2 group hover:text-red-500 cursor-pointer no-propagation"
                        onClick={handleActionClick}
                    >
                        <LikeButton tweetId={tweet.id} />
                    </div>
                    <div
                        className="flex items-center justify-center space-x-2 group hover:text-yellow-500 cursor-pointer no-propagation"
                        onClick={handleActionClick}
                    >
                        <ViewCount tweetId={tweet.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetItem;
