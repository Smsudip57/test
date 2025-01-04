import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import Testimonial from '@/models/testimonial'; // Assume you have a Testimonial model
import dbConnect from '@/connect/dbconnect'; 
import User from '@/models/user';

const UPLOAD_DIR = path.join(process.cwd(), 'public');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const POST = async (req) => {
  try {
    await dbConnect(); // Connect to the database

    // Parse the incoming form data
    const formData = await req.formData();
    const TestimonialText = formData.get('Testimonial');
    const postedBy = formData.get('postedBy');
    const role = formData.get('role');
    const relatedService = formData.get('relatedService');
    const relatedIndustry = formData.get('relatedIndustry');
    const file = formData.get('image'); // Image file

    // Validate required fields
    if (!TestimonialText || !postedBy || !role || !file) {
      return NextResponse.json(
        { success: false, message: 'Testimonial, PostedBy, Role, and Image are required' },
        { status: 400 }
      );
    }

    // Validate user authorization
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

    // Save the image file to the public folder
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filePath, buffer); // Save file to disk

    const imageUrl = `/${filename}`; // Public access path for the image

    // Save the testimonial data to MongoDB
    const newTestimonial = new Testimonial({
      Testimonial: TestimonialText,
      postedBy,
      role,
      relatedService,
      relatedIndustry,
      image: imageUrl,
    });

    await newTestimonial.save();

    console.log(newTestimonial);

    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
