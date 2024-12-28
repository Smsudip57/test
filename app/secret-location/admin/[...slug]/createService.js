'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function ServiceForm() {
  const [formData, setFormData] = useState({
    Title: '',
    detail: '',
    moreDetail: '',
    category: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    'Branding',
    'Workfrom Anywhere',
    'Modern Workplace',
    'Digital',
    'Endless Support',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (!formData.Title || !formData.detail || !formData.moreDetail || !formData.category || !formData.image) {
      setErrorMessage('All fields are required!');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Prepare form data
    const data = new FormData();
    data.append('Title', formData.Title);
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

      setSuccessMessage('Service created successfully!');
      setFormData({
        Title: '',
        detail: '',
        moreDetail: '',
        category: '',
        image: null,
      });
    } catch (error) {
      setErrorMessage('Error creating service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Create a New Service</h1>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="Title" className="block font-semibold mb-1">
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
          <label htmlFor="detail" className="block font-semibold mb-1">
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
          <label htmlFor="moreDetail" className="block font-semibold mb-1">
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
          <label htmlFor="category" className="block font-semibold mb-1">
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

        <div className="mb-4">
          <label htmlFor="image" className="block font-semibold mb-1">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
