import dbConnect from '@/connect/dbconnect';
import Industry from '@/models/industry';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  await dbConnect();

  // Verify the user's authentication via cookie
  const cookie = req.cookies.get('user')?.value;
  if (!cookie) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  let decoded;
  try {
    // Decode the JWT token to get the user ID
    decoded = jwt.verify(cookie, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 403 }
    );
  }

  const { userId } = decoded;

  // Check if the user exists in the database
  const user = await User.findById(userId).select('-password');
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'User not found' },
      { status: 404 }
    );
  }

  try {
    // Extract industry ID from the request body
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Industry ID is required.' },
        { status: 400 }
      );
    }

    // Find the industry by ID
    const industry = await Industry.findById(id);
    if (!industry) {
      return NextResponse.json(
        { success: false, message: 'Industry not found.' },
        { status: 404 }
      );
    }

    // Optional: Remove the associated image file from the public folder
    const imagePath = path.join(process.cwd(), 'public', industry.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Delete the image file from disk
    }

    // Delete the industry from the database
    await Industry.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Industry deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting industry:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
