'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTestimonial = ({ testimonial }) => {
  const [formData, setFormData] = useState({
    Testimonial: testimonial.Testimonial,
    postedBy: testimonial.postedBy,
    role: testimonial.role,
    image: null,
    relatedService: testimonial.relatedService || '',
    relatedIndustry: testimonial.relatedIndustry || '',
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
    data.append('relatedService', formData.relatedService);
    data.append('relatedIndustry', formData.relatedIndustry);
    data.append('testimonialId', testimonial._id); // Add the testimonial ID

    // Append image if provided
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.post('/api/testimonial/edit', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setMessage('Testimonial updated successfully!');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      setMessage('Failed to update testimonial. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Testimonial</h2>
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
          <label className="block text-gray-700 font-medium mb-2">Upload New Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Related Services */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Related Services</label>
          <select
            name="relatedService"
            value={formData.relatedService}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a service</option>
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

        {/* Related Industries */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Related Industries</label>
          <select
            name="relatedIndustry"
            value={formData.relatedIndustry}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select an industry</option>
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
            Update Testimonial
          </button>
        </div>
      </form>

      {/* Message */}
      {message && <p className="text-center text-lg font-medium">{message}</p>}
    </div>
  );
};

export default EditTestimonial;
