"use client";
import React, {useState} from "react";
import Modal from "./Modal";
import TweetForm from "./TweetForm";

export default function AddTweetButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleAdd = () => {
        setIsModalOpen(true);
    };
    return (
        <div>
            <button onClick={handleAdd} className="w-full bg-blue-500 text-white rounded-full py-3 mt-4 font-bold">
                게시하기
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <TweetForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
}
