"use client";

import React, {useEffect, useCallback, useState, useRef} from "react";
import {usePathname} from "next/navigation";
import {EyeIcon} from "@heroicons/react/24/outline";
import {updateViewCount, getViewCount} from "@/app/(home)/tweets/[id]/actions";

export function ViewCount({tweetId}: {tweetId: number}) {
    const pathname = usePathname();
    const [count, setCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const hasUpdated = useRef(false);
    const mountCount = useRef(0);

    const fetchAndUpdateCount = useCallback(async () => {
        console.log(`Fetching count for tweet ${tweetId}. Has updated: ${hasUpdated.current}`);
        if (hasUpdated.current) {
            console.log("Update already performed, skipping");
            return;
        }

        try {
            const currentCount = await getViewCount(tweetId);
            console.log(`Current count from server: ${currentCount}`);
            setCount(currentCount);

            if (pathname === `/tweets/${tweetId}`) {
                console.log("Updating view count on server");
                const newCount = await updateViewCount(tweetId);
                console.log(`New count from server: ${newCount}`);
                setCount(newCount);
                hasUpdated.current = true;
            }
        } catch (err) {
            console.error("Error fetching view count:", err);
            setError("Failed to load view count");
        }
    }, [tweetId, pathname]);

    useEffect(() => {
        mountCount.current += 1;
        console.log(`Component mounted. Mount count: ${mountCount.current}`);

        fetchAndUpdateCount();

        return () => {
            console.log("Component will unmount");
            hasUpdated.current = false;
        };
    }, [fetchAndUpdateCount]);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (count === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center space-x-2 group hover:text-yellow-500 cursor-pointer">
            <EyeIcon className="w-6 h-6 text-gray-400 group-hover:text-yellow-500" />
            <span className="text-md font-bold">조회수 {count}</span>
        </div>
    );
}
