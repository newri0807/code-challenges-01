import {EllipsisHorizontalIcon, HomeIcon, MagnifyingGlassIcon, UserIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import AddTweetButton from "./AddTweetButton";
import getSession from "@/lib/session";

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({icon, label, href, active = false}) => (
    <Link href={href} className={`flex items-center space-x-4 p-2 rounded-full ${active ? "bg-gray-800" : "hover:bg-gray-800"}`}>
        {icon}
        <span>{label}</span>
    </Link>
);

export default async function LeftSidebar() {
    const session = await getSession();

    return (
        <div className="w-64 border-r border-gray-700 p-4">
            <nav className="space-y-4">
                <div className="text-2xl font-bold mb-6">🖤</div>
                <NavItem icon={<HomeIcon className="h-6 w-6" />} label="홈" href="/" />
                <NavItem icon={<MagnifyingGlassIcon className="h-6 w-6" />} label="탐색하기" href="/explore" />
                {/* <NavItem icon={<Bell className="h-6 w-6" />} label="알림" href="/notifications" active />
                <NavItem icon={<Mail className="h-6 w-6" />} label="쪽지" href="/messages" />
                <NavItem icon={<Bookmark className="h-6 w-6" />} label="북마크" href="/bookmarks" /> */}
                <NavItem icon={<UserIcon className="h-6 w-6" />} label="프로필" href={`/profile/${session.id!}`} />
                <NavItem icon={<EllipsisHorizontalIcon className="h-6 w-6" />} label="더 보기" href="/more" />
            </nav>
            <AddTweetButton />
        </div>
    );
}
