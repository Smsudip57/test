'use client';

import React, { useState, useEffect,useRef,useContext } from 'react';
import axios from 'axios';
import { Pencil,ChevronLeft  , Upload } from 'lucide-react';
import { MyContext } from '@/context/context';
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
  const { setShowConfirm, setConfirmFunction, customToast  } = useContext(MyContext);
  const [saving, setSaving] = useState(false);
  const imageInputRef = useRef(null);
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
    const Save = async() =>{

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
  }
  setConfirmFunction(() => Save);
  setShowConfirm('Are you sure you want update this product?');
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
  }
  

  useEffect(() => {
    fetchProductsAndServices();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full mx-auto">
      {  !editingProduct && <>
      <div className="mb-4 flex justify-center gap-5">
      <h1 className="text-xl font-bold mb-4 w-full text-left">Edit Service</h1>
      {/* Category Selection */}
      <div className="mb-4">
      <label className="block text-xs text-gray-500 font-medium mb-2">Filter by Category</label>
        <select
          value={formValues.selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="mt-1 block min-w-max p-2 border rounded-md"
        >
          <option value="">Select a Category</option>
          {allCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {/* Service Selection */}
      { true && (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 font-medium mb-2">Filter by Service</label>
          <select
            onChange={(e) => handleServiceChange(e.target.value)}
            className="mt-1 block min-w-max p-2 border rounded-md"
          >
            <option value="">{formValues.selectedCategory?"Select a service":"Select a category first"}</option>
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
      </div>

      

      <ul className="space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li key={product._id} className="flex items-center bg-white p-4 shadow rounded-lg space-x-4">
              <img src={product.image} 
              alt={'Couldn\'t load'}
              className="w-16 h-16 rounded-md text-gray-400 text-xs object-cover overflow-hidden" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{product.Title}</h2>
                <p className="text-gray-600">{product.detail}</p>
              </div>
              <button
                onClick={() => handleEditClick(product)}
                className="text-white text-sm bg-[#446E6D] hover:bg-[#446e6d9d] px-4 py-2 rounded-md flex items-center gap-2"
                > 
              <Pencil style={{ width: '1em', height: '1em' }} /> 
                Edit
              </button>
            </li>
          ))
        ) : (
          <li>No products found for this service.</li>
        )}
      </ul>
        </>
      }

      {
              editingProduct && (
                <div className='w-full'>
                  <p className='flex gap-2 cursor-pointer justify-center items-center max-w-max text-gray-500 mb-4'
                  onClick={closeEditModal}
                  ><ChevronLeft style={{ width: '1em', height: '1em'}}/> Back</p>
                  </div>
              )
            }
{editingProduct && (
  <div className="w-full">
    <div className="w-full mx-auto p-10 bg-white rounded-lg shadow-lg">
    <h1 className="text-xl font-bold mb-4 w-full text-left">Edit Service</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div onSubmit={handleSave} className="space-y-4 flex items-center">
        <div className='mb-4 basis-1/2'>
          {/* Image Upload */}
        <div className="relative overflow-hidden">
          <input
            id="image"
            name="image"
            type="file"
            onChange={handleImageChange}
            required
            className="mt-1 hidden p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={imageInputRef}
            />
                        <div className='mb-4 flex items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-[#D4DDDD] transition-colors duration-300 mr-12 aspect-[2/1] relative overflow-hidden'
             onClick={() => imageInputRef.current && imageInputRef.current.click()}
            >
            {formValues.image &&  (typeof formValues.image !== 'string' ?<img src={URL.createObjectURL(formValues.image)} alt="Selected Image" className='w-full h-full object-cover' /> :<><img src={formValues.image} alt="Selected Image" className='w-full h-full object-cover' /><span className='flex items-center justify-center flex-col gap-5 absolute bg-white/65 w-full h-full'>

          <label htmlFor="image" className="block font-semibold mb-1 ">
            Change Image
          </label>
            <Upload size={36} className='text-gray-700'/>
            </span></>)}
            </div>
        </div>
        </div>
        <div className='basis-1/2'>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="Title" className="block font-semibold mb-3">Title</label>
          <input
            id="Title"
            name="Title"
            value={formValues.Title}
            onChange={handleInputChange}
            type="text"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Detail */}
        <div className="mb-4 ">
          <label htmlFor="detail" className="block font-semibold mb-3">Detail</label>
          <textarea
            id="detail"
            name="detail"
            value={formValues.detail}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Sub Heading 1 */}
        <div className="mb-4">
          <label htmlFor="subHeading1" className="block font-semibold mb-3">Sub Heading 1</label>
          <input
            id="subHeading1"
            name="subHeading1"
            value={formValues.subHeading1}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            />
        </div>
        <div className="mb-4">
          <label htmlFor="subHeading1edtails" className="block font-semibold mb-3">Sub Heading 1 Details</label>
          <textarea
            id="subHeading1edtails"
            name="subHeading1edtails"
            value={formValues.subHeading1edtails}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Sub Heading 2 */}
        <div className="mb-4">
          <label htmlFor="subHeading2" className="block font-semibold mb-3">Sub Heading 2</label>
          <input
            id="subHeading2"
            name="subHeading2"
            value={formValues.subHeading2}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            />
        </div>
        <div className="mb-4">
          <label htmlFor="subHeading2edtails" className="block font-semibold mb-3">Sub Heading 2 Details</label>
          <textarea
            id="subHeading2edtails"
            name="subHeading2edtails"
            value={formValues.subHeading2edtails}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            />
        </div>

        {/* Sub Heading 3 */}
        <div className="mb-4">
          <label htmlFor="subHeading3" className="block font-semibold mb-3">Sub Heading 3</label>
          <input
            id="subHeading3"
            name="subHeading3"
            value={formValues.subHeading3}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            />
        </div>
        <div className="mb-4">
          <label htmlFor="subHeading3edtails" className="block font-semibold mb-3">Sub Heading 3 Details</label>
          <textarea
            id="subHeading3edtails"
            name="subHeading3edtails"
            value={formValues.subHeading3edtails}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
            />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={closeEditModal}
          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded w-full"
        >
          Cancel
        </button>
      </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
