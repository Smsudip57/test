'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateProduct() {
  const [formValues, setFormValues] = useState({
    Title: '',
    detail: '',
    selectedCategory: '',
    selectedService: '',
    image: null,
    subHeading1: '',
    subHeading1edtails: '',
    subHeading2: '',
    subHeading2edtails: '',
    subHeading3: '',
    subHeading3edtails: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [noServicesMessage, setNoServicesMessage] = useState('');

  // Enum for category options
  const categoriesEnum = [
    'Branding',
    'Workfrom Anywhere',
    'Modern Workplace',
    'Digital',
    'Endless Support',
  ];

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/service/getservice');
        if (response.data.success) {
          setServices(response.data.services); // Assuming response.data.services contains all services
        } else {
          setError('Failed to load services.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch services.');
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'selectedService') {
      // Get the corresponding _id from the services list
      const selectedService = services.find(service => service.Title === value);
      setFormValues((prev) => ({ ...prev, [name]: value, category: selectedService?._id }));
    }
    
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Filter services based on the selected category
    if (name === 'selectedCategory') {
      const filtered = services.filter((service) => service.category === value);
      setFilteredServices(filtered);

      // If no services are available for the selected category
      if (filtered.length === 0) {
        setNoServicesMessage('No services available for this category.');
      } else {
        setNoServicesMessage('');
      }
    }
  };

  const handleImageChange = (e) => {
    setFormValues((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a FormData object and append all the form fields
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key === 'image' && formValues[key]) {
        formData.append(key, formValues[key]);
      } else if (formValues[key]) {
        formData.append(key, formValues[key]);
      }
    });

    // Check if all required fields are present
    if (!formValues.Title || !formValues.detail || !formValues.selectedCategory || !formValues.image || !formValues.subHeading1 || !formValues.subHeading1edtails || !formValues.subHeading2 || !formValues.subHeading2edtails || !formValues.subHeading3 || !formValues.subHeading3edtails) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/product/create', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setError('');
        alert('Product created successfully');
      } else {
        setError(response.data.message || 'Failed to create product.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4 w-full text-left">Create a Product</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          {/* Image Upload */}
        <div className="flex flex-col">
          <label htmlFor="image" className="font-medium text-gray-700">Product Image</label>
          <input
            id="image"
            name="image"
            type="file"
            onChange={handleImageChange}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        </div>
        <div>
        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="Title" className="font-medium text-gray-700">Title</label>
          <input
            id="Title"
            name="Title"
            value={formValues.Title}
            onChange={handleInputChange}
            type="text"
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Detail */}
        <div className="flex flex-col">
          <label htmlFor="detail" className="font-medium text-gray-700">Detail</label>
          <textarea
            id="detail"
            name="detail"
            value={formValues.detail}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border whitespace-pre-wrap border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="selectedCategory" className="font-medium text-gray-700">Related to (Category)</label>
          <select
            id="selectedCategory"
            name="selectedCategory"
            value={formValues.selectedCategory}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Select a category</option>
            {categoriesEnum.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Service Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="selectedService" className="font-medium text-gray-700">Related to (Service)</label>
          <select
            id="selectedService"
            name="selectedService"
            value={formValues.selectedService}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!formValues.selectedCategory}
            >
            <option value="">Select a service</option>
            {filteredServices.map((service) => (
              <option key={service._id} value={service.Title}>
                {service.Title}
              </option>
            ))}
          </select>
          {noServicesMessage && (
            <div className="text-red-500 mt-2">{noServicesMessage}</div>
          )}
        </div>

        {/* Sub Heading 1 */}
        <div className="flex flex-col">
          <label htmlFor="subHeading1" className="font-medium text-gray-700">Sub Heading 1</label>
          <input
            id="subHeading1"
            name="subHeading1"
            value={formValues.subHeading1}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="flex flex-col">
          <label htmlFor="subHeading1edtails" className="font-medium text-gray-700">Sub Heading 1 Details</label>
          <textarea
            id="subHeading1edtails"
            name="subHeading1edtails"
            value={formValues.subHeading1edtails}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border whitespace-pre-wrap border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sub Heading 2 */}
        <div className="flex flex-col">
          <label htmlFor="subHeading2" className="font-medium text-gray-700">Sub Heading 2</label>
          <input
            id="subHeading2"
            name="subHeading2"
            value={formValues.subHeading2}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="flex flex-col">
          <label htmlFor="subHeading2edtails" className="font-medium text-gray-700">Sub Heading 2 Details</label>
          <textarea
            id="subHeading2edtails"
            name="subHeading2edtails"
            value={formValues.subHeading2edtails}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border whitespace-pre-wrap border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Sub Heading 3 */}
        <div className="flex flex-col">
          <label htmlFor="subHeading3" className="font-medium text-gray-700">Sub Heading 3</label>
          <input
            id="subHeading3"
            name="subHeading3"
            value={formValues.subHeading3}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="flex flex-col">
          <label htmlFor="subHeading3edtails" className="font-medium text-gray-700">Sub Heading 3 Details</label>
          <textarea
            id="subHeading3edtails"
            name="subHeading3edtails"
            value={formValues.subHeading3edtails}
            onChange={handleInputChange}
            required
            className="mt-1 p-3 border whitespace-pre-wrap border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
        </div>
      </form>
    </div>
  );
}
