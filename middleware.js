import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    console.log('Middleware running for:', pathname);

    if (pathname.startsWith('/admin')) {
        console.log('Admin path detected, checking authentication...');
        try {
            const userToken = request.cookies.get('user')?.value;
            console.log('User token found:', !!userToken);

            if (!userToken) {
                console.log('No user token, redirecting to home');
                return NextResponse.redirect(new URL('/', request.url));
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getuserinfo`, {
                method: 'GET',
                headers: {
                    'Cookie': `user=${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                return NextResponse.redirect(new URL('/', request.url));
            }

            const data = await response.json();
            console.log('API Response data:', data);

            if (!data.success || !data.user) {
                console.log('No success or user data, redirecting to home');
                return NextResponse.redirect(new URL('/', request.url));
            }

            console.log('User role:', data.user.role);
            if (data.user.role !== 'admin') {
                console.log('User is not admin, redirecting to home');
                return NextResponse.redirect(new URL('/', request.url));
            }

            console.log('User is admin, allowing access');
            return NextResponse.next();

        } catch (error) {
            console.error('Middleware error:', error);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/admin'
    ]
};
