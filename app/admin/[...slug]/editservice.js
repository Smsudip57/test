'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditServiceList() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [formValues, setFormValues] = useState({
    Title: '',
    deltail: '',
    moreDetail: '',
    category: '',
    image: null,
  });
  const [categories] = useState([
    'Branding',
    'Workfrom Anywhere',
    'Modern Workplace',
    'Digital',
    'Endless Support',
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch services
  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/service/getservice', {
        withCredentials: true,
      });
      const fetchedServices = response.data.services || [];
      setServices(fetchedServices);
      setFilteredServices(fetchedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((service) => service.category === category));
    }
  };

  // Open edit modal with pre-filled values
  const handleEditClick = (service) => {
    setEditingService(service._id);
    setFormValues({
      Title: service.Title,
      deltail: service.deltail,
      category: service.category,
      moreDetail: service.moreDetail,
      image: null,
    });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingService(null);
    setFormValues({ Title: '', deltail: '', category: '', image: null, moreDetail: '' });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormValues((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Save edited service
  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('serviceId', editingService);
    formData.append('Title', formValues.Title);
    formData.append('deltail', formValues.deltail);
    formData.append('category', formValues.category);
    formData.append('moreDetail', formValues.moreDetail);
    if (formValues.image) {
      formData.append('image', formValues.image);
    }

    try {
      await axios.post('/api/service/editservice', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchServices();
      closeEditModal();
    } catch (err) {
      console.error('Error saving service:', err);
      setError(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <div>Loading services...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Services</h1>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Filter by Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredServices.length === 0 ? (
        <p>No services available.</p>
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
                  alt={service.Title}
                  className="w-16 h-16 rounded-md object-cover"
                />
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{service.Title}</h2>
                <p className="text-gray-600">{service.deltail}</p>
                <p className="text-gray-500 text-sm">{service.category}</p>
              </div>
              <button
                onClick={() => handleEditClick(service)}
                className="text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for editing */}
      {editingService && (
        <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Service</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="Title"
                value={formValues.Title}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Detail</label>
              <textarea
                name="deltail"
                value={formValues.deltail}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">More Detail</label>
              <textarea
                name="moreDetail"
                value={formValues.moreDetail}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Category</label>
              <select
                name="category"
                value={formValues.category}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border rounded-md"
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
              <label className="block text-sm font-medium">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
