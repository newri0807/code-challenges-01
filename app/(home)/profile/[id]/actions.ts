"use server";

import db from "@/lib/db";
import {User} from "@/lib/type";
import {revalidatePath} from "next/cache";

export async function getProfileData(userId: number) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const user = await db.user.findUnique({
        where: {id: userId},
        select: {
            username: true,
            email: true,
            bio: true,
            avatar: true,
        },
    });

    return user;
}

export async function updateUser(data: Partial<User> & {id: number}) {
    const {id, username, email, bio, avatar} = data;

    console.log("Updating user:", data);

    try {
        const updatedUser = await db.user.update({
            where: {id},
            data: {username, email, bio, avatar},
        });

        revalidatePath(`/profile`);
        return {success: true, user: updatedUser};
    } catch (error) {
        console.error("Error updating user:", error);
        return {success: false, error: "Failed to update user"};
    }
}

export async function getFollowData(userId: number, currentUserId: number) {
    const followingCount = await getFollowingCount(userId);
    const followerCount = await getFollowerCount(userId);
    const isFollowing = await checkIsFollowing(currentUserId, userId);

    return {followingCount, followerCount, isFollowing};
}

export async function toggleFollow(followerId: number, followingId: number) {
    const isAlreadyFollowing = await checkIsFollowing(followerId, followingId);

    if (isAlreadyFollowing) {
        await unfollowUser(followerId, followingId);
    } else {
        await followUser(followerId, followingId);
    }

    //revalidatePath(`/profile/${followingId}`);
    return !isAlreadyFollowing;
}

async function getFollowingCount(userId: number) {
    try {
        return await db.follow.count({
            where: {followerId: userId},
        });
    } catch (error) {
        console.error("Failed to get following count:", error);
        return 0;
    }
}

async function getFollowerCount(userId: number) {
    try {
        return await db.follow.count({
            where: {followingId: userId},
        });
    } catch (error) {
        console.error("Failed to get follower count:", error);
        return 0;
    }
}

async function checkIsFollowing(followerId: number, followingId: number) {
    try {
        const follow = await db.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
        return !!follow;
    } catch (error) {
        console.error("Failed to check follow status:", error);
        return false;
    }
}

async function followUser(followerId: number, followingId: number) {
    try {
        await db.follow.create({
            data: {
                followerId,
                followingId,
            },
        });
    } catch (error) {
        console.error("Failed to follow user:", error);
    }
}

async function unfollowUser(followerId: number, followingId: number) {
    try {
        await db.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });
    } catch (error) {
        console.error("Failed to unfollow user:", error);
    }
}
