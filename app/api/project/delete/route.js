import dbConnect from '@/connect/dbconnect';
import Project from '@/models/project';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

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

    // Parse the incoming request body
    const body = await req.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'Project ID is required.' },
        { status: 400 }
      );
    }

    // Find and delete the project
    const project = await Project.findById(_id);
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found.' },
        { status: 404 }
      );
    }

    await project.deleteOne();

    return NextResponse.json(
      { success: true, message: 'Project deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
