"use client";

import React from "react";
import Image from "next/image";
import {Response_} from "@/lib/type";

type ResponseListProps = {
    responses: Response_[];
    sessionUserId: number;
    onEditResponse: (response: Response_) => void;
    onDeleteResponse: (id: number) => void;
};

export const ResponseList: React.FC<ResponseListProps> = React.memo(({responses, sessionUserId, onEditResponse, onDeleteResponse}) => {
    return (
        <div className="p-4">
            {responses.map((response) => (
                <div key={response.id} className="!pixel-border-b  border-gray-800 py-4 flex items-start last:border-none">
                    <Image
                        src={response.user.avatar || "/default-avatar.png"}
                        alt={response.user.username}
                        width={40}
                        height={40}
                        className="bg-white rounded-full mx-2"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-semibold">{response.user.username}</p>
                                <p className="text-gray-500 text-sm">{new Date(response.created_at).toLocaleString()}</p>
                            </div>
                            {response.userId === sessionUserId && (
                                <div className="flex space-x-2">
                                    <button onClick={() => onEditResponse(response)} className="text-blue-500 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => onDeleteResponse(response.id)} className="text-red-500 hover:underline">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-white mt-2">{response.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
});

ResponseList.displayName = "ResponseList";
