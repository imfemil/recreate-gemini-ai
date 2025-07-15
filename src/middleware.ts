import { NextRequest, NextResponse } from 'next/server';

// Define routes
const PUBLIC_ROUTES = ['/', '/login', '/signup'];
const PROTECTED_ROUTES = ['/dashboard', '/dashboard/:roomId*'];

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const pathname = url.pathname;

    // Read Zustand store from localStorage-like cookie (if available)
    const zustandCookie = req.cookies.get('easy-chat-store')?.value;
    const isLoggedIn = zustandCookie
        ? (() => {
            try {
                const parsed = JSON.parse(zustandCookie);
                return parsed.state?.isLoggedIn === true;
            } catch {
                return false;
            }
        })()
        : false;

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    // 🔐 Not logged in → block access to protected routes
    if (!isLoggedIn && isProtected) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // ✅ Already logged in → block access to login/signup pages
    if (isLoggedIn && isPublic) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}
