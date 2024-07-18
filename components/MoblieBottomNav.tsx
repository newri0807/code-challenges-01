import {HomeIcon, MagnifyingGlassIcon, UserIcon, PlusIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import getSession from "@/lib/session"; // 서버 사이드 세션 가져오기 함수

interface NavItemProps {
    icon: React.ReactNode;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({icon, href}) => (
    <Link href={href} className="flex items-center justify-center p-2 text-gray-500">
        {icon}
    </Link>
);

export default async function MobileBottomNav() {
    const session = await getSession();

    if (!session) return null; // 세션이 없으면 내비게이션 바를 렌더링하지 않음

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center h-14 z-50">
                <NavItem icon={<HomeIcon className="h-6 w-6" />} href="/" />
                <NavItem icon={<MagnifyingGlassIcon className="h-6 w-6" />} href="/explore" />
                <NavItem icon={<UserIcon className="h-6 w-6" />} href={`/profile/${session.id}`} />
            </nav>
            {/* <Link href="/compose/tweet" className="fixed bottom-20 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg z-50">
                <PlusIcon className="h-6 w-6" />
            </Link> */}
        </>
    );
}
