'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IndustryManager = () => {
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [formData, setFormData] = useState({
    Title: '',
    Heading: '', // Added Heading
    detail: '',
    Efficiency: '',
    costSaving: '',
    customerSatisfaction: '',
  });
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch industries on load
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get('/api/industry/get');
        setIndustries(response.data.industries);
      } catch (error) {
        console.error('Failed to fetch industries:', error);
      }
    };
    fetchIndustries();
  }, []);

  // Handle selection of an industry to edit
  const handleEdit = (industry) => {
    setSelectedIndustry(industry);
    setFormData({
      Title: industry.Title,
      Heading: industry.Heading || '', // Populate Heading
      detail: industry.detail,
      Efficiency: industry.Efficiency || '',
      costSaving: industry.costSaving || '',
      customerSatisfaction: industry.customerSatisfaction || '',
    });
    setImage(null); // Clear previous image
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image changes
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Title || !formData.Heading || !formData.detail) {
      setMessage('Please fill all required fields.');
      return;
    }

    const data = new FormData();
    data.append('id', selectedIndustry._id); // Pass the industry ID
    data.append('Title', formData.Title);
    data.append('Heading', formData.Heading); // Include Heading
    data.append('detail', formData.detail);
    data.append('Efficiency', formData.Efficiency || 0);
    data.append('costSaving', formData.costSaving || 0);
    data.append('customerSatisfaction', formData.customerSatisfaction || 0);
    if (image) data.append('image', image); 
    if (logo) data.append('logo', logo);

    try {
      const response = await axios.post('/api/industry/edit', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.status === 200) {
        setMessage('Industry updated successfully!');
        // Update the local industries list
        setIndustries((prev) =>
          prev.map((item) =>
            item._id === selectedIndustry._id ? response.data.updatedIndustry : item
          )
        );
        setSelectedIndustry(null);
        setImage(null);
        setLogo(null);
      }
    } catch (error) {
      console.error('Failed to update industry:', error);
      setMessage('Failed to update industry. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Industry Manager</h2>

      {/* List of Industries */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Industries</h3>
        {industries.length > 0 ? (
          <ul className="space-y-4">
            {industries.map((industry) => (
              <li
                key={industry._id}
                className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h4 className="text-lg font-semibold">{industry.Title}</h4>
                  <p className="text-gray-600">{industry.detail}</p>
                </div>
                <button
                  onClick={() => handleEdit(industry)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No industries found.</p>
        )}
      </div>

      {/* Edit Industry Form */}
      {selectedIndustry && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold">Edit Industry</h3>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6 mt-4"
          >
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
              <label className="block text-gray-700 font-medium mb-2">
                Efficiency (optional):
              </label>
              <input
                type="number"
                name="Efficiency"
                value={formData.Efficiency}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Cost Saving (optional):
              </label>
              <input
                type="number"
                name="costSaving"
                value={formData.costSaving}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Customer Satisfaction (optional):
              </label>
              <input
                type="number"
                name="customerSatisfaction"
                value={formData.customerSatisfaction}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">New Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">New Logo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Save Changes
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
      )}
    </div>
  );
};

export default IndustryManager;
