import getSession from "@/lib/session";
import {notFound, redirect} from "next/navigation";
import db from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

async function getUser() {
    const session = await getSession();

    console.log(session.id, "session----------");
    if (session?.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });

        if (user) {
            return user;
        }
    }
    notFound();
}

export default async function ProfilePage() {
    const user = await getUser();

    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/log-in");
    };

    return (
        <div className="bg-black text-white min-h-screen w-full">
            {/* Header */}
            <div className="border-b border-gray-700 p-4">
                <h1 className="text-xl font-bold">프로필</h1>
            </div>

            {/* Profile Content */}
            <div className="p-4">
                {/* Banner Image */}
                <div className="h-32 bg-blue-500 rounded-t-xl"></div>

                {/* Avatar and Edit Button */}
                <div className="relative flex justify-between items-end px-4 -mt-16">
                    <Image
                        src={"/default-avatar.png"}
                        alt={user.username}
                        width={112}
                        height={112}
                        className="w-28 h-28 rounded-full border-4 border-black"
                    />
                    <button className="bg-black text-white px-4 py-2 rounded-full border border-gray-600 font-bold">프로필 수정</button>
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

                    <div className="mt-4 flex space-x-4">
                        <span className="text-gray-300">
                            <strong className="text-white">0</strong> 팔로잉
                        </span>
                        <span className="text-gray-300">
                            <strong className="text-white">0</strong> 팔로워
                        </span>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <div className="p-4">
                <form action={logOut}>
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out">
                        로그아웃
                    </button>
                </form>
            </div>
        </div>
    );
}
