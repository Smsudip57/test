import dbConnect from '@/connect/dbconnect';
import Industry from '@/models/industry';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();

  // Authenticate user via cookies
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
    const formData = await req.formData(); // Parse form data from client
    const id = formData.get('id');
    const Title = formData.get('Title');
    const Heading = formData.get('Heading');
    const detail = formData.get('detail');
    const Efficiency = formData.get('Efficiency');
    const costSaving = formData.get('costSaving');
    const customerSatisfaction = formData.get('customerSatisfaction');
    const image = formData.get('image'); // New image file (if uploaded)

    // Validate required fields
    if (!id || !Title || !Heading || !detail) {
      return NextResponse.json(
        { success: false, message: 'ID, Title, Heading, and Detail are required.' },
        { status: 400 }
      );
    }

    // Find the industry to update
    const industry = await Industry.findById(id);
    if (!industry) {
      return NextResponse.json(
        { success: false, message: 'Industry not found.' },
        { status: 404 }
      );
    }

    // Handle image upload if a new file is provided
    let imageUrl = industry.image; // Retain current image by default
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

      // Ensure uploads directory exists
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);

      // Save the new image file
      await fs.writeFile(filePath, buffer);
      imageUrl = `/uploads/${filename}`;

      // Delete the old image if it exists
      if (industry.image && existsSync(path.join(process.cwd(), 'public', industry.image))) {
        await fs.unlink(path.join(process.cwd(), 'public', industry.image));
      }
    }

    // Update the industry with new data
    industry.Title = Title;
    industry.Heading = Heading;
    industry.detail = detail;
    if (Efficiency !== null && Efficiency !== undefined)
      industry.Efficiency = Efficiency;
    if (costSaving !== null && costSaving !== undefined)
      industry.costSaving = costSaving;
    if (customerSatisfaction !== null && customerSatisfaction !== undefined)
      industry.customerSatisfaction = customerSatisfaction;
    industry.image = imageUrl;

    await industry.save();

    return NextResponse.json(
      { success: true, message: 'Industry updated successfully.', updatedIndustry: industry },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating industry:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
