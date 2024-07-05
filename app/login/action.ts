"use server";

import {z} from "zod";

const loginSchema = z.object({
    email: z
        .string()
        .email()
        .refine((email) => email.endsWith("@zod.com"), {
            message: "Only emails with the domain '@zod.com' are allowed.",
        }),
    username: z.string().min(5, {message: "Username must be at least 5 characters long."}),
    password: z
        .string()
        .min(10, {message: "Password must be at least 10 characters long."})
        .regex(/\d/, {message: "Password must include at least one number."}),
});

export async function loginAction({email, username, password}: {email: string; username: string; password: string}) {
    // Validate the form data using Zod
    const validation = loginSchema.safeParse({email, username, password});
    console.log("error", validation);

    if (!validation.success) {
        const error = validation.error.errors[0];
        return {
            success: false,
            field: error.path[0],
            message: error.message,
        };
    } else {
        return {success: true};
    }

    // if (password === "12345") {
    //     return {success: true};
    // } else {
    //     return {success: false, field: "password", message: "Wrong password"};
    // }
}
