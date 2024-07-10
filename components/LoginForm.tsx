"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {loginAction} from "@/app/log-in/action";
import Link from "next/link";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
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
        const result = await loginAction(data);

        console.log("result", result);

        if (result?.success === false) {
            setError(result.message);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-12">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Log in to your account</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="appearance-none border border-gray-300 rounded-full w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="appearance-none border border-gray-300 rounded-full w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="********"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
                    </div>
                    {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Log in
                        </button>
                        <Link className="text-sm text-blue-500 hover:text-blue-600 font-medium" href="/create-account">
                            Join us?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
