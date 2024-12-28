'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductListWithDelete() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [categories, setCategories] = useState([]); // Static categories
  const [services, setServices] = useState([]); // All services
  const [deleting, setDeleting] = useState(false);

  // Static categories
  const allCategories = [
    'Branding',
    'Workfrom Anywhere',
    'Modern Workplace',
    'Digital',
    'Endless Support'
  ];

  // Fetch products and services
  const fetchProductsAndServices = async () => {
    try {
      const productsResponse = await axios.get('/api/product/get', { withCredentials: true });
      const servicesResponse = await axios.get('/api/service/getservice', { withCredentials: true });

      setProducts(productsResponse.data.products || []);
      setServices(servicesResponse.data.services || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch products/services.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedService(null); // Reset selected service
    setFilteredProducts([]);
  };

  // Handle service selection change
  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);

    // Filter products based on the selected service's _id
    const filteredProductsByService = products.filter(product => product.category === serviceId);
    setFilteredProducts(filteredProductsByService);
  };

  // Handle product delete
  const handleDeleteClick = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeleting(true);

      try {
        await axios.post('/api/product/delete', { productId }, { withCredentials: true });
        setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
        setFilteredProducts(prevFilteredProducts => prevFilteredProducts.filter(product => product._id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.response?.data?.message || 'Failed to delete product.');
      } finally {
        setDeleting(false);
      }
    }
  };

  useEffect(() => {
    fetchProductsAndServices();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md"
        >
          <option value="">Select a category</option>
          {allCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Service Selection */}
      {selectedCategory && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Service</label>
          <select
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            <option value="">Select a service</option>
            {services
              .filter((service) => service.category === selectedCategory)
              .map((service) => (
                <option key={service._id} value={service._id}>
                  {service.Title}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Product List */}
      <ul className="space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li key={product._id} className="flex items-center bg-white p-4 shadow rounded-lg space-x-4">
              <img src={product.image} alt={product.Title} className="w-16 h-16 object-cover rounded-md" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{product.Title}</h2>
                <p className="text-gray-600">{product.detail}</p>
              </div>
              <button
                onClick={() => handleDeleteClick(product._id)}
                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))
        ) : (
          <li>No products found for this service.</li>
        )}
      </ul>
    </div>
  );
}
