"use client";
import React, {useEffect, useCallback} from "react";
import {ChatBubbleLeftIcon} from "@heroicons/react/24/outline";
import {getCommentCount} from "@/app/(home)/tweets/[id]/actions";
import {useResponseStore} from "@/store/TweetStore";

export function CommentCount({tweetId}: {tweetId: number}) {
    const {commentCounts, setCommentCount} = useResponseStore((state) => ({
        commentCounts: state.commentCounts,
        setCommentCount: state.setCommentCount,
    }));

    const fetchCommentCount = useCallback(async () => {
        const count = await getCommentCount(tweetId);
        setCommentCount(tweetId, count);
    }, [tweetId, setCommentCount]);

    useEffect(() => {
        fetchCommentCount();
    }, [fetchCommentCount]);

    return (
        <div className="flex items-center justify-center space-x-2 group hover:text-blue-500 cursor-pointer">
            <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
            <span className="text-md font-bold">댓글 {commentCounts[tweetId] ?? 0}</span>
        </div>
    );
}
