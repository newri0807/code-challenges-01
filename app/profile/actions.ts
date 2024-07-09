// actions.ts
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function getProfileData(userId: number) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            username: true,
            email: true,
            bio: true,
        },
    });

    return user;
}
