import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbconnect'; // Import the database connection
import Setting from '@/models/setting'; // Import your Setting model
import User from '@/models/user'; // Import your User model
import jwt from 'jsonwebtoken'; // Import the JWT library


export async function POST(req) {

  try {
    // Connect to the database
    await dbConnect();

  // Verify the user's authentication
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
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 403 }
    );
  }

  const { userId } = decoded;

  const user = await User.findById(userId).select('-password');
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 404 }
    );
  }
  const {loginOn} = await req.json();

    // Fetch all services
    const setting = await Setting.find({});
    setting[0].loginOn = loginOn;
    await setting[0].save();
    if(loginOn===setting[0].loginOn){
      return NextResponse.json({
        success: true,
        message: 'Login is now enabled',
      });
    }
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
