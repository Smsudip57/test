import dbConnect from '@/connect/dbconnect'; // Import your database connection helper
import Project from '@/models/project'; // Import your Project model
import User from '@/models/user'; // Import your User model (for authentication)
import jwt from 'jsonwebtoken'; // Import JWT for decoding and verifying tokens
import { NextResponse } from 'next/server'; // Helper for returning responses

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all projects from the database
    const projects = await Project.find();

    // If no projects found
    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { success: true, message: 'No projects found', data: [] },
        { status: 200 }
      );
    }

    // Return the projects data as a JSON response
    return NextResponse.json(
      { success: true, data: projects },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
