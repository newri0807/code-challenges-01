import {NextRequest, NextResponse} from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/": true,
    "/log-in": true,
    "/create-account": true,
};

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
        // 현재 로그인 상태x
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        // 현재 로그인 상태
        if (exists) {
            return NextResponse.redirect(new URL("/profile", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
