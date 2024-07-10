import {notFound} from "next/navigation";
import Link from "next/link";
import db from "@/lib/db";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import Image from "next/image";
import {ArrowPathRoundedSquareIcon, ChatBubbleLeftIcon, EyeIcon, HeartIcon} from "@heroicons/react/24/outline";

export default async function TweetPage({params}: {params: {id: string}}) {
    const tweet = await db.tweet.findUnique({
        where: {id: Number(params.id)},
        include: {user: true},
    });

    if (!tweet) {
        notFound();
    }

    return (
        <div className="bg-black text-white min-h-screen w-full">
            {/* Header */}
            <div className="border-b border-gray-700 p-4">
                <Link href="/" className="flex items-center text-blue-500">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    홈으로 돌아가기
                </Link>
            </div>
            <div className="border-b border-gray-700 pb-4 mb-4 p-4">
                <div className="flex items-center space-x-4">
                    <Image
                        src={"/default-avatar.png"}
                        alt={tweet.user.username}
                        width={56}
                        height={56}
                        className="rounded-full border-2 border-gray-700"
                    />
                    <p className="font-semibold text-xl">{tweet.user.username}</p>
                </div>
                <p className="mt-4 text-2xl">{tweet.tweet}</p>
                <p className="text-sm text-gray-500 mt-2">게시일: {new Date(tweet.created_at).toLocaleString()}</p>
            </div>
            <div className="flex justify-between pb-4 px-4 border-b border-gray-700 ">
                <div className="flex items-center justify-center space-x-2">
                    <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-lg font-bold">댓글</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <ArrowPathRoundedSquareIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-lg font-bold">리트윗</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <HeartIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-lg font-bold">좋아요</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <EyeIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-lg font-bold">조회수</span>
                </div>
            </div>
        </div>
    );
}
