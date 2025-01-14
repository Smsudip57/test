'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {Trash2 } from 'lucide-react';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingServiceId, setDeletingServiceId] = useState(null); // Track only the service being deleted

  
  // Fetch all services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/service/getservice', {
        withCredentials: true,
      });
      const allServices = response.data.services || [];

      // Set services and categories
      setServices(allServices);
      setFilteredServices(allServices);

      const uniqueCategories = ['All', ...new Set(allServices.map((service) => service.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a specific service
  const handleDelete = async (serviceId) => {
    console.log(serviceId);
    setDeletingServiceId(serviceId); 
    // if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.post(
        '/api/service/deleteservice',
        { serviceId },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Remove deleted service
      setServices((prevServices) => prevServices.filter((service) => service._id !== serviceId));
      setFilteredServices((prevServices) => prevServices.filter((service) => service._id !== serviceId));
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setDeletingServiceId(null); // Reset after deletion
    }
  };

  // Filter services by category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredServices(
      category === 'All' ? services : services.filter((service) => service.category === category)
    );
  };

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]); // Dependency array ensures `fetchServices` is stable

  if (loading) return <div>Loading services...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full text=gray-700 mx-auto p-6 bg-[#f5f5f5]">
      { <div>

      <div className="mb-4 flex justify-between">
      <h1 className="text-xl font-bold mb-4 w-full text-left">Choose to Delete Service</h1>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 font-medium mb-2">Filter by Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md"
          >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      </div>

      {filteredServices.length === 0 ? (
        <p className='text-gray-700 w-full h-[40vh] flex justify-center items-center text-center'>No services available.</p>
      ) : (
        <ul className="space-y-4">
          {filteredServices.map((service) => (
            <li
              key={service._id}
              className="flex items-center bg-white p-4 shadow rounded-lg space-x-4"
            >
              {/* Display Service Image */}
              {service.image && (
                <img
                src={service.image}
                alt={'Couldn\'t load'}
                className="w-16 h-16 rounded-md text-gray-400 text-xs object-cover overflow-hidden"
                />
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{service.Title}</h2>
                <p className="text-gray-600">{service.deltail}</p>
                <p className="text-gray-500 text-sm">{service.category}</p>
              </div>
              <button
                onClick={() => handleDelete(service._id)}
                disabled={deletingServiceId === service._id}
                className="text-white text-sm bg-red-500 hover:bg-red-300 px-4 py-2 rounded-md flex items-center gap-2"
              > <Trash2  style={{ width: '1em', height: '1em' }} /> 
                {deletingServiceId === service._id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
      </div>}
    </div>
  );
}
