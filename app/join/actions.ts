"use server";

import {hashPassword} from "@/lib/auth";
import {PrismaClient} from "@prisma/client";
import {z} from "zod";

const prisma = new PrismaClient();

const createAccountSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    username: z.string().min(2),
});

export async function createAccount(formData: FormData) {
    const validatedFields = createAccountSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
        username: formData.get("username"),
    });

    if (!validatedFields.success) {
        return {error: "Invalid input", details: validatedFields.error.flatten()};
    }

    const {email, password, username} = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return {error: "Email already in use"};
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
        });

        return {success: true, userId: user.id};
    } catch (error) {
        console.error("Error creating user:", error);
        return {error: "Error creating user"};
    }
}

