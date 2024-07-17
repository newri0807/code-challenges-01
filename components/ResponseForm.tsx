"use client";

import React, {useState, useEffect} from "react";
import {Response_} from "@/lib/type";
import { useResponseStore } from '@/store/TweetStore';

type ResponseFormProps = {
    tweetId: number;
    sessionUserId: number;
    editingResponse: Response_ | undefined;
    setEditingResponse: (response?: Response_) => void;
    onAddResponse: (content: string) => Promise<void>;
    onEditResponse: (id: number, content: string) => Promise<void>;
};

export const ResponseForm: React.FC<ResponseFormProps> = ({
    tweetId,
    sessionUserId,
    editingResponse,
    setEditingResponse,
    onAddResponse,
    onEditResponse,
}) => {
    const [content, setContent] = useState("");
    const {updateCommentCount} = useResponseStore();

    useEffect(() => {
        if (editingResponse) {
            setContent(editingResponse.content);
        } else {
            setContent("");
        }
    }, [editingResponse]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingResponse) {
            await onEditResponse(editingResponse.id, content);
            setEditingResponse(undefined);
        } else {
            await onAddResponse(content);
            updateCommentCount(tweetId, 1);
        }
        setContent("");
    };

    return (
        <form onSubmit={onSubmit} className="bg-gray-900 p-4 shadow-md border-b border-gray-800 py-4">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="답글을 입력하세요..."
            />
            <button type="submit" className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                {editingResponse ? "Update" : "Submit"}
            </button>
        </form>
    );
};
