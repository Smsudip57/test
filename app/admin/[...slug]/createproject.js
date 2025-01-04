'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function CreateProject() {
  const [formValues, setFormValues] = useState({
    Title: '',
    detail: '',
    image: null,
    sections: [
      {
        Heading: '',
        image: null,
        subHeading1: '',
        subHeading2: '',
        subHeading3: '',
        subHeadingdetails1: '',
        subHeadingdetails2: '',
        subHeadingdetails3: '',
      },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleInputChange = (e, sectionIndex, fieldName) => {
    const { name, value } = e.target;

    // If it's not a section field, update directly
    if (sectionIndex === null) {
      setFormValues({ ...formValues, [name]: value });
    } else {
      // Otherwise, update the section-specific field
      const updatedSections = [...formValues.sections];
      updatedSections[sectionIndex][fieldName] = value;
      setFormValues({ ...formValues, sections: updatedSections });
    }
  };

  // Handle image changes
  const handleImageChange = (e, sectionIndex, fieldName) => {
    const { name, files } = e.target;

    // If it's not a section image field, update directly
    if (sectionIndex === null) {
      setFormValues({ ...formValues, [name]: files[0] });
    } else {
      // Otherwise, update the section-specific image field
      const updatedSections = [...formValues.sections];
      updatedSections[sectionIndex][fieldName] = files[0];
      setFormValues({ ...formValues, sections: updatedSections });
    }
  };

  // Add more sections
  const addSection = () => {
    setFormValues((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          Heading: '',
          image: null,
          subHeading1: '',
          subHeading2: '',
          subHeading3: '',
          subHeadingdetails1: '',
          subHeadingdetails2: '',
          subHeadingdetails3: '',
        },
      ],
    }));
  };

  // Remove section
  const removeSection = (index) => {
    const updatedSections = formValues.sections.filter((_, i) => i !== index);
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('Title', formValues.Title);
    formData.append('detail', formValues.detail);
    formData.append('image', formValues.image);
    formValues.sections.forEach((section, index) => {
      formData.append(`section[${index}][Heading]`, section.Heading);
      formData.append(`section[${index}][image]`, section.image);
      formData.append(`section[${index}][subHeading1]`, section.subHeading1);
      formData.append(`section[${index}][subHeading2]`, section.subHeading2);
      formData.append(`section[${index}][subHeading3]`, section.subHeading3);
      formData.append(`section[${index}][subHeadingdetails1]`, section.subHeadingdetails1);
      formData.append(`section[${index}][subHeadingdetails2]`, section.subHeadingdetails2);
      formData.append(`section[${index}][subHeadingdetails3]`, section.subHeadingdetails3);
    });

    try {
      await axios.post('/api/project/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setSuccess('Project created successfully!');
      setFormValues({
        Title: '',
        detail: '',
        image: null,
        sections: [
          {
            Heading: '',
            image: null,
            subHeading1: '',
            subHeading2: '',
            subHeading3: '',
            subHeadingdetails1: '',
            subHeadingdetails2: '',
            subHeadingdetails3: '',
          },
        ],
      });
    } catch (err) {
      setError('Error creating project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Head>
        <title>Create New Project</title>
      </Head>

      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Project Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Project Title</label>
          <input
            type="text"
            name="Title"
            value={formValues.Title}
            onChange={(e) => handleInputChange(e, null, 'Title')}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Project Detail */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Project Detail</label>
          <textarea
            name="detail"
            value={formValues.detail}
            onChange={(e) => handleInputChange(e, null, 'detail')}
            className="mt-1 block w-full p-2 border rounded-md"
            rows="4"
            required
          />
        </div>

        {/* Project Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Project Image</label>
          <input
            type="file"
            name="image"
            onChange={(e) => handleImageChange(e, null, 'image')}
            className="mt-1 block w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {formValues.sections.map((section, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h3 className="text-lg font-semibold mb-2">Section {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                >
                  Remove Section
                </button>
              </div>

              {/* Heading */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Heading</label>
                <input
                  type="text"
                  name={`Heading-${index}`}
                  value={section.Heading}
                  onChange={(e) => handleInputChange(e, index, 'Heading')}
                  className="mt-1 block w-full p-2 border rounded-md"
                  required
                />
              </div>

              {/* Section Image */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Section Image</label>
                <input
                  type="file"
                  name={`image-${index}`}
                  onChange={(e) => handleImageChange(e, index, 'image')}
                  className="mt-1 block w-full p-2 border rounded-md"
                  required
                />
              </div>

              {/* Sub Headings and Details */}
              {['1', '2', '3'].map((subIndex) => (
                <div key={subIndex} className="space-y-2 mb-4">
                  <label className="block text-sm font-medium">Sub Heading {subIndex}</label>
                  <input
                    type="text"
                    name={`subHeading${subIndex}-${index}`}
                    value={section[`subHeading${subIndex}`]}
                    onChange={(e) => handleInputChange(e, index, `subHeading${subIndex}`)}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                  />

                  <label className="block text-sm font-medium">Sub Heading {subIndex} Details</label>
                  <textarea
                    name={`subHeadingdetails${subIndex}-${index}`}
                    value={section[`subHeadingdetails${subIndex}`]}
                    onChange={(e) => handleInputChange(e, index, `subHeadingdetails${subIndex}`)}
                    className="mt-1 block w-full p-2 border rounded-md"
                    rows="2"
                    required
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Add More Section */}
        <div className="my-4">
          <button
            type="button"
            onClick={addSection}
            className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
          >
            Add More Section
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
