"use client";

import {getFollowData, toggleFollow} from "@/app/(home)/profile/[id]/actions";
import React, {useEffect, useState} from "react";
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

const FollowCount: React.FC<FollowCountProps> = ({userId, currentUserId}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [followData, setFollowData] = useState<FollowData>({
        followingCount: 0,
        followerCount: 0,
        isFollowing: false,
    });

    const [optimisticFollowData, updateOptimisticFollowData] = useOptimistic<FollowData, Partial<FollowData>>(followData, (state, newData) => ({
        ...state,
        ...newData,
    }));

    useEffect(() => {
        const fetchFollowData = async () => {
            setIsLoading(true);
            try {
                const data = await getFollowData(userId, currentUserId);
                setFollowData(data);
                updateOptimisticFollowData(data);
            } catch (error) {
                console.error("Failed to fetch follow data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFollowData();
    }, [userId, currentUserId]);

    const handleToggleFollow = async () => {
        const newIsFollowing = !optimisticFollowData.isFollowing;
        updateOptimisticFollowData({
            isFollowing: newIsFollowing,
            followerCount: newIsFollowing ? optimisticFollowData.followerCount + 1 : optimisticFollowData.followerCount - 1,
        });
        await toggleFollow(currentUserId, userId);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-4 flex space-x-4 items-center">
            <span className="text-gray-300">
                <strong className="text-white">{optimisticFollowData.followingCount}</strong> 팔로잉
            </span>
            <span className="text-gray-300">
                <strong className="text-white">{optimisticFollowData.followerCount}</strong> 팔로워
            </span>
            {userId !== currentUserId && (
                <button
                    onClick={handleToggleFollow}
                    className={`px-4 py-2 rounded-full font-bold ${
                        optimisticFollowData.isFollowing ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                >
                    {optimisticFollowData.isFollowing ? "Unfollow" : "Follow"}
                </button>
            )}
        </div>
    );
};

export default FollowCount;
