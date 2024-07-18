"use client";

import {getFollowData, toggleFollow} from "@/app/(home)/profile/[id]/actions";
import React, {useEffect, useCallback, useState} from "react";
import {useOptimistic} from "react";

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
            isUpdating ? "opacity-50" : ""
        }`}
    >
        {isFollowing ? "Unfollow" : "Follow"}
    </button>
);

const FollowStatus: React.FC<FollowCountProps> = ({userId, currentUserId}) => {
    const [followData, setFollowData] = useState<FollowData>({
        followingCount: 0,
        followerCount: 0,
        isFollowing: false,
    });

    const [optimisticFollowerCount, updateOptimisticFollowerCount] = useOptimistic(
        followData.followerCount,
        (state, newFollowerCount: number) => newFollowerCount
    );

    const [isUpdating, setIsUpdating] = useState(false);

    const fetchFollowData = useCallback(async () => {
        try {
            const data = await getFollowData(userId, currentUserId);
            setFollowData(data);
            updateOptimisticFollowerCount(data.followerCount);
        } catch (error) {
            console.error("Failed to fetch follow data:", error);
        }
    }, [userId, currentUserId, updateOptimisticFollowerCount]);

    useEffect(() => {
        fetchFollowData();
    }, [fetchFollowData]);

    const handleToggleFollow = async () => {
        if (isUpdating) return;

        setIsUpdating(true);
        const newIsFollowing = !followData.isFollowing;
        const newFollowerCount = newIsFollowing ? optimisticFollowerCount + 1 : optimisticFollowerCount - 1;

        updateOptimisticFollowerCount(newFollowerCount);

        try {
            await toggleFollow(currentUserId, userId);
            const newData = await getFollowData(userId, currentUserId);
            setFollowData(newData);
            updateOptimisticFollowerCount(newData.followerCount);
        } catch (error) {
            console.error("Failed to toggle follow:", error);
            updateOptimisticFollowerCount(followData.followerCount);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="mt-4 flex space-x-4 items-center">
            <FollowingCount count={followData.followingCount} />
            <FollowerCount count={optimisticFollowerCount} />
            {userId !== currentUserId && <FollowButton isFollowing={followData.isFollowing} onClick={handleToggleFollow} isUpdating={isUpdating} />}
        </div>
    );
};

export default FollowStatus;
