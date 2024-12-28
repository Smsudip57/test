import dbConnect from '@/connect/dbconnect';
import Product from '@/models/product';
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
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 404 }
    );
  }

  try {
    const formData = await req.formData(); // Parse the FormData sent from the client
    const Title = formData.get('Title');
    const detail = formData.get('detail');
    const category = formData.get('category');
    const image = formData.get('image'); // Image file
    const subHeading1 = formData.get('subHeading1');
    const subHeading1edtails = formData.get('subHeading1edtails');
    const subHeading2 = formData.get('subHeading2');
    const subHeading2edtails = formData.get('subHeading2edtails');
    const subHeading3 = formData.get('subHeading3');
    const subHeading3edtails = formData.get('subHeading3edtails');
    console.log("FormData Received:");
console.log({ Title, detail, category, image, subHeading1, subHeading1edtails, subHeading2, subHeading2edtails, subHeading3, subHeading3edtails });


    // Validate input
    if (!Title || !detail || !category || !image || !subHeading1 || !subHeading1edtails || !subHeading2 || !subHeading2edtails || !subHeading3 || !subHeading3edtails) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Save the image to the public directory
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = `${Date.now()}-${image.name}`;
    const filePath = path.join(process.cwd(), 'public', filename);

    fs.writeFileSync(filePath, buffer); // Save file to disk

    const imageUrl = `/${filename}`; // Public access path for the image

    // Create new product
    const newProduct = new Product({
      Title,
      detail,
      category,
      image: imageUrl,
      subHeading1,
      subHeading1edtails,
      subHeading2,
      subHeading2edtails,
      subHeading3,
      subHeading3edtails,
    });

    await newProduct.save();

    return NextResponse.json(
      { success: true, message: 'Product created successfully.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
