import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET; 

export async function GET(req) {
    try {
        
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful.',
      },
      { status: 200 }
    );

    response.cookies.set('user', '', {
      httpOnly: true, // Prevents client-side JS access
      secure: true, // Use secure cookies in production
      sameSite: 'strict', // Protects against CSRF
      path: '/', // Cookie available to all routes
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'An error occurred while logging in.' },
      { status: 500 }
    );
  }
}
