'use client';
import React, { useState } from 'react';
import axios from 'axios';

const CreateIndustry = () => {
  const [formData, setFormData] = useState({
    Title: '',
    Heading: '',
    detail: '',
    Efficiency: '',
    costSaving: '',
    customerSatisfaction: '',
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (!formData.Title || !formData.Heading || !formData.detail || !image) {
      setMessage('Please fill all required fields and upload an image.');
      return;
    }

    const data = new FormData();
    data.append('Title', formData.Title);
    data.append('Heading', formData.Heading);
    data.append('detail', formData.detail);
    data.append('Efficiency', formData.Efficiency || 0); // Defaults to 0 if not provided
    data.append('costSaving', formData.costSaving || 0); // Defaults to 0 if not provided
    data.append('customerSatisfaction', formData.customerSatisfaction || 0); // Defaults to 0 if not provided
    data.append('image', image);

    try {
      const response = await axios.post('/api/industry/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.status === 201) {
        setMessage('Industry created successfully!');
        setFormData({
          Title: '',
          Heading: '',
          detail: '',
          Efficiency: '',
          costSaving: '',
          customerSatisfaction: '',
        });
        setImage(null);
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to create industry. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create Industry</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title:</label>
          <input
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Heading:</label>
          <input
            type="text"
            name="Heading"
            value={formData.Heading}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Detail:</label>
          <textarea
            name="detail"
            value={formData.detail}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Efficiency (optional):</label>
          <input
            type="number"
            name="Efficiency"
            value={formData.Efficiency}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Cost Saving (optional):</label>
          <input
            type="number"
            name="costSaving"
            value={formData.costSaving}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Customer Satisfaction (optional):</label>
          <input
            type="number"
            name="customerSatisfaction"
            value={formData.customerSatisfaction}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Create Industry
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes('successfully')
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateIndustry;
