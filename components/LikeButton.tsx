"use client";

import React, {useCallback, useEffect, useOptimistic, useState} from "react";
import {HeartIcon as OutlineHeartIcon} from "@heroicons/react/24/outline";
import {HeartIcon as SolidHeartIcon} from "@heroicons/react/24/solid";
import { getLikeStatus, toggleLike } from '@/app/(home)/tweets/[id]/actions';


type LikeButtonProps = {
    tweetId: number;
};

type LikeState = {
    likes: number;
    isLiked: boolean;
};

export function LikeButton({tweetId}: LikeButtonProps) {
    const [serverLikeState, setServerLikeState] = useState<LikeState>({likes: 0, isLiked: false});
    const [optimisticLikeState, addOptimisticLikeState] = useOptimistic(serverLikeState, (state: LikeState, newState: Partial<LikeState>) => ({
        ...state,
        ...newState,
    }));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getLikeStatus(tweetId)
            .then((status) => {
                setServerLikeState(status);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching like status:", err);
                setError("Failed to load like status");
                setIsLoading(false);
            });
    }, [tweetId]);

    const handleClick = useCallback(async () => {
        const optimisticUpdate = {
            likes: optimisticLikeState.isLiked ? optimisticLikeState.likes - 1 : optimisticLikeState.likes + 1,
            isLiked: !optimisticLikeState.isLiked,
        };
        addOptimisticLikeState(optimisticUpdate);

        try {
            const result = await toggleLike(tweetId);
            setServerLikeState(result);
        } catch (err) {
            console.error("Error toggling like:", err);
            setError("Failed to update like");
            // Revert to the server state if there's an error
            addOptimisticLikeState(serverLikeState);
        }
    }, [tweetId, optimisticLikeState, addOptimisticLikeState, serverLikeState]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex items-center justify-center space-x-2 group hover:text-red-500 cursor-pointer" onClick={handleClick}>
            {optimisticLikeState.isLiked ? (
                <SolidHeartIcon className="w-6 h-6 text-red-500" />
            ) : (
                <OutlineHeartIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
            )}
            <span className="text-md font-bold">{optimisticLikeState.likes}</span>
        </div>
    );
}
