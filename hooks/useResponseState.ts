"use client";

import React, {useReducer, useCallback} from "react";
import {Response_} from "@/lib/type";
import {addResponse, editResponse, deleteResponse} from "@/app/(home)/tweets/[id]/actions";

type ResponseState = {
    responses: Response_[];
    editingResponse?: Response_;
};

type ResponseStateAction =
    | {type: "add"; payload: Response_}
    | {type: "edit"; payload: Response_}
    | {type: "delete"; payload: number}
    | {type: "setEditing"; payload: Response_ | undefined}
    | {type: "init"; payload: Response_[]};

function responseReducer(state: ResponseState, action: ResponseStateAction): ResponseState {
    switch (action.type) {
        case "add":
            return {...state, responses: [...state.responses, action.payload]};
        case "edit":
            return {
                ...state,
                responses: state.responses.map((response) => (response.id === action.payload.id ? action.payload : response)),
            };
        case "delete":
            return {
                ...state,
                responses: state.responses.filter((response) => response.id !== action.payload),
            };
        case "setEditing":
            return {...state, editingResponse: action.payload};
        case "init":
            return {...state, responses: action.payload};
        default:
            return state;
    }
}

export function useResponseState(initialResponses: Response_[]) {
    const [state, dispatch] = useReducer(responseReducer, {
        responses: initialResponses,
        editingResponse: undefined,
    });

    const handleAddResponse = useCallback(async (tweetId: number, content: string) => {
        const newResponse: Response_ = await addResponse(tweetId, content);
        dispatch({type: "add", payload: newResponse});
        return newResponse;
    }, []);

    const handleEditResponse = useCallback(async (responseId: number, content: string) => {
        const updatedResponse: Response_ = await editResponse(responseId, content);
        dispatch({type: "edit", payload: updatedResponse});
        return updatedResponse;
    }, []);

    const handleDeleteResponse = useCallback(async (responseId: number) => {
        await deleteResponse(responseId);
        dispatch({type: "delete", payload: responseId});
    }, []);

    const setEditingResponse = useCallback((response?: Response_) => {
        dispatch({type: "setEditing", payload: response});
    }, []);

    return {
        responses: state.responses,
        editingResponse: state.editingResponse,
        handleAddResponse,
        handleEditResponse,
        handleDeleteResponse,
        setEditingResponse,
        dispatch, // For initializing with server-side data
    };
}
