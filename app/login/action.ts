"use server";

export async function loginAction({email, username, password}: {email: string; username: string; password: string}) {
    if (password === "12345") {
        return {success: true};
    } else {
        return {success: false, field: "password", message: "Wrong password"};
    }
}
