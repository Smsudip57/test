import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbconnect';
import Service from '@/models/service';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  await dbConnect();

  try {
    // Authenticate user using the token
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

    // Verify user exists
    const user = await User.findById(userId).select('-password');
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 404 }
      );
    }

    // Parse serviceId from the request body
    const { serviceId } = await req.json();
    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Find the service to get the image path
    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    // Delete the image file if it exists
    if (service.image) {
      const imagePath = path.join(process.cwd(), 'public', service.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image file: ${err.message}`);
        }
      });
    }

    // Delete the service from the database
    await Service.findByIdAndDelete(serviceId);

    return NextResponse.json(
      { success: true, message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting the service' },
      { status: 500 }
    );
  }
}
