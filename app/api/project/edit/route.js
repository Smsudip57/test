import dbConnect from '@/connect/dbconnect';
import Project from '@/models/project';
import User from '@/models/user';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Connect to the database
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

    // Parse the form data sent from the client
    const formData = await req.formData();

    // Extract main project fields
    const _id = formData.get('_id');
    const Title = formData.get('Title');
    const detail = formData.get('detail');
    const image = formData.get('image'); // The main project image

    // Validate input
    if (!_id || !Title || !detail) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Find the existing project by _id
    const project = await Project.findById(_id);
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    // If there's a new image, handle image upload
    let imageUrl = project.image; // Default to the existing image
    
    console.log(image===null);
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const timestamp = Date.now();  // Get the timestamp in milliseconds
      let counter = 0;  // To handle any potential conflicts
      const createUniqueFilename = (baseName) => {
        const filename = `${timestamp}-${counter}-${baseName}`;
        counter++;  // Increment counter for the next potential conflict
        return filename;
      };

      // Synchronously create a unique filename

      const imageFilename = createUniqueFilename(image.name);
      const imagePath = path.join(process.cwd(), 'public', imageFilename);
      fs.writeFileSync(imagePath, buffer); // Save the image file
      fs.unlinkSync(path.join(process.cwd(), 'public', project.image)); // Delete the old image

      imageUrl = `/${imageFilename}`; // Public URL for the image
    }

    // Extract and update sections from formData
    const sections = [];
    let sectionIndex = 0;

    // console.log(formData)

    while (formData.has(`section[${sectionIndex}][Heading]`)) {
      const Heading = formData.get(`section[${sectionIndex}][Heading]`);
      const sectionImage = formData.get(`section[${sectionIndex}][image]`);
      const subHeading1 = formData.get(`section[${sectionIndex}][subHeading1]`);
      const subHeadingdetails1 = formData.get(`section[${sectionIndex}][subHeadingdetails1]`);
      const subHeading2 = formData.get(`section[${sectionIndex}][subHeading2]`);
      const subHeadingdetails2 = formData.get(`section[${sectionIndex}][subHeadingdetails2]`);
      const subHeading3 = formData.get(`section[${sectionIndex}][subHeading3]`);
      const subHeadingdetails3 = formData.get(`section[${sectionIndex}][subHeadingdetails3]`);

      // Handle section image if uploaded
      let sectionImageUrl = project.section[sectionIndex]?.image || '';
      // console.log(sectionImage, typeof sectionImage);
      if (sectionImage && sectionImage!==sectionImageUrl) {
        const sectionImageBuffer = Buffer.from(await sectionImage.arrayBuffer());
        const timestamp = Date.now(); 
      const createUniqueFilename = (baseName) => {
        const filename = `${timestamp}-${sectionIndex}-${baseName}`;
        return filename;
      };
        const sectionImageFilename =  createUniqueFilename(sectionImage.name);
        const sectionImagePath = path.join(process.cwd(), 'public', sectionImageFilename);
        fs.writeFileSync(sectionImagePath, sectionImageBuffer); // Save section image file
        fs.unlinkSync(path.join(process.cwd(), 'public', sectionImageUrl)); // Delete the old section image

        sectionImageUrl = `/${sectionImageFilename}`; // Public URL for the section image
      }

      sections.push({
        Heading,
        image: sectionImageUrl, // Section image URL
        subHeading1,
        subHeadingdetails1,
        subHeading2,
        subHeadingdetails2,
        subHeading3,
        subHeadingdetails3,
      });

      sectionIndex++; // Move to the next section
    }

    // Update the project with the new data
    project.Title = Title;
    project.detail = detail;
    project.image = imageUrl;
    project.section = sections;

    // Save the updated project
    await project.save();

    return NextResponse.json(
      { success: true, message: 'Project updated successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.log('line no:' + error.stack);
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
