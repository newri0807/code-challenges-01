"use client";

import React, {useCallback, useEffect, useOptimistic, useState} from "react";
import {ArrowPathRoundedSquareIcon} from "@heroicons/react/24/outline";
import {ArrowPathRoundedSquareIcon as SolidArrowPathRoundedSquareIcon} from "@heroicons/react/24/solid";
import {toggleRetweet, getRetweetStatus} from "@/app/(home)/tweets/[id]/actions";

type RetweetButtonProps = {
    tweetId: number;
};

type RetweetState = {
    retweetCount: number;
    retweeted: boolean;
};

export function RetweetButton({tweetId}: RetweetButtonProps) {
    const [serverRetweetState, setServerRetweetState] = useState<RetweetState>({retweetCount: 0, retweeted: false});
    const [optimisticRetweetState, addOptimisticRetweetState] = useOptimistic(
        serverRetweetState,
        (state: RetweetState, newState: Partial<RetweetState>) => ({...state, ...newState})
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getRetweetStatus(tweetId)
            .then((status) => {
                setServerRetweetState(status);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching retweet status:", err);
                setError("Failed to load retweet status");
                setIsLoading(false);
            });
    }, [tweetId]);

    const handleRetweet = useCallback(async () => {
        const optimisticUpdate = {
            retweetCount: optimisticRetweetState.retweeted ? optimisticRetweetState.retweetCount - 1 : optimisticRetweetState.retweetCount + 1,
            retweeted: !optimisticRetweetState.retweeted,
        };
        addOptimisticRetweetState(optimisticUpdate);

        try {
            const result = await toggleRetweet(tweetId);
            setServerRetweetState(result);
        } catch (err) {
            console.error("Error toggling retweet:", err);
            setError("Failed to retweet");
            // Revert to the server state if there's an error
            addOptimisticRetweetState(serverRetweetState);
        }
    }, [tweetId, optimisticRetweetState, addOptimisticRetweetState, serverRetweetState]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex items-center justify-center space-x-2 group hover:text-green-500 cursor-pointer" onClick={handleRetweet}>
            {optimisticRetweetState.retweeted ? (
                <SolidArrowPathRoundedSquareIcon className="w-6 h-6 text-green-500" />
            ) : (
                <ArrowPathRoundedSquareIcon className="w-6 h-6 text-gray-400 group-hover:text-green-500" />
            )}
            <span className="text-md font-bold">{optimisticRetweetState.retweetCount}</span>
        </div>
    );
}
