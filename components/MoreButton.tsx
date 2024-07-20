"use client";

import React from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

const MoreButton: React.FC = () => {
    const handleMoreClick = () => {
        alert("준비중입니다.");
    };

    return (
        <button
            onClick={handleMoreClick}
            className="flex items-center space-x-4 p-2 !pixel-border transition-all w-full text-left hover:bg-gray-800 hover:!pixel-border-b"
        >
            <div className="w-6 h-6 flex items-center justify-center">
                <EllipsisHorizontalIcon className="w-5 h-5" />
            </div>
            <span className="pixel-font text-lg">더 보기</span>
        </button>
    );
};

export default MoreButton;