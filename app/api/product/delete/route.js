import dbConnect from '@/connect/dbconnect'; // Your database connection helper
import Product from '@/models/product'; // Your Product model
import User from '@/models/user'; // Your User model
import jwt from 'jsonwebtoken'; // JSON Web Token for user authentication
import { NextResponse } from 'next/server'; // Helper for returning responses

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

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

    // Get the product ID from the request body
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting product:', err);
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
