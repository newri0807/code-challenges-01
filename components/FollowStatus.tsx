"use client";

import {getFollowData, toggleFollow} from "@/app/(home)/profile/[id]/actions";
import React, {useEffect, useCallback, useState, useOptimistic} from "react";

interface FollowData {
    followingCount: number;
    followerCount: number;
    isFollowing: boolean;
}

interface FollowCountProps {
    userId: number;
    currentUserId: number;
}

const FollowingCount: React.FC<{count: number}> = ({count}) => (
    <span className="text-gray-300">
        <strong className="text-white">{count}</strong> 팔로잉
    </span>
);

const FollowerCount: React.FC<{count: number}> = ({count}) => (
    <span className="text-gray-300">
        <strong className="text-white">{count}</strong> 팔로워
    </span>
);

const FollowButton: React.FC<{isFollowing: boolean; onClick: () => void; isUpdating: boolean}> = ({isFollowing, onClick, isUpdating}) => (
    <button
        onClick={onClick}
        disabled={isUpdating}
        className={`px-4 py-2 rounded-full font-bold ${isFollowing ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"} text-white ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
        {isUpdating ? (
            <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 2.042.632 3.938 1.709 5.291l1.291-1.291z"
                    ></path>
                </svg>
                Loading...
            </span>
        ) : isFollowing ? (
            "Unfollow"
        ) : (
            "Follow"
        )}
    </button>
);

const FollowStatus: React.FC<FollowCountProps> = ({userId, currentUserId}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [followData, setFollowData] = useState<FollowData>({
        followingCount: 0,
        followerCount: 0,
        isFollowing: false,
    });

    const fetchFollowData = useCallback(async () => {
        try {
            const data = await getFollowData(userId, currentUserId);
            setFollowData(data);
        } catch (error) {
            console.error("Failed to fetch follow data:", error);
        }
    }, [userId, currentUserId]);

    useEffect(() => {
        fetchFollowData();
    }, [fetchFollowData]);

    const [optimisticData, setOptimisticData] = useOptimistic<FollowData, boolean>(followData, (state, newIsFollowing) => ({
        ...state,
        isFollowing: newIsFollowing,
        followerCount: newIsFollowing ? state.followerCount + 1 : state.followerCount - 1,
    }));

    const handleToggleFollow = async () => {
        if (isUpdating) return;

        setIsUpdating(true);
        const newIsFollowing = !followData.isFollowing;

        // Optimistic update
        setOptimisticData(newIsFollowing);

        try {
            await toggleFollow(currentUserId, userId);
            // After successful toggle, fetch the latest data
            const latestData = await getFollowData(userId, currentUserId);
            setFollowData(latestData);
        } catch (error) {
            console.error("Failed to toggle follow:", error);
            // Revert optimistic update on error
            setOptimisticData(followData.isFollowing);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="mr-2 flex space-x-4 items-center">
            <FollowingCount count={optimisticData.followingCount} />
            <FollowerCount count={optimisticData.followerCount} />
            {userId !== currentUserId && (
                <FollowButton isFollowing={optimisticData.isFollowing} onClick={handleToggleFollow} isUpdating={isUpdating} />
            )}
        </div>
    );
};

export default FollowStatus;
