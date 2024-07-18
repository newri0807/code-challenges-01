"use client";

import React, {useEffect, useCallback, useState, useRef} from "react";
import {usePathname} from "next/navigation";
import {EyeIcon} from "@heroicons/react/24/outline";
import {updateViewCount, getViewCount} from "@/app/(home)/tweets/[id]/actions";

export function ViewCount({tweetId}: {tweetId: number}) {
    const pathname = usePathname();
    const [count, setCount] = useState<number>(0);
    const hasUpdated = useRef(false);

    const fetchAndUpdateCount = useCallback(async () => {
        if (hasUpdated.current) return;

        try {
            const currentCount = await getViewCount(tweetId);
            setCount(currentCount);

            if (pathname === `/tweets/${tweetId}`) {
                const newCount = await updateViewCount(tweetId);
                setCount(newCount);
                hasUpdated.current = true;
            }
        } catch (err) {
            console.error("Error fetching view count:", err);
        }
    }, [tweetId, pathname]);

    useEffect(() => {
        fetchAndUpdateCount();

        return () => {
            hasUpdated.current = false;
        };
    }, [fetchAndUpdateCount]);

    return (
        <div className="flex items-center justify-center space-x-2 group hover:text-yellow-500 cursor-pointer">
            <EyeIcon className="w-6 h-6 text-gray-400 group-hover:text-yellow-500" />
            <span className="text-md font-bold">조회수 {count}</span>
        </div>
    );
}
