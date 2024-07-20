import {HomeIcon, MagnifyingGlassIcon, UserIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import AddTweetButton from "./AddTweetButton";
import getSession from "@/lib/session";
import Image from "next/image";
import MoreButton from './MoreButton';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({icon, label, href, active = false}) => (
    <Link
        href={href}
        className={`flex items-center space-x-4 p-2 !pixel-border transition-all
            ${active ? "bg-gray-700 !pixel-border-b" : "hover:bg-gray-800 hover:!pixel-border-b"}`}
    >
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        <span className="pixel-font text-lg">{label}</span>
    </Link>
);

export default async function LeftSidebar() {
    const session = await getSession();

    return (
        <div className="p-5">
            <nav className="space-y-4">
                <div className="text-2xl font-bold mb-6 pixel-font">
                    <Image width={100} height={100} src={"/logo0.png"} alt="logo" className="pixelated" />
                </div>
                <NavItem icon={<HomeIcon className="w-5 h-5" />} label="홈" href="/" />
                <NavItem icon={<MagnifyingGlassIcon className="w-5 h-5" />} label="검색하기" href="/explore" />
                <NavItem icon={<UserIcon className="w-5 h-5" />} label="프로필" href={`/profile/${session.id!}`} />
                <MoreButton />
            </nav>
            <div className="mt-6">
                <AddTweetButton />
            </div>
        </div>
    );
}
