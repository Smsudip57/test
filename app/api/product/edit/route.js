import fs from 'fs';
import path from 'path';
import dbConnect from '@/connect/dbconnect';
import Product from '@/models/product';
import jwt from 'jsonwebtoken';
import User from '@/models/user';

export async function PUT(req) {
  try {
    // Check user authentication via cookies
    const cookie = req.cookies.get('user')?.value;
    if (!cookie) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    if (!decoded) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user || user.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Parse the request body
    const formData = await req.formData();
    const productData = Object.fromEntries(formData);
    

    console.log(productData);

    // Connect to DB
    await dbConnect();

    // Get the existing product
    const existingProduct = await Product.findById(productData.productId);
    if (!existingProduct) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product not found' }),
        { status: 404 }
      );
    }

    // Handle the new image upload if available
    let newImagePath = existingProduct.image;  // Default to the existing image path
    

    if (formData.get('image') && formData.get('image') !== newImagePath) {
      const image = formData.get('image');
      const imageName = `${Date.now()}-${image.name}`;

      // Delete the old image only if a new image is uploaded
      const oldImagePath = path.join(process.cwd(), 'public', existingProduct.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image file
      }

      // Save the new image
      newImagePath = `/${imageName}`;
      const imagePath = path.join(process.cwd(), 'public', imageName);
      const buffer = Buffer.from(await image.arrayBuffer());
      fs.writeFileSync(imagePath, buffer);
    }

    // Update the product with the new image if provided
    const updatedProduct = await Product.findByIdAndUpdate(
      productData.productId,
      {
        ...productData,
        image: newImagePath,  // Use the new image path or the old one if no new image was uploaded
      },
      { new: true }
    );

    if (!updatedProduct) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, product: updatedProduct }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500 }
    );
  }
}
