import dbConnect from '@/connect/dbconnect';
import Industry from '@/models/industry';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const industries = await Industry.find({}); // Fetch all industries from the database

    return NextResponse.json(
      { success: true, industries },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch industries. Please try again.' },
      { status: 500 }
    );
  }
}
