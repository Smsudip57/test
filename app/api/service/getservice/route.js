import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbconnect'; // Import the database connection
import Service from '@/models/service'; // Import your Service model
import User from '@/models/user'; // Import your User model
import jwt from 'jsonwebtoken'; // Import the JWT library
export const GET = async (req) => {
  try {
    // Connect to the database
    await dbConnect();

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
