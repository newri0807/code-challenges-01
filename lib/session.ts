import {getIronSession} from "iron-session";
import {cookies} from "next/headers";

interface SessionContent {
    id?: number;
}

const sessionOptions = {
    cookieName: "challeng-cookie",
    password: process.env.COOKIE_PASSWORD!,
};

export default async function getSession() {
    return getIronSession<SessionContent>(cookies(), sessionOptions);
}
