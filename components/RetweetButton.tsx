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

    useEffect(() => {
        getRetweetStatus(tweetId)
            .then((status) => {
                setServerRetweetState(status);
                addOptimisticRetweetState(status);
            })
            .catch((err) => {
                console.error("Error fetching retweet status:", err);
            });
    }, [tweetId, addOptimisticRetweetState]);

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
            addOptimisticRetweetState(serverRetweetState);
        }
    }, [tweetId, optimisticRetweetState, addOptimisticRetweetState, serverRetweetState]);

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
