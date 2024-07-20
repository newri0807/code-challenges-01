import getSession from "@/lib/session";
import {notFound, redirect} from "next/navigation";
import db from "@/lib/db";
import Image from "next/image";
import EditProfileModal from "@/components/EditProfileModal";
import FollowStatus from "@/components/FollowStatus";
import TweetItem from "@/components/TweetItem"; // TweetItem 컴포넌트 import
import Link from "next/link";

async function getUser(userId: number) {
    const user = await db.user.findUnique({
        where: {id: userId},
    });

    if (user) {
        return user;
    }
    notFound();
}

async function getUserTweets(userId: number) {
    const tweets = await db.tweet.findMany({
        where: {userId: userId},
        include: {
            user: true,
            likes: true,
            retweets: true,
        },
        orderBy: {created_at: "desc"},
    });

    return tweets;
}

interface ProfilePageProps {
    params: {id: string};
}

export default async function ProfilePage({params}: ProfilePageProps) {
    const session = await getSession();
    const userId = Number(params.id);
    const user = await getUser(userId);
    const tweets = await getUserTweets(userId);

    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/");
    };

    if (!user) return null;

    return (
        <div className="bg-black text-white min-h-screen w-full">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-black bg-opacity-80 backdrop-blur-md !pixel-border-b border-b border-gray-800 p-4 flex items-center">
                <Link href="/" className="mr-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">{user.username}</h1>
                    <p className="text-sm text-gray-500">{tweets.length} 트윗</p>
                </div>
            </header>

            {/* Profile Content */}
            <div>
                {/* Banner Image */}
                <div className="h-48 bg-gray-800"></div>

                {/* Avatar and Edit Button */}
                <div className="relative px-4">
                    <Image
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.username}
                        width={134}
                        height={134}
                        className="absolute -top-16 w-32 h-32 rounded-full border-4 !pixel-border-b border-black bg-white"
                    />
                    <div className="flex justify-end pt-4 gap-2 item-center">
                        <FollowStatus userId={userId} currentUserId={session?.id!} />
                        {session?.id === userId && <EditProfileModal user={user} />}
                    </div>
                </div>

                {/* User Info */}
                <div className="mt-4 px-4">
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-500">@{user.username}</p>

                    <p className="mt-4 text-gray-300">{user.bio || "소개가 없습니다"}</p>

                    <div className="mt-4 flex items-center text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                            />
                        </svg>
                        {user.email}
                    </div>

                    {/* Logout Button */}
                    {session?.id === userId && (
                        <div className="mt-4">
                            <form action={logOut}>
                                <button className="pixel-button w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out">
                                    Log out
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* User's Tweets */}
            <div className="mt-4 !pixel-border-t  border-t border-gray-800">
                {tweets.length > 0 ? (
                    <div>
                        {tweets.map((tweet) => (
                            <div
                                key={tweet.id}
                                className="!pixel-border-b border-b border-gray-800 p-4 hover:bg-gray-900 transition duration-200 ease-in-out"
                            >
                                <TweetItem tweet={tweet} sessionId={session?.id!} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 p-4">아직 트윗이 없습니다.</p>
                )}
            </div>
        </div>
    );
}
