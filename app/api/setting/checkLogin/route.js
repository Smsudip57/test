import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbconnect'; // Import the database connection
import Setting from '@/models/setting'; // Import your Setting model
import jwt from 'jsonwebtoken'; // Import the JWT library
export const GET = async (req) => {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all services
    const setting = await Setting.find({});
    // const value = false;
    const value = setting[0].loginOn ? true : false;
    

    // Respond with the services
    return NextResponse.json({
      success: true,
      loginOn: value,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
