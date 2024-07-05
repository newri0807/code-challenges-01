"use client";

import {useState} from "react";
import {EnvelopeIcon, LockClosedIcon, UserIcon} from "@heroicons/react/24/solid";
import {loginAction} from "@/app/login/action";
import {useFormStatus} from "react-dom";
import SuccessMessage from "./SuccessMessage";

type ErrorState = {
    field?: string | number;
    message?: string;
} | null;

export default function LoginForm() {
    const [formState, setFormState] = useState({email: "", username: "", password: ""});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<ErrorState>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const {pending} = useFormStatus();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setIsSuccess(false);
        const {email, username, password} = formState;
        try {
            const result = await loginAction({email, username, password});
            if (result.success) {
                setIsSuccess(true);
            } else {
                setError({field: result.field, message: result.message});
            }
        } catch (err: any) {
            setError({field: "general", message: err.message});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form className="bg-white p-8 rounded shadow-md min-w-[450px]" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="email"
                            type="email"
                            value={formState.email}
                            onChange={(e) => setFormState({...formState, email: e.target.value})}
                            className={`shadow appearance-none border rounded-2xl w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                error?.field === "email" ? "border-red-500" : ""
                            }`}
                        />
                    </div>
                    {error && error.field === "email" && <p className="text-red-500 text-md italic font-bold mb-2">{error.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="username"
                            type="text"
                            value={formState.username}
                            onChange={(e) => setFormState({...formState, username: e.target.value})}
                            className={`shadow appearance-none border rounded-2xl w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                error?.field === "username" ? "border-red-500" : ""
                            }`}
                        />
                    </div>
                    {error && error.field === "username" && <p className="text-red-500 text-md italic font-bold mb-2">{error.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            id="password"
                            type="password"
                            value={formState.password}
                            onChange={(e) => setFormState({...formState, password: e.target.value})}
                            className={`shadow appearance-none border rounded-2xl w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                error?.field === "password" ? "border-red-500" : ""
                            }`}
                        />
                    </div>
                    {error && error.field === "password" && <p className="text-red-500 text-md italic font-bold mb-2">{error.message}</p>}
                </div>
                {error && error.field === "general" && <p className="text-red-500 text-md italic font-bold mb-2">{error.message}</p>}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={isSubmitting || pending}
                        className={`bg-neutral-300 hover:bg-neutral-400 text-white font-bold py-2 px-4 rounded-2xl focus:outline-none focus:shadow-outline w-full ${
                            isSubmitting || pending ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isSubmitting || pending ? "Logging in..." : "Log in"}
                    </button>
                </div>
                {isSuccess && <SuccessMessage />}
            </form>
        </div>
    );
}
