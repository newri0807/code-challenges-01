import {NextRequest, NextResponse} from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/log-in": true,
    "/create-account": true,
};

export async function middleware(request: NextRequest) {
    const session = await getSession();

    const isPublicOnlyUrl = publicOnlyUrls[request.nextUrl.pathname];
    const isLoggedIn = Boolean(session?.id);

    if (!isLoggedIn && !isPublicOnlyUrl) {
        // 로그인하지 않은 상태에서 보호된 경로에 접근하려고 할 때
        return NextResponse.redirect(new URL("/log-in", request.url));
    }

    if (isLoggedIn && isPublicOnlyUrl) {
        // 로그인한 상태에서 공개 전용 경로에 접근하려고 할 때
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
