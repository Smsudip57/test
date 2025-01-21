'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function EditProject() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formValues, setFormValues] = useState({
    Title: '',
    detail: '',
    image: null,
    sections: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch projects on component mount
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/project/get', { withCredentials: true });
        if (response.data.success) {
          setProjects(response.data.data);
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        setError('Error fetching projects');
      }
    };

    fetchProjects();
  }, []);

  // Handle selecting a project for editing
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setFormValues({
      Title: project.Title,
      detail: project.detail,
      image: null,
      sections: project.section || [],
    });
  };

  // Handle input changes
  const handleInputChange = (e, sectionIndex) => {
    const { name, value } = e.target;

    if (name.startsWith('section')) {
      // Extract the section index and field name from the input name
      const sectionId = parseInt(name.split('-')[1], 10);
      const field = name.split('-')[2]; // This will be either Heading, subHeading, or subHeadingDetails

      // Update the correct field in the corresponding section
      const updatedSections = [...formValues.sections];
      updatedSections[sectionId][field] = value;

      setFormValues({ ...formValues, sections: updatedSections });
    } else {
      // For non-section fields like Title, detail
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // Handle image changes for the main project image and section images
  const handleImageChange = (e, sectionIndex) => {
    const { name, files } = e.target;

    // Check if the field is a section
    if (name.startsWith('section')) {
      const sectionId = parseInt(name.split('-')[1], 10);  // Extract section index
      const updatedSections = [...formValues.sections];
      if (files && files[0]) {
        updatedSections[sectionId]['image'] = files[0]; // Update section image
      } else {
        updatedSections[sectionId]['image'] = null; // If no file selected, set to null
      }

      setFormValues({ ...formValues, sections: updatedSections });
    } else {
      // For the main project image
      if (files && files[0]) {
        setFormValues({ ...formValues, [name]: files[0] });
      }
    }
  };

  // Handle form submission (Save edited project)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Create FormData instance for the POST request
    const formData = new FormData();
    formData.append('_id', selectedProject._id);
    formData.append('Title', formValues.Title);
    formData.append('detail', formValues.detail);

    // Append the main project image if it's selected
    if (formValues.image) {
      formData.append('image', formValues.image);  // Append the actual image file
    }

    // Append section fields and files
    formValues.sections.forEach((section, index) => {
      formData.append(`section[${index}][Heading]`, section.Heading);
      if (section.image) {
        formData.append(`section[${index}][image]`, section.image);  // Append image file for section
      } else {
        formData.append(`section[${index}][image]`, 'null');  // Handle case when no image is uploaded for section
      }
      formData.append(`section[${index}][subHeading1]`, section.subHeading1);
      formData.append(`section[${index}][subHeading2]`, section.subHeading2);
      formData.append(`section[${index}][subHeading3]`, section.subHeading3);
      formData.append(`section[${index}][subHeadingdetails1]`, section.subHeadingdetails1);
      formData.append(`section[${index}][subHeadingdetails2]`, section.subHeadingdetails2);
      formData.append(`section[${index}][subHeadingdetails3]`, section.subHeadingdetails3);
    });

    try {
      const response = await axios.post(`/api/project/edit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.data.success) {
        setSuccess('Project updated successfully!');
        setTimeout(() => {
          router.push('/admin/projects/edit');
        }, 5000);
      } else {
        setError('Error updating project');
      }
    } catch (err) {
      console.error(err);
      setError('Error updating project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>

      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}

      <div className="mb-4">
        <label className="block text-sm font-medium">Select Project to Edit</label>
        <select
          onChange={(e) => handleSelectProject(projects.find(p => p._id === e.target.value))}
          className="mt-1 block w-full p-2 border rounded-md"
        >
          <option value="">Select a Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              <img src={project.image} alt={project.Title} className="w-8 h-8 mr-2 inline-block" />{project.Title}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <form onSubmit={handleSubmit}>
          {/* Project Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Project Title</label>
            <input
              type="text"
              name="Title"
              value={formValues.Title}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={(e) => handleImageChange(e, null)}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {formValues.sections.map((section, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Section {index + 1}</h3>

                {/* Heading */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">Heading</label>
                  <input
                    type="text"
                    name={`section-${index}-Heading`}
                    value={section.Heading}
                    onChange={(e) => handleInputChange(e, index)}
                    className="mt-1 block w-full p-2 border rounded-md"
                    required
                  />
                </div>

                {/* Section Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">Section Image</label>
                  <input
                    type="file"
                    name={`section-${index}-image`}
                    onChange={(e) => handleImageChange(e, index)}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </div>

                {/* Sub Headings and Details */}
                {['1', '2', '3'].map((subIndex) => (
                  <div key={subIndex} className="space-y-2 mb-4">
                    <label className="block text-sm font-medium">Sub Heading {subIndex}</label>
                    <input
                      type="text"
                      name={`section-${index}-subHeading${subIndex}`}
                      value={section[`subHeading${subIndex}`]}
                      onChange={(e) => handleInputChange(e, index)}
                      className="mt-1 block w-full p-2 border rounded-md"
                      required
                    />

                    <label className="block text-sm font-medium">Sub Heading {subIndex} Details</label>
                    <textarea
                      name={`section-${index}-subHeadingdetails${subIndex}`}
                      value={section[`subHeadingdetails${subIndex}`]}
                      onChange={(e) => handleInputChange(e, index)}
                      className="mt-1 block w-full p-2 border rounded-md"
                      rows="3"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
}
