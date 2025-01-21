'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';

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
  const imageInputRef = useRef(null);
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
    <div className="p-10 bg-white shadow rounded-md w-full mx-auto text-gray-700">
      <h1 className="text-xl font-bold mb-4 w-full text-left">Create a Project</h1>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <form onSubmit={handleSubmit}
      >
        <div
          className=' flex justify-center items-start'
        >

        <div className='basis-1/2 p-10'>
        {/* Project Image */}
        <div className="mb-4 border-[1px] relative border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-[#D4DDDD] transition-colors duration-300 mr-12 aspect-[2/1]">
        {formValues?.image ? (
          <img
            src={URL.createObjectURL(formValues.image)}
            alt="Selected"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="flex items-center justify-center flex-col gap-5 w-full aspect-[2/1] pointer-events-none z-10 cursor-pointer">
            <p className="font-semibold">Upload Image</p>
            <Upload size={36} className="text-gray-700" />
          </span>
        )}
        <input
          id="image"
          type="file"
          name="image"
          onChange={(e)=>handleImageChange(e, null , 'image')}
          className=" absolute opacity-0 top-10 cursor-pointer w-full h-full"
          accept="image/*"
        />
        </div>
        </div>
        <div className='basis-1/2'>
        <div className="mb-4">
        {/* Project Title */}
          <label className="block font-semibold mb-3">Project Title</label>
          <input
            type="text"
            name="Title"
            value={formValues.Title}
            onChange={(e) => handleInputChange(e, null, 'Title')}
            className="w-full p-2 border rounded"
            required
            />
        </div>

        {/* Project Detail */}
        <div className="mb-4">
          <label className="block font-semibold mb-3">Project Detail</label>
          <textarea
            name="detail"
            value={formValues.detail}
            onChange={(e) => handleInputChange(e, null, 'detail')}
            className="w-full p-2 border rounded"
            rows="4"
            required
            />
            </div>
        </div>
      </div>

        

        {/* Sections */}
        <div className="">
          {formValues.sections.map((section, index) => (
            <div key={index} className="p-10 border-[1px] rounded-lg ">
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
              <div className='flex w-full items-center'>

              <div className="mb-4 basis-1/2 order-2">
                <label className="block font-semibold mb-3">Heading</label>
                <input
                  type="text"
                  name={`Heading-${index}`}
                  value={section.Heading}
                  onChange={(e) => handleInputChange(e, index, 'Heading')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>


              {/* Section Image */}
              <div className='basis-1/2 order-1 p-10'>

              <div className="mb-4 border-[1px]  relative border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-[#D4DDDD] transition-colors duration-300 mr-12 aspect-[2/1]">
                {formValues?.sections[index]?.image ? (
                  <img
                  src={URL.createObjectURL(formValues?.sections[index]?.image)}
                    alt="Selected"
                    className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center flex-col gap-5 w-full aspect-[2/1] pointer-events-none z-10 cursor-pointer">
                    <p className="font-semibold">Upload Image</p>
                    <Upload size={36} className="text-gray-700" />
                  </span>
                )}
                <input
                  id="image"
                  type="file"
                  name="image"
                  onChange={(e) => handleImageChange(e, index, 'image')}
                  className=" absolute opacity-0 top-10 cursor-pointer w-full h-full"
                  accept="image/*"
                  />
                </div>
                  </div>
              </div>

              {/* Sub Headings and Details */}
              {['1', '2', '3'].map((subIndex) => (
                <div key={subIndex} className="space-y-2 pb-4">
                  <label className="block font-semibold mb-3">Sub Heading {subIndex}</label>
                  <input
                    type="text"
                    name={`subHeading${subIndex}-${index}`}
                    value={section[`subHeading${subIndex}`]}
                    placeholder={`Enter sub Heading ${subIndex}`}
                    onChange={(e) => handleInputChange(e, index, `subHeading${subIndex}`)}
                    className="w-full p-2 border rounded"
                    required
                  />

                  <label className="block font-semibold py-3">Sub Heading {subIndex} Details</label>
                  <textarea
                    name={`subHeadingdetails${subIndex}-${index}`}
                    value={section[`subHeadingdetails${subIndex}`]}
                    onChange={(e) => handleInputChange(e, index, `subHeadingdetails${subIndex}`)}
                    placeholder={`Enter sub Heading ${subIndex} Details`}
                    className="w-full p-2 border rounded"
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
