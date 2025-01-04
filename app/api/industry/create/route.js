import dbConnect from '@/connect/dbconnect';
import Industry from '@/models/industry';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

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
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 404 }
    );
  }

  try {
    const formData = await req.formData(); // Parse the FormData sent from the client
    const Title = formData.get('Title');
    const Heading = formData.get('Heading'); // New Heading field
    const detail = formData.get('detail');
    const Efficiency = formData.get('Efficiency') || 0;
    const costSaving = formData.get('costSaving') || 0;
    const customerSatisfaction = formData.get('customerSatisfaction') || 0;
    const image = formData.get('image'); // Image file

    console.log('FormData Received:', { Title, Heading, detail, Efficiency, costSaving, customerSatisfaction, image });

    // Validate input
    if (!Title || !Heading || !detail || !image) {
      return NextResponse.json(
        { success: false, message: 'Title, Heading, detail, and image are required.' },
        { status: 400 }
      );
    }

    // Save the image to the public directory
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name}`;
    const filePath = path.join(process.cwd(), 'public', filename);

    fs.writeFileSync(filePath, buffer); // Save file to disk

    const imageUrl = `/${filename}`; // Public access path for the image

    // Create new industry
    const newIndustry = new Industry({
      Title,
      Heading,
      detail,
      Efficiency: Number(Efficiency),
      costSaving: Number(costSaving),
      customerSatisfaction: Number(customerSatisfaction),
      image: imageUrl,
    });

    await newIndustry.save();

    return NextResponse.json(
      { success: true, message: 'Industry created successfully.', industry: newIndustry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating industry:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
