'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, PlusCircle, X, Film, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateProject() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    Title: '',
    detail: '',
    slug: '',
    mediaType: 'image', // Default to image
    media: null,
    relatedServices: '', // Add related service field
    sections: [
      {
        title: '',
        image: null,
        points: [{ title: '', detail: '' }]
      }
    ]
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [videoKey, setVideoKey] = useState(0); // Key to force video element to remount
  const [services, setServices] = useState([]); // Add state for services list
  const [loading, setLoading] = useState(false); // Add loading state for services

  // Fetch services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/service/getservice');
        if (response.data && response.data.success) {
          setServices(response.data.services || []);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Generate slug from title
  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));

    // Auto-generate slug when title changes
    if (name === 'Title' && value) {
      setFormValues(prev => ({ ...prev, slug: generateSlug(value) }));
    }

    // When mediaType changes, clear the current media if it's not compatible
    if (name === 'mediaType') {
      if ((value === 'image' && formValues.media?.type?.startsWith('video/')) || 
          (value === 'video' && formValues.media?.type?.startsWith('image/'))) {
        setFormValues(prev => ({ ...prev, media: null }));
        setMediaPreview(null);
      }
    }
  };

  // Handle media file selection
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormValues(prev => ({ ...prev, media: file }));
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);
    
    // Auto-detect media type
    if (file.type.startsWith('video/')) {
      setFormValues(prev => ({ ...prev, mediaType: 'video' }));
      setVideoKey(prev => prev + 1); // Force video element to remount
    } else {
      setFormValues(prev => ({ ...prev, mediaType: 'image' }));
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  // Handle section title changes
  const handleSectionTitleChange = (index, value) => {
    const updatedSections = [...formValues.sections];
    updatedSections[index].title = value;
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Handle section image changes
  const handleSectionImageChange = (sectionIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex].image = file;
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Add a new section
  const addSection = () => {
    setFormValues(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: '',
          image: null,
          points: [{ title: '', detail: '' }]
        }
      ]
    }));
  };

  // Remove a section
  const removeSection = (index) => {
    const updatedSections = formValues.sections.filter((_, i) => i !== index);
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Add a new point to a section
  const addPoint = (sectionIndex) => {
    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex].points.push({ title: '', detail: '' });
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Remove a point from a section
  const removePoint = (sectionIndex, pointIndex) => {
    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex].points = updatedSections[sectionIndex].points.filter((_, i) => i !== pointIndex);
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Handle point changes
  const handlePointChange = (sectionIndex, pointIndex, field, value) => {
    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex].points[pointIndex][field] = value;
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Form validation
  const validateForm = () => {
    if (!formValues.Title || !formValues.detail || !formValues.slug || !formValues.media || !formValues.relatedServices) {
      setError('Please fill all required fields and upload a media file');
      return false;
    }

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formValues.slug)) {
      setError('Slug must be lowercase, containing only letters, numbers, and hyphens');
      return false;
    }

    // Validate media type matches file type
    if (formValues.mediaType === 'image' && formValues.media.type.startsWith('video/')) {
      setError('Selected file is a video but media type is set to image');
      return false;
    }
    
    if (formValues.mediaType === 'video' && formValues.media.type.startsWith('image/')) {
      setError('Selected file is an image but media type is set to video');
      return false;
    }

    // Validate sections
    for (const section of formValues.sections) {
      if (!section.title || !section.image || section.points.length === 0) {
        setError('Each section must have a title, image, and at least one point');
        return false;
      }

      for (const point of section.points) {
        if (!point.title || !point.detail) {
          setError('All points must have a title and detail');
          return false;
        }
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setSaving(true);
    
    const formData = new FormData();
    formData.append('Title', formValues.Title);
    formData.append('detail', formValues.detail);
    formData.append('slug', formValues.slug);
    formData.append('mediaType', formValues.mediaType);
    formData.append('media', formValues.media);
    formData.append('relatedServices', formValues.relatedServices); // Add related service to form data

    // Add sections data
    formValues.sections.forEach((section, sectionIndex) => {
      formData.append(`section[${sectionIndex}][title]`, section.title);
      if (section.image) {
        formData.append(`section[${sectionIndex}][image]`, section.image);
      }

      // Add points for each section
      section.points.forEach((point, pointIndex) => {
        formData.append(`section[${sectionIndex}][points][${pointIndex}][title]`, point.title);
        formData.append(`section[${sectionIndex}][points][${pointIndex}][detail]`, point.detail);
      });
    });

    try {
      const response = await axios.post('/api/project/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.status === 201) {
        setSuccess('Project created successfully!');
        
        // Reset form after successful submission
        setFormValues({
          Title: '',
          detail: '',
          slug: '',
          mediaType: 'image',
          media: null,
          relatedServices: '',
          sections: [
            {
              title: '',
              image: null,
              points: [{ title: '', detail: '' }]
            }
          ]
        });
        setMediaPreview(null);
        
        // Redirect to projects page after 2 seconds
        setTimeout(() => {
          router.push('/admin/website/projects');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Error creating project');
    } finally {
      setSaving(false);
    }
  };

  // Get file size in readable format
  const getFileSize = (file) => {
    if (!file) return '';
    const sizeMB = file.size / (1024 * 1024);
    return sizeMB.toFixed(2) + ' MB';
  };

  // Get accepted file types based on mediaType
  const getAcceptedFileTypes = () => {
    return formValues.mediaType === 'image' 
      ? 'image/jpeg, image/png, image/gif, image/webp' 
      : 'video/mp4, video/webm, video/ogg';
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Create New Project</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlusCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
              <input
                type="text"
                name="Title"
                value={formValues.Title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Project Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Slug * 
                <span className="text-xs text-gray-500 ml-1">(URL-friendly identifier)</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formValues.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use lowercase letters, numbers, and hyphens only (e.g., "my-project-name")
              </p>
            </div>

            {/* Related Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Service *</label>
              <select
                name="relatedServices"
                value={formValues.relatedServices}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="">Select a related service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.Title}
                  </option>
                ))}
              </select>
              {loading && <p className="text-xs text-gray-500 mt-1">Loading services...</p>}
            </div>

            {/* Project Detail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Detail *</label>
              <textarea
                name="detail"
                value={formValues.detail}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Media Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Media Type *</label>
              <div className="flex space-x-4">
                <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${formValues.mediaType === 'image' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="mediaType"
                    value="image"
                    checked={formValues.mediaType === 'image'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <ImageIcon className="h-5 w-5 text-gray-700 mr-2" />
                  <span>Image</span>
                </label>
                <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${formValues.mediaType === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="mediaType"
                    value="video"
                    checked={formValues.mediaType === 'video'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <Film className="h-5 w-5 text-gray-700 mr-2" />
                  <span>Video</span>
                </label>
              </div>
            </div>

            {/* Project Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project {formValues.mediaType === 'image' ? 'Image' : 'Video'} *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {mediaPreview ? (
                    <div className="relative">
                      {formValues.mediaType === 'image' ? (
                        <img
                          src={mediaPreview}
                          alt="Media preview"
                          className="mx-auto h-64 w-full object-cover rounded-md"
                        />
                      ) : (
                        <video
                          key={videoKey}
                          src={mediaPreview}
                          controls
                          className="mx-auto h-64 w-full rounded-md"
                        />
                      )}
                      {formValues.media && (
                        <div className="mt-2 text-xs text-gray-500">
                          {formValues.media.name} ({getFileSize(formValues.media)})
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMediaPreview(null);
                          setFormValues(prev => ({ ...prev, media: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="media-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                          <span>Upload a file</span>
                          <input
                            id="media-upload"
                            name="media"
                            type="file"
                            className="sr-only"
                            onChange={handleMediaChange}
                            accept={getAcceptedFileTypes()}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formValues.mediaType === 'image' 
                          ? 'PNG, JPG, GIF, WebP up to 10MB' 
                          : 'MP4, WebM, OGG up to 50MB'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Sections</h2>
          
          {formValues.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8 p-6 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Section {sectionIndex + 1}</h3>
                {formValues.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Section Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Section Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Image *</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {section.image ? (
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(section.image)}
                              alt="Section preview"
                              className="mx-auto h-40 w-full object-cover rounded-md"
                            />
                            {section.image && (
                              <div className="mt-2 text-xs text-gray-500">
                                {section.image.name} ({getFileSize(section.image)})
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedSections = [...formValues.sections];
                                updatedSections[sectionIndex].image = null;
                                setFormValues({ ...formValues, sections: updatedSections });
                              }}
                              className="absolute top-2 right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor={`section-image-${sectionIndex}`}
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 transition-colors"
                              >
                                <span>Upload a file</span>
                                <input
                                  id={`section-image-${sectionIndex}`}
                                  type="file"
                                  className="sr-only"
                                  onChange={(e) => handleSectionImageChange(sectionIndex, e)}
                                  accept="image/*"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  {/* Points */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Points *</label>
                      <button
                        type="button"
                        onClick={() => addPoint(sectionIndex)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle className="h-3 w-3 mr-1" /> Add Point
                      </button>
                    </div>
                    
                    <div className="space-y-4 max-h-80 overflow-y-auto p-2">
                      {section.points.map((point, pointIndex) => (
                        <div key={pointIndex} className="p-3 border rounded-md bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">Point {pointIndex + 1}</h4>
                            {section.points.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePoint(sectionIndex, pointIndex)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                              <input
                                type="text"
                                value={point.title}
                                onChange={(e) => handlePointChange(sectionIndex, pointIndex, 'title', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Detail</label>
                              <textarea
                                value={point.detail}
                                onChange={(e) => handlePointChange(sectionIndex, pointIndex, 'detail', e.target.value)}
                                rows="2"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" /> Add Section
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${saving ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}