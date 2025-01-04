'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
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
  const [categories, setCategories] = useState([]); // Static categories
  const [services, setServices] = useState([]); // All services
  const [selectedService, setSelectedService] = useState(null); // Selected service to filter products
  const [saving, setSaving] = useState(false);

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
    setFormValues((prev) => ({ ...prev, selectedCategory: category }));

    // Reset the selected service
    setSelectedService(null);
    setFormValues((prev) => ({ ...prev, selectedService: '' }));

    // Reset filtered product list
    setFilteredProducts([]);
  };

  // Handle service selection change
  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);

    // Filter products based on the selected service's _id
    const filteredProductsByService = products.filter(product => product.category === serviceId);
    setFilteredProducts(filteredProductsByService);
  };

  // Open edit modal with pre-filled values
  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setFormValues({
      Title: product.Title,
      detail: product.detail,
      selectedCategory: '', // Not editable
      selectedService: '', // Not editable
      image: product.image,
      subHeading1: product.subHeading1,
      subHeading1edtails: product.subHeading1edtails,
      subHeading2: product.subHeading2,
      subHeading2edtails: product.subHeading2edtails,
      subHeading3: product.subHeading3,
      subHeading3edtails: product.subHeading3edtails,
    });
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

  // Save edited product
  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('productId', editingProduct);
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      await axios.put('/api/product/edit', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchProductsAndServices();
      closeEditModal();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  // Close the edit modal
  const closeEditModal = () => {
    setEditingProduct(null);
    setFormValues({
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
  };

  useEffect(() => {
    fetchProductsAndServices();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Products</h1>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Category</label>
        <select
          value={formValues.selectedCategory}
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
      {formValues.selectedCategory && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Service</label>
          <select
            value={formValues.selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
          >
            <option value="">Select a service</option>
            {services
              .filter((service) => service.category === formValues.selectedCategory)
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
                onClick={() => handleEditClick(product)}
                className="text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md"
              >
                Edit
              </button>
            </li>
          ))
        ) : (
          <li>No products found for this service.</li>
        )}
      </ul>

      {/* Edit Modal */}
      {/* Edit Modal */}
{editingProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto z-50 pt-[400px]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md my-24">
      <h2 className="text-lg font-bold mb-4">Edit Product</h2>

      {/* Title */}
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

      {/* Detail */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Detail</label>
        <textarea
          name="detail"
          value={formValues.detail}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border rounded-md"
          rows="4"
        />
      </div>

      {/* SubHeading1 */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Sub Heading 1</label>
        <input
          type="text"
          name="subHeading1"
          value={formValues.subHeading1}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border rounded-md"
        />
      </div>

      {/* SubHeading1 Details */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Sub Heading 1 Details</label>
        <textarea
          name="subHeading1edtails"
          value={formValues.subHeading1edtails}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border rounded-md"
          rows="2"
        />
      </div>

      {/* SubHeading2 */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Sub Heading 2</label>
        <input
          type="text"
          name="subHeading2"
          value={formValues.subHeading2}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border rounded-md"
        />
      </div>

      {/* SubHeading2 Details */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Sub Heading 2 Details</label>
        <textarea
          name="subHeading2edtails"
          value={formValues.subHeading2edtails}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border rounded-md"
          rows="2"
        />
      </div>

      {/* SubHeading3 */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Sub Heading 3</label>
        <input
          type="text"
          name="subHeading3"
          value={formValues.subHeading3}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border rounded-md"
        />
      </div>

      {/* SubHeading3 Details */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Sub Heading 3 Details</label>
        <textarea
          name="subHeading3edtails"
          value={formValues.subHeading3edtails}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border rounded-md"
          rows="2"
        />
      </div>

      {/* Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Image</label>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="mt-1 block w-full p-2 border rounded-md"
        />
        {formValues.image && (
          <p className="text-sm text-gray-500 mt-1">Current Image: {formValues.image.name || 'Uploaded image'}</p>
        )}
      </div>

      {/* Save and Cancel Buttons */}
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
