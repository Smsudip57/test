'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTestimonial = () => {
  const [formData, setFormData] = useState({
    Testimonial: '',
    postedBy: '',
    role: '',
    image: null,
    relatedService: '',  // Only one service
    relatedIndustry: '', // Only one industry
  });
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch services and industries from the backend
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/service/getservice');
        setServices(response.data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    const fetchIndustries = async () => {
      try {
        const response = await axios.get('/api/industry/get');
        setIndustries(response.data.industries);
      } catch (error) {
        console.error('Error fetching industries:', error);
      }
    };

    fetchServices();
    fetchIndustries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled in
    if (!formData.Testimonial || !formData.postedBy || !formData.role || !formData.image) {
      setMessage('Please fill in all the fields and upload an image.');
      return;
    }

    const data = new FormData();
    data.append('Testimonial', formData.Testimonial);
    data.append('postedBy', formData.postedBy);
    data.append('role', formData.role);
    data.append('image', formData.image);

    // Append the selected related service and industry to the FormData
    if (formData.relatedService) {
      data.append('relatedService', formData.relatedService);
    }
    if (formData.relatedIndustry) {
      data.append('relatedIndustry', formData.relatedIndustry);
    }

    try {
      const response = await axios.post('/api/testimonial/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setMessage('Testimonial created successfully!');
        setFormData({
          Testimonial: '',
          postedBy: '',
          role: '',
          image: null,
          relatedService: '',  // Reset the service selection
          relatedIndustry: '', // Reset the industry selection
        });
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      setMessage('Failed to create testimonial. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create Testimonial</h2>
      <form onSubmit={handleSubmit}>
        {/* Testimonial Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Testimonial</label>
          <textarea
            name="Testimonial"
            value={formData.Testimonial}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Author's Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Posted By</label>
          <input
            type="text"
            name="postedBy"
            value={formData.postedBy}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Role Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Related Service */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Related Service</label>
          <select
            name="relatedService"
            value={formData.relatedService} // Single selection value
            onChange={handleInputChange} // Handle single selection change
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {services.length > 0 ? (
              services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.Title}
                </option>
              ))
            ) : (
              <option disabled>No services available</option>
            )}
          </select>
        </div>

        {/* Related Industry */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Related Industry</label>
          <select
            name="relatedIndustry"
            value={formData.relatedIndustry} // Single selection value
            onChange={handleInputChange} // Handle single selection change
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {industries.length > 0 ? (
              industries.map((industry) => (
                <option key={industry._id} value={industry._id}>
                  {industry.Title}
                </option>
              ))
            ) : (
              <option disabled>No industries available</option>
            )}
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Submit Testimonial
          </button>
        </div>
      </form>

      {/* Message */}
      {message && <p className="text-center text-lg font-medium">{message}</p>}
    </div>
  );
};

export default CreateTestimonial;
