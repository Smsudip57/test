'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {Upload} from 'lucide-react'
import { MyContext } from '@/context/context';
import { useContext } from 'react';


export default function ServiceForm() {
  const [formData, setFormData] = useState({
    Title: '',
    slug: '',
    detail: '',
    moreDetail: '',
    category: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [slugError, setSlugError] = useState('');
  const imageInputRef = useRef(null);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);

  const categories = [
    'Branding',
    'Workfrom Anywhere',
    'Modern Workplace',
    'Digital',
    'Endless Support',
  ];
  const context = useContext(MyContext);

  // Function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Auto-generate slug when title changes if autoGenerateSlug is true
  useEffect(() => {
    if (autoGenerateSlug && formData.Title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.Title)
      }));
    }
  }, [formData.Title, autoGenerateSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear slug error when slug is modified
    if (name === 'slug') {
      setSlugError('');
    }
  };

  const handleSlugChange = (e) => {
    // When manually editing the slug, turn off auto-generation
    setAutoGenerateSlug(false);
    handleChange(e);
  };

  const validateSlug = (slug) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const Delete = async () => {
      // Ensure all required fields are filled
      if (!formData.Title || !formData.detail || !formData.moreDetail || 
          !formData.category || !formData.image || !formData.slug) {
        setErrorMessage('All fields are required!');
        return;
      }
      
      // Validate slug format
      if (!validateSlug(formData.slug)) {
        setSlugError('Slug must be lowercase, containing only letters, numbers, and hyphens');
        return;
      }
      
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      setSlugError('');
      
      // Prepare form data
      const data = new FormData();
      data.append('Title', formData.Title);
      data.append('slug', formData.slug);
      data.append('detail', formData.detail);
      data.append('moreDetail', formData.moreDetail);
      data.append('category', formData.category);
      data.append('image', formData.image);
      
      try {
        const response = await axios.post('/api/service/createservice', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, 
        });

        context.customToast(response.data)
        setFormData({
          Title: '',
          slug: '',
          detail: '',
          moreDetail: '',
          category: '',
          image: null,
        });
        setAutoGenerateSlug(true);
      } catch (error) {
        if (error.response && error.response.data) {
          context.customToast(error.response.data);
          // Set specific error for slug if that's the issue
          if (error.response.data.message && error.response.data.message.includes('slug')) {
            setSlugError(error.response.data.message);
          }
        } else {
          context.customToast({success: false, message: 'Something went wrong'});
        }
      } finally {
        setLoading(false);
      }
    }
    context.setShowConfirm('Are you sure you want to create a new service?');
    context.setConfirmFunction(() => Delete);
  };
  
  return (
    <div className="p-10 bg-white shadow rounded-md w-full mx-auto text-gray-700">
      <h1 className="text-xl font-bold mb-4 w-full text-left">Create a Service</h1>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="w-full flex flex-row items-center">
        <div className="mb-4 basis-1/2">
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full hidden"
            ref={imageInputRef}
          />
          <div className='flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-[#D4DDDD] transition-colors duration-300 mr-12 aspect-[2/1]'
            onClick={() => imageInputRef.current && imageInputRef.current.click()}
          >
            {formData.image ? 
              <img src={URL.createObjectURL(formData.image)} alt="Selected Image" className='w-full h-full object-cover' /> :
              <span className='flex items-center justify-center flex-col gap-5'>
                <label htmlFor="image" className="block font-semibold mb-1 ">
                  Upload Image
                </label>
                <Upload size={36} className='text-gray-700'/>
              </span>
            }
          </div>
        </div>

        <div className='basis-1/2'>
          <div className="mb-4">
            <label htmlFor="Title" className="block font-semibold mb-3">
              Title
            </label>
            <input
              type="text"
              id="Title"
              name="Title"
              value={formData.Title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter the title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="slug" className="block font-semibold mb-3">
              Slug
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                className={`w-full p-2 border rounded ${slugError ? 'border-red-500' : ''}`}
                placeholder="Enter the slug (e.g., my-service-name)"
              />
              {slugError && <p className="text-red-500 text-sm mt-1">{slugError}</p>}
              <div className="mt-1 flex items-center">
                <input
                  type="checkbox"
                  id="autoSlug"
                  checked={autoGenerateSlug}
                  onChange={() => setAutoGenerateSlug(!autoGenerateSlug)}
                  className="mr-2"
                />
                <label htmlFor="autoSlug" className="text-sm text-gray-600">Auto-generate from title</label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="detail" className="block font-semibold mb-3">
              Detail
            </label>
            <textarea
              id="detail"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter the details (new lines will be preserved)"
              rows={5}
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="moreDetail" className="block font-semibold mb-3">
              More Detail
            </label>
            <textarea
              id="moreDetail"
              name="moreDetail"
              value={formData.moreDetail}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter more details (new lines will be preserved)"
              rows={3}
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block font-semibold mb-3">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}