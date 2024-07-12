"use client";

import React, {useState, useRef, useEffect} from "react";
import {EllipsisHorizontalIcon} from "@heroicons/react/24/outline";
import Modal from "./Modal";
import TweetForm from "./TweetForm";
import {deleteTweet} from "@/app/(home)/tweets/actions";
import {useRouter} from "next/navigation";

interface TweetActionsProps {
    tweetId: number;
}

const PopupTweetActions: React.FC<TweetActionsProps> = ({tweetId}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                popupRef.current.style.display = "none";
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEllipsisClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const popup = document.getElementById(`popup-${tweetId}`) as HTMLDivElement;
        if (popup) {
            popup.style.display = "block";
        }
    };

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    const onDelete = async () => {
        try {
            await deleteTweet(tweetId);
            router.refresh();
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    return (
        <div className="relative">
            <div
                className="relative flex items-center justify-center space-x-2 group hover:text-gray-500 cursor-pointer"
                onClick={handleEllipsisClick}
            >
                <EllipsisHorizontalIcon className="w-6 h-6 group-hover:text-gray-500" />
                <div
                    ref={popupRef}
                    id={`popup-${tweetId}`}
                    className="hidden absolute right-0 mt-2 w-48 bg-black border border-gray-600 rounded-md shadow-lg z-50"
                >
                    <button onClick={handleEditClick} className="block w-full px-4 py-2 text-left text-white hover:bg-gray-900">
                        Edit
                    </button>
                    <button onClick={onDelete} className="block w-full px-4 py-2 text-left text-white hover:bg-gray-900">
                        Delete
                    </button>
                </div>
            </div>
            {isEditModalOpen && (
                <Modal isOpen={isEditModalOpen} onClose={handleCloseModal}>
                    <TweetForm onClose={handleCloseModal} id={tweetId} />
                </Modal>
            )}
        </div>
    );
};

export default PopupTweetActions;
