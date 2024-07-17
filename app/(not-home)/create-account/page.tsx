"use client";

import React, {useState} from "react";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createAccount} from "./actions";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    username: z.string().min(2, "Name must be at least 2 characters"),
});

type FormData = z.infer<typeof schema>;

export default function CreateAccount() {
    const [error, setError] = useState("");
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => formData.append(key, value));

        const result = await createAccount(formData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="max-w-md mx-auto  border border-gray-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-12">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-200">Create an account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className="appearance-none rounded-full w-full px-4 py-3 border border-gray-700 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Email address"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password")}
                                className="appearance-none rounded-full w-full px-4 py-3 border border-gray-700 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Password"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                Name
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register("username")}
                                className="appearance-none rounded-full w-full px-4 py-3 border border-gray-700 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Name"
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <SubmitButton
                        onClick={handleSubmit(onSubmit)}
                        idleText="Create Account"
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="text-center mt-4">
                        <Link className="text-sm text-blue-500 hover:text-blue-600 font-medium" href="/log-in">
                            Already have an account? Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
