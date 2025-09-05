import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('🔥 Middleware running for:', pathname);

  if (pathname.startsWith('/admin')) {
    console.log('🚪 Admin path detected, checking authentication...');
    try {
      const userToken = request.cookies.get('user')?.value;
      console.log('🍪 User token found:', !!userToken);
      console.log('🔑 Token value (first 20 chars):', userToken ? userToken.substring(0, 20) + '...' : 'None');

      if (!userToken) {
        console.log('❌ No user token, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('📡 Making API call to:', `${process.env.NEXT_PUBLIC_BASE_URL}/api/getuserinfo`);

      // Call the backend API to get user info
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getuserinfo`, {
        method: 'GET',
        headers: {
          'Cookie': `user=${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📋 API Response status:', response.status);
      console.log('📋 API Response ok:', response.ok);

      if (!response.ok) {
        console.log('❌ API response not OK, status:', response.status);
        return NextResponse.redirect(new URL('/', request.url));
      }

      const data = await response.json();
      console.log('📦 API Response data:', data);

      if (!data.success) {
        console.log('❌ API response success is false');
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (!data.user) {
        console.log('❌ No user data in response');
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('👤 User data:', data.user);
      console.log('🎭 User role:', data.user.role);

      if (data.user.role !== 'admin') {
        console.log('❌ User is not admin, role is:', data.user.role);
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('✅ User is admin, allowing access');
      return NextResponse.next();

    } catch (error) {
      console.error('💥 Middleware error:', error);
      console.error('💥 Error stack:', error.stack);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  console.log('⏭️ Non-admin path, continuing...');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin'
  ]
};
