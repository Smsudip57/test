import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/connect/dbconnect';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password, name, role } = await req.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Email, password, and name are required.' },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already registered.' },
        { status: 409 }
      );
    }

    // Restrict unauthorized admin creation
    if (role === 'admin') {
      return NextResponse.json(
        { success: false, message: 'Not allowed.' },
        { status: 403 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if role is not provided
      profile: { name },
    });

    // Create JWT
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    newUser.password = undefined; // Remove password from user object
    // Set the JWT as a cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful.',
        user: newUser,
      },
      { status: 201 }
    );

    response.cookies.set('user', token, {
      httpOnly: true, // Prevents client-side JS access
      secure: true, // Use secure cookies in production
      sameSite: 'strict', // Protects against CSRF
      path: '/', // Cookie available to all routes
    });

    return response;
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration.' },
      { status: 500 }
    );
  }
}
