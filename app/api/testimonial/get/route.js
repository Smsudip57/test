import { NextResponse } from 'next/server';
import dbConnect from '@/connect/dbconnect'; 
import Testimonial from '@/models/testimonial'; 

export const GET = async () => {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all testimonials from the database
    const testimonials = await Testimonial.find()
      .populate('relatedService')  // Optionally populate related service if needed
      .populate('relatedIndustry') // Optionally populate related industry if needed
      .exec();

    return NextResponse.json({
      success: true,
      testimonials, // Return the testimonials as part of the response
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
