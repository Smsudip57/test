import fs from 'fs';
import path from 'path';
import dbConnect from '@/connect/dbconnect';  // Ensure this is the correct path to your dbConnect file
import Service from '@/models/service';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Define the public directory where images are saved
const UPLOAD_DIR = path.join(process.cwd(), 'public');

async function saveImage(file) {
  // Convert the file to a buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Generate a unique filename using the current timestamp
  const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.name)}`;
  
  // Define the full path where the file will be saved
  const filePath = path.join(UPLOAD_DIR, filename);

  // Save the file to the disk
  fs.writeFileSync(filePath, buffer);

  // Generate the public URL for the image
  const imageUrl = `/${filename}`;

  return imageUrl; // Return the public URL to store in the database
}

export async function POST(req) {
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
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 404 }
    );
  }

  try {
    const formData = await req.formData(); // Parse the FormData sent from the client
    const serviceId = formData.get('serviceId');
    const Title = formData.get('Title');
    const deltail = formData.get('deltail');
    const category = formData.get('category');
    const image = formData.get('image'); // This is a file, if provided

    // Validate input
    if (!serviceId || !Title || !deltail || !category) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Find the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found.' },
        { status: 404 }
      );
    }

    // Update the service fields
    service.Title = Title;
    service.deltail = deltail;
    service.category = category;

    // Handle image upload if provided
    if (image) {
      // Check if there's an existing image to delete
      if (service.image) {
        // Assuming the image URL points to a file in the /public folder
        const imagePath = path.join(process.cwd(), 'public', service.image);
        try {
          if (fs.existsSync(imagePath)) {
            // Remove the old image
            fs.unlinkSync(imagePath);
          }
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }

      // Save the new image and get the URL
      const imageUrl = await saveImage(image);
      service.image = imageUrl;  // Update the service image URL
    }

    await service.save();

    return NextResponse.json(
      { success: true, message: 'Service updated successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
