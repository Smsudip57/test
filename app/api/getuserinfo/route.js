import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import dbConnect from '@/connect/dbconnect';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  await dbConnect();

  try {
    const cookies = req.cookies;
    const token = await cookies.get('user')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is missing.' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid or expired token.' },
        { status: 401 }
      );
    }

    const { userId } = decoded;

    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }


    return NextResponse.json(
      {
        success: true,
        message: 'User retrieved successfully.',
        user: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the user.' },
      { status: 500 }
    );
  }
}
