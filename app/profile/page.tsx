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
        <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-12">
                <div className="flex items-center space-x-4 mb-6">
                    <Image src={"/default-avatar.png"} alt={user.username} width={96} height={96} className="w-24 h-24 rounded-full" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                        <p className="text-gray-600">@{user.username}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Bio</h3>
                    <p className="text-gray-700 mt-2">{user.bio || "No bio available"}</p>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-700 mt-2">{user.email}</p>
                </div>
                <form action={logOut}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out w-full">
                        Log Out
                    </button>
                </form>
            </div>
        </div>
    );
}
