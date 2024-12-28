'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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
    if (!confirm('Are you sure you want to delete this service?')) return;

    setDeletingServiceId(serviceId); // Track which service is being deleted
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Services</h1>

      {/* Category Filter */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Filter by Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Service List */}
      {filteredServices.length === 0 ? (
        <p>No services available for the selected category.</p>
      ) : (
        <ul className="space-y-4">
          {filteredServices.map((service) => (
            <li
              key={service._id}
              className="flex justify-between items-center bg-white p-4 shadow rounded-lg"
            >
              <div className="flex items-center">
                <img
                  src={service.image || '/placeholder.png'}
                  alt={service.Title}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold">{service.Title}</h2>
                  <p className="text-gray-600">{service.deltail}</p>
                  <p className="text-gray-500 text-sm">{service.category}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(service._id)}
                disabled={deletingServiceId === service._id}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md disabled:opacity-50"
              >
                {deletingServiceId === service._id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
