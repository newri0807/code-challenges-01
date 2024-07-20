"use client";

import React, {useState} from "react";
import {PlusIcon} from "@heroicons/react/24/outline";
import Modal from "./Modal";
import TweetForm from "./TweetForm";

const MobileAddButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className="pixel-button fixed bottom-20 right-4 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-3 z-50"
            >
                <PlusIcon className="h-6 w-6" />
            </button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <TweetForm onClose={handleCloseModal} />
            </Modal>
        </>
    );
};

export default MobileAddButton;
