import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbconnect'; // Import the database connection
import Service from '@/models/service'; // Import your Service model
import User from '@/models/user'; // Import your User model
import jwt from 'jsonwebtoken'; // Import the JWT library
export const GET = async (req) => {
  try {
    // Connect to the database
    await dbConnect();

    const cookie = req.cookies.get('user')?.value;
    if (!cookie) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }


    let decoded;
    try {
      decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    } catch (error) {
        console.log('Error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    const { userId } = decoded;

    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 404 }
      );
    }

    // Fetch all services
    const services = await Service.find({});

    // Respond with the services
    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
