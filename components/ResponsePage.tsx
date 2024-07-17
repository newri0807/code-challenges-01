"use client";

import React, {useState, useOptimistic} from "react";
import {ResponseList} from "@/components/ResponseList";
import {ResponseForm} from "@/components/ResponseForm";
import {Response_} from "@/lib/type";
import {useResponseState} from "@/hooks/useResponseState";
import {useResponseStore} from "@/store/TweetStore";

type ResponsePageProps = {
    initialResponses: Response_[];
    sessionUserId: number;
    tweetId: number;
    isOwner: boolean;
};

type OptimisticAction = {type: "add"; response: Response_} | {type: "edit"; id: number; content: string} | {type: "delete"; id: number};

export const ResponsePage: React.FC<ResponsePageProps> = ({initialResponses, sessionUserId, tweetId, isOwner}) => {
    const {responses, editingResponse, handleAddResponse, handleEditResponse, handleDeleteResponse, setEditingResponse} =
        useResponseState(initialResponses);

    const [optimisticResponses, addOptimisticAction] = useOptimistic<Response_[], OptimisticAction>(responses, (state, action): Response_[] => {
        switch (action.type) {
            case "add":
                return [...state, action.response];
            case "edit":
                return state.map((r) => (r.id === action.id ? {...r, content: action.content} : r));
            case "delete":
                return state.filter((r) => r.id !== action.id);
            default:
                return state;
        }
    });

    const {updateCommentCount} = useResponseStore();

    const optimisticAddResponse = async (content: string) => {
        const tempId = Date.now();
        const tempResponse: Response_ = {
            id: tempId,
            content,
            userId: sessionUserId,
            created_at: new Date(),
            tweetId: tweetId,
            user: {
                id: sessionUserId,
                username: "Current User",
                avatar: null,
            },
        };
        addOptimisticAction({type: "add", response: tempResponse});
        await handleAddResponse(tweetId, content);
    };

    const optimisticEditResponse = async (id: number, content: string) => {
        addOptimisticAction({type: "edit", id, content});
        await handleEditResponse(id, content);
    };

    const optimisticDeleteResponse = async (id: number) => {
        addOptimisticAction({type: "delete", id});
        updateCommentCount(tweetId, -1);
        await handleDeleteResponse(id);
    };

    return (
        <>
            <ResponseForm
                tweetId={tweetId}
                sessionUserId={sessionUserId}
                editingResponse={editingResponse}
                setEditingResponse={setEditingResponse}
                onAddResponse={optimisticAddResponse}
                onEditResponse={optimisticEditResponse}
            />
            <ResponseList
                responses={optimisticResponses}
                sessionUserId={sessionUserId}
                onEditResponse={setEditingResponse}
                onDeleteResponse={optimisticDeleteResponse}
            />
        </>
    );
};
