import dbConnect from '@/connect/dbconnect'; // Ensure the correct path for dbConnect
import Product from '@/models/product'; // Ensure the correct path for Product model
import jwt from 'jsonwebtoken'; // Assuming you are using JWT for authentication
import User from '@/models/user';

const isAuthenticated = async (cookie) => {
  if (!cookie) {
    return false;
  }

  let decoded;
  try {
    decoded = jwt.verify(cookie, process.env.JWT_SECRET);
  } catch (error) {
    return false;  // Token verification failed, return false
  }

  const user = await User.findById(decoded.userId).select('-password');
  return user ? true : false;  // If the user exists, return true, else false
};

export async function GET(req) {
  try {
    // Step 1: Get the user's authentication token from cookies
    const cookie = req.cookies.get('user')?.value; // Replace 'user' with your actual cookie name if needed

    // Step 2: Check if the user is authenticated
    const isUserAuthenticated = await isAuthenticated(cookie); // Await isAuthenticated function
    if (!isUserAuthenticated) {
      return new Response(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Step 3: Connect to the database
    await dbConnect();

    // Step 4: Fetch all products from the database
    const products = await Product.find(); // You can add filters or pagination if needed

    if (products.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No products found' }),
        { status: 404 }
      );
    }

    // Step 5: Return the products data in the response
    return new Response(
      JSON.stringify({ success: true, products }),
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
