import React from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import db from "@/lib/db";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import Image from "next/image";
import {ArrowPathRoundedSquareIcon} from "@heroicons/react/24/outline";
import {
    ArrowPathRoundedSquareIcon as FullArrowPathRoundedSquareIcon,
    ChatBubbleLeftIcon as FullChatBubbleLeftIcon,
    EyeIcon as FullEyeIcon,
    HeartIcon as FullHeartIcon,
} from "@heroicons/react/24/solid";
import TweetForm from "@/components/TweetForm";
import Modal from "@/components/Modal";
import getSession from "@/lib/session";
import PopupTweetActions from "@/components/PopupTweetActions";
import {LikeButton} from "@/components/LikeButton";
import {ResponsePage} from "@/components/ResponsePage";
import {ViewCount} from "@/components/ViewCount";
import {CommentCount} from "@/components/CommentCount";
import {RetweetButton} from "@/components/RetweetButton";

export default async function TweetPage({params}: {params: {id: string}}) {
    const tweet = await db.tweet.findUnique({
        where: {id: Number(params.id)},
        include: {user: true, responses: {include: {user: true}}, likes: true, retweets: true},
    });

    if (!tweet) {
        notFound();
    }

    const session = await getSession();
    const isOwner = session?.id === tweet.userId;

    return (
        <div className="bg-black text-white min-h-screen w-full">
            {/* Header */}
            <div className="!pixel-border-b border-b border-gray-700 p-4">
                <Link href="/" className="flex items-center text-blue-500">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    홈으로 돌아가기
                </Link>
            </div>
            <div className="!pixel-border-b border-b border-gray-700 pb-4 mb-4 p-4">
                <div className="flex w-full justify-between item-center">
                    <div className="flex items-center space-x-4">
                        <Link href={`/profile/${tweet.user.id}`}>
                            <Image
                                src={tweet.user.avatar || "/default-avatar.png"}
                                alt={tweet.user.username}
                                width={56}
                                height={56}
                                className="rounded-full border-2 border-gray-700 bg-white"
                            />
                        </Link>
                        <p className="font-semibold text-xl">{tweet.user.username}</p>
                    </div>

                    {isOwner && <PopupTweetActions tweetId={tweet.id} />}
                </div>

                <p className="mt-4 text-2xl">{tweet.tweet}</p>
                {tweet.image ? (
                    <div className="my-4">
                        <Image
                            src={tweet.image}
                            alt="Tweet image"
                            width={400}
                            height={300}
                            className="rounded-lg max-h-60 w-full h-auto object-contain "
                        />
                    </div>
                ) : (
                    <div className="flex justify-center items-center align-middle max-h-60">
                        <div className="animate-spin rounded-full h-12 w-12 !pixel-border-t  border-t-2 !pixel-border-b border-b-2 !pixel-border-b border-blue-500"></div>
                    </div>
                )}
                <p className="text-sm text-gray-500 mt-2">게시일: {new Date(tweet.created_at).toLocaleString()}</p>
            </div>
            <div className="flex justify-between pb-4 px-4 !pixel-border-b border-b border-gray-700">
                <div className="flex items-center justify-center space-x-2 group hover:text-blue-500 cursor-pointer">
                    <CommentCount tweetId={tweet.id} />
                </div>
                <div className="flex items-center justify-center space-x-2 group hover:text-green-500">
                    <RetweetButton tweetId={tweet.id} />
                </div>
                <div className="flex items-center justify-center space-x-2 group hover:text-red-500 cursor-pointer">
                    <LikeButton tweetId={tweet.id} />
                </div>
                <div className="flex items-center justify-center space-x-2 group hover:text-yellow-500 cursor-pointer">
                    <ViewCount tweetId={tweet.id} />
                </div>
            </div>
            <ResponsePage initialResponses={tweet.responses} sessionUserId={session!.id!} tweetId={tweet.id} isOwner={isOwner} />
        </div>
    );
}
