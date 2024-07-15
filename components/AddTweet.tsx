"use client";

import React, {useState, useCallback} from "react";
import {useFormState, useFormStatus} from "react-dom";
import {z} from "zod";
import {addTweet} from "@/app/(home)/tweets/actions";
import {useRouter} from "next/navigation";

const tweetSchema = z.object({
    tweet: z.string().min(1, "Tweet cannot be empty").max(280, "Tweet is too long"),
});

type FormState = {
    message?: string;
    error?: string;
    tweet?: {
        id: number;
        tweet: string;
        created_at: Date;
        updated_at: Date;
        userId: number;
    };
};

const initialState: FormState = {};

async function createTweet(prevState: FormState, formData: FormData): Promise<FormState> {
    const tweet = formData.get("tweet") as string;

    try {
        const validatedData = tweetSchema.parse({tweet});
        const newTweet = await addTweet(validatedData.tweet);
        return {message: "Tweet created successfully", tweet: newTweet};
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {error: error.errors[0].message};
        }
        return {error: "An unexpected error occurred"};
    }
}

function SubmitButton() {
    const {pending} = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200 ease-in-out disabled:opacity-50"
        >
            {pending ? "Tweeting..." : "Tweet"}
        </button>
    );
}

export default function AddTweet() {
    const [state, formAction] = useFormState(createTweet, initialState);
    const [tweetContent, setTweetContent] = useState("");
    const router = useRouter();

    const handleSubmit = useCallback(
        (formData: FormData) => {
            formAction(formData);
            setTweetContent(""); // Clear the input after submission
            router.refresh(); // Refresh the page to show the new tweet
        },
        [formAction, router]
    );

    const remainingChars = 280 - tweetContent.length;
    const isOverLimit = remainingChars < 0;

    return (
        <div className="w-full mx-auto my-2 border-b border-gray-700">
            <form action={handleSubmit} className="shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <textarea
                        name="tweet"
                        placeholder="What's happening?"
                        className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${
                            isOverLimit ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"
                        }`}
                        rows={4}
                        value={tweetContent}
                        onChange={(e) => setTweetContent(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className={`text-sm ${isOverLimit ? "text-red-500" : "text-gray-600"}`}>{remainingChars} characters remaining</span>
                    <SubmitButton />
                </div>
                {state.error && <p className="mt-2 text-red-500 text-sm">{state.error}</p>}
                {state.message && <p className="mt-2 text-green-500 text-sm">{state.message}</p>}
            </form>
        </div>
    );
}
