"use server";

import getSession from "@/lib/session";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import {z} from "zod";
import {redirect} from "next/navigation";
import db from "@/lib/db";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5, {message: "Password must be at least 5 characters long."}).regex(/\d/, {
        message: "Password must include at least one number.",
    }),
});

export async function loginAction({email, password}: {email: string; password: string}) {
    // 입력값 검증
    const validation = loginSchema.safeParse({email, password});

    if (!validation.success) {
        const error = validation.error.errors[0];
        return {
            success: false,
            field: error.path[0],
            message: error.message,
        };
    }

    // 데이터베이스에서 사용자 존재 여부 확인
    const user = await db.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return {
            success: false,
            message: "User not found. Please check your email.",
        };
    }

    // 비밀번호 확인
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return {
            success: false,
            message: "Password does not match. Please check your password.",
        };
    }

    // 세션 저장
    const session = await getSession();
    session.id = user.id;
    await session.save();

    console.log("세션 저장:", session);

    // Redirect to home page after successful login
    redirect("/home");
}
