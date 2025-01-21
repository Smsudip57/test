'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IndustryManager = () => {
  const [industries, setIndustries] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch all industries
  const fetchIndustries = async () => {
    try {
      const response = await axios.get('/api/industry/get');
      if (response.status === 200) {
        setIndustries(response.data.industries);
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
      setMessage('Failed to fetch industries.');
    }
  };

  // Delete an industry
  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this industry?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `/api/industry/delete`, 
        {
          data: { id }, // Pass the id in the data object
          withCredentials: true // Ensure cookies are sent with the request
        }
      );
      
      if (response.status === 200) {
        setMessage('Industry deleted successfully.');
        setIndustries((prev) => prev.filter((industry) => industry._id !== id));
      }
    } catch (error) {
      console.error('Error deleting industry:', error);
      setMessage('Failed to delete the industry. Please try again.');
    }
  };

  // Fetch industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Manage Industries</h1>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        {industries.length > 0 ? (
          <ul className="space-y-4">
            {industries.map((industry) => (
              <li
                key={industry._id}
                className="p-4 bg-gray-50 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">{industry.Title}</h2>
                  <p className="text-sm text-gray-600">{industry.detail}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleDelete(industry._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No industries available.</p>
        )}
      </div>
    </div>
  );
};

export default IndustryManager;
