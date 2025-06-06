'use client';

import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MyContext } from '@/context/context';

// Icons
import {
  Pencil,
  ChevronLeft,
  Upload,
  X,
  Plus,
  GripVertical,
  Image as ImageIcon,
  Save,
  AlertCircle,
  Trash2,
  Search,
  CheckCircle,
  Info,
  Filter
} from 'lucide-react';

export default function EditProductList() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { setShowConfirm, setConfirmFunction, customToast } = useContext(MyContext);
  const [saving, setSaving] = useState(false);
  const mainImageRef = useRef(null);
  
  // Track images to delete when updating
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  // Form state for editing
  const [productData, setProductData] = useState({
    Title: '',
    detail: '',
    moreDetail: '',
    slug: '', // Adding slug field
    category: '',
    image: null,
    sections: []
  });

  // Validate image dimensions (16:9 aspect ratio with 0.1% tolerance)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const width = this.width;
          const height = this.height;
          const aspectRatio = width / height;
          const targetRatio = 16 / 9;
          const tolerance = 0.001; // 0.1% tolerance
          
          if (Math.abs(aspectRatio - targetRatio) <= tolerance) {
            resolve({ width, height, aspectRatio });
          } else {
            reject({ 
              message: `Image must have a 16:9 aspect ratio. Current ratio is ${aspectRatio.toFixed(2)}:1`,
              dimensions: { width, height, aspectRatio }
            });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Fetch products and services
  const fetchProductsAndServices = async () => {
    try {
      setLoading(true);
      const productsResponse = await axios.get('/api/product/get', { withCredentials: true });
      const servicesResponse = await axios.get('/api/service/getservice', { withCredentials: true });

      setProducts(productsResponse.data.products || []);
      setServices(servicesResponse.data.services || []);
      
      // If there's already a selected service, update the filtered products
      if (selectedService) {
        const filtered = productsResponse.data.products?.filter(product => 
          product.category === selectedService
        ) || [];
        setFilteredProducts(filtered);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndServices();
  }, []);

  // Handle service selection change
  const handleServiceChange = useCallback((serviceId) => {
    setSelectedService(serviceId);
    
    // Filter products based on the selected service's _id
    const filtered = products.filter(product => product.category === serviceId);
    setFilteredProducts(filtered);
  }, [products]);

  // Search functionality
  const handleSearch = useCallback(() => {
    if (!selectedService) {
      customToast({ 
        success: false, 
        message: 'Please select a service first' 
      });
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      // If search term is empty, show all products for the selected service
      const filtered = products.filter(product => product.category === selectedService);
      setFilteredProducts(filtered);
      return;
    }

    // Filter by search term within the selected service
    const filtered = products.filter(product => 
      product.category === selectedService && 
      (product.Title.toLowerCase().includes(term) || 
       product.detail.toLowerCase().includes(term))
    );
    setFilteredProducts(filtered);
  }, [products, selectedService, searchTerm, customToast]);

  // Open edit mode with pre-filled values
  const handleEditClick = useCallback((product) => {
    setEditingProduct(product._id);
    setMainImagePreview(product.image);
    setImagesToDelete([]);
    
    // Transform the product data to match our form structure
    setProductData({
      Title: product.Title,
      detail: product.detail,
      moreDetail: product.moreDetail || '',
      slug: product.slug || generateSlug(product.Title),
      category: product.category,
      image: product.image,
      sections: product.sections || []
    });
  }, []);

  // Handle input changes for main product fields
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug when title changes
    if (name === 'Title') {
      setProductData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  }, []);

  // Handle main image upload with 16:9 validation
  const handleMainImageChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      setError('Only image files are allowed!');
      customToast({ success: false, message: 'Only image files are allowed!' });
      return;
    }
    
    try {
      // Validate image dimensions (16:9)
      await validateImageDimensions(file);
      
      // If there's an existing image, mark it for deletion
      if (typeof productData.image === 'string') {
        setImagesToDelete(prev => [...prev, productData.image]);
      }
      
      setProductData(prev => ({ ...prev, image: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
      customToast({ 
        success: false, 
        message: 'Image must have a 16:9 aspect ratio' 
      });
      e.target.value = '';
    }
  }, [productData.image, customToast]);

  // Section management
  const addSection = useCallback(() => {
    setProductData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: '',
          image: null,
          imagePreview: null,
          points: [{ title: '', detail: '' }]
        }
      ]
    }));
  }, []);

  const removeSection = useCallback((index) => {
    setProductData(prev => {
      if (prev.sections.length <= 1) {
        setError('At least one section is required');
        return prev;
      }
      
      const updatedSections = [...prev.sections];
      const removedSection = updatedSections[index];
      
      // If the section has an image URL, mark it for deletion
      if (typeof removedSection.image === 'string') {
        setImagesToDelete(prev => [...prev, removedSection.image]);
      }
      
      return { 
        ...prev, 
        sections: prev.sections.filter((_, i) => i !== index) 
      };
    });
  }, []);

  const handleSectionChange = useCallback((sectionIndex, field, value) => {
    setProductData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        [field]: value
      };
      return { ...prev, sections: updatedSections };
    });
  }, []);

  // Handle section image change with 16:9 validation
  const handleSectionImageChange = useCallback(async (sectionIndex, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      setError('Only image files are allowed!');
      customToast({ success: false, message: 'Only image files are allowed!' });
      return;
    }

    try {
      // Validate image dimensions (16:9)
      await validateImageDimensions(file);
      
      setProductData(prev => {
        const updatedSections = [...prev.sections];
        const section = updatedSections[sectionIndex];
        
        // If there's an existing image URL, mark it for deletion
        if (typeof section.image === 'string') {
          setImagesToDelete(prev => [...prev, section.image]);
        }
        
        // Create preview using FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductData(prevData => {
            const sections = [...prevData.sections];
            sections[sectionIndex] = {
              ...sections[sectionIndex],
              image: file,
              imagePreview: reader.result,
              useUploadedImage: true
            };
            return { ...prevData, sections };
          });
        };
        reader.readAsDataURL(file);
        
        return prev; // Return unchanged state, will be updated in reader.onloadend
      });
    } catch (err) {
      setError(err.message);
      customToast({ 
        success: false, 
        message: 'Image must have a 16:9 aspect ratio' 
      });
      e.target.value = '';
    }
  }, [customToast]);
  
  const moveSection = useCallback((fromIndex, toIndex) => {
    setProductData(prev => {
      const updatedSections = [...prev.sections];
      const [movedItem] = updatedSections.splice(fromIndex, 1);
      updatedSections.splice(toIndex, 0, movedItem);
      return { ...prev, sections: updatedSections };
    });
  }, []);

  // Point management
  const addPoint = useCallback((sectionIndex) => {
    setProductData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        points: [
          ...updatedSections[sectionIndex].points,
          { title: '', detail: '' }
        ]
      };
      return { ...prev, sections: updatedSections };
    });
  }, []);

  const removePoint = useCallback((sectionIndex, pointIndex) => {
    setProductData(prev => {
      const section = prev.sections[sectionIndex];
      
      if (section.points.length <= 1) {
        setError('At least one point is required in a section');
        return prev;
      }
      
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...section,
        points: section.points.filter((_, i) => i !== pointIndex)
      };
      
      return { ...prev, sections: updatedSections };
    });
  }, []);

  const handlePointChange = useCallback((sectionIndex, pointIndex, field, value) => {
    setProductData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        points: updatedSections[sectionIndex].points.map((point, idx) => 
          idx === pointIndex ? { ...point, [field]: value } : point
        )
      };
      return { ...prev, sections: updatedSections };
    });
  }, []);

  // Form validation including slug validation
  const validateForm = useCallback(() => {
    // Check main product fields
    if (!productData.Title || !productData.Title.trim()) {
      setError('Product title is required');
      return false;
    }
    
    if (!productData.detail || !productData.detail.trim()) {
      setError('Product detail is required');
      return false;
    }
    
    if (!productData.moreDetail || !productData.moreDetail.trim()) {
      setError('Product more detail is required');
      return false;
    }
    
    if (!productData.slug || !productData.slug.trim()) {
      setError('Slug is required');
      return false;
    }
    
    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productData.slug)) {
      setError('Slug must be lowercase, containing only letters, numbers, and hyphens');
      return false;
    }
    
    if (!productData.image) {
      setError('Main product image is required');
      return false;
    }
    
    if (!productData.category) {
      setError('Service is required');
      return false;
    }
    
    // Validate sections
    if (productData.sections.length === 0) {
      setError('At least one section is required');
      return false;
    }
    
    for (const [i, section] of productData.sections.entries()) {
      if (!section.title || !section.title.trim()) {
        setError(`Section ${i + 1} title is required`);
        return false;
      }
      
      if (!section.image && !section.imagePreview) {
        setError(`Image is required for section ${i + 1}`);
        return false;
      }
      
      // Validate points
      if (!section.points || section.points.length === 0) {
        setError(`At least one point is required for section ${i + 1}`);
        return false;
      }
      
      for (const [j, point] of section.points.entries()) {
        if (!point.title || !point.title.trim()) {
          setError(`Title is required for point ${j + 1} in section ${i + 1}`);
          return false;
        }
        
        if (!point.detail || !point.detail.trim()) {
          setError(`Detail is required for point ${j + 1} in section ${i + 1}`);
          return false;
        }
      }
    }
    
    setError('');
    return true;
  }, [productData]);

  // Cancel edit mode
  const cancelEdit = useCallback(() => {
    setEditingProduct(null);
    setMainImagePreview(null);
    setProductData({
      Title: '',
      detail: '',
      moreDetail: '',
      slug: '',
      category: '',
      image: null,
      sections: []
    });
    setImagesToDelete([]);
    setError('');
  }, []);

  // Save edited product
  const handleSave = useCallback(() => {
    const saveProduct = async () => {
      if (!validateForm()) {
        return;
      }
      
      setSaving(true);
      
      try {
        const formData = new FormData();
        formData.append('productId', editingProduct);
        
        // Add basic product fields
        formData.append('Title', productData.Title);
        formData.append('detail', productData.detail);
        formData.append('moreDetail', productData.moreDetail);
        formData.append('slug', productData.slug);
        formData.append('category', productData.category);
        
        // Add images to delete
        if (imagesToDelete.length > 0) {
          formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }
        
        // Add main image if it's a File object
        if (productData.image instanceof File) {
          formData.append('mainImage', productData.image);
        }
        
        // Prepare sections data
        const sectionsData = productData.sections.map(section => {
          // Determine image handling
          let sectionImage = section.image;
          const useUploadedImage = section.image instanceof File;
          
          return {
            title: section.title,
            image: useUploadedImage ? '' : section.image, // Empty string if we're uploading a new image
            useUploadedImage,
            points: section.points
          };
        });
        
        formData.append('sections', JSON.stringify(sectionsData));
        
        // Append all section images that are Files
        productData.sections.forEach((section, index) => {
          if (section.image instanceof File) {
            formData.append('sectionImages', section.image);
          }
        });
        
        // Submit the update
        const response = await axios.put('/api/product/edit', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        
        customToast({ success: true, message: 'Product updated successfully!' });
        
        // Refresh data and exit edit mode
        await fetchProductsAndServices();
        cancelEdit();
        
      } catch (error) {
        console.error('Error updating product:', error);
        customToast({ 
          success: false, 
          message: error.response?.data?.message || 'Failed to update product' 
        });
      } finally {
        setSaving(false);
      }
    };
    
    setShowConfirm('Are you sure you want to update this product?');
    setConfirmFunction(() => saveProduct);
  }, [editingProduct, productData, imagesToDelete, validateForm, cancelEdit, customToast, setShowConfirm, setConfirmFunction, fetchProductsAndServices]);

  return (
    <div className="w-full mx-auto">
      {/* List view */}
      {!editingProduct && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Products</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Parent Service
                </label>
                <div className="relative">
                  <select
                    value={selectedService}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] bg-white appearance-none"
                  >
                    <option value="">Select a Parent Service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.Title}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title or description"
                    className="flex-1 pl-4 pr-10 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                    disabled={!selectedService}
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={!selectedService}
                    className="bg-[#446E6D] hover:bg-[#375857] text-white px-4 rounded-r-lg transition-colors disabled:bg-[#446E6D]/50"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#446E6D]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
              <div className="flex items-start">
                <AlertCircle className="text-red-500 mr-3" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Filter size={18} className="mr-2 text-[#446E6D]" />
                Products ({filteredProducts.length})
              </h2>
              <div className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center py-4 px-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.Title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-lg">{product.Title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-1">{product.detail}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-[#446E6D]/10 text-[#446E6D] rounded-full px-2 py-0.5">
                          {product.sections?.length || 0} sections
                        </span>
                        {services.find(s => s._id === product.category) && (
                          <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 ml-2">
                            {services.find(s => s._id === product.category).Title}
                          </span>
                        )}
                        {product.slug && (
                          <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 ml-2 truncate max-w-[120px]">
                            {product.slug}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditClick(product)}
                      className="ml-4 bg-[#446E6D] hover:bg-[#375857] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                      <Pencil size={16} className="mr-2" />
                      Edit
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            selectedService && (
              <div className="bg-[#446E6D]/5 border-l-4 border-[#446E6D] p-4 rounded-r-lg">
                <div className="flex items-center">
                  <Info size={24} className="text-[#446E6D] mr-3" />
                  <p className="text-[#446E6D]">No products found for this service.</p>
                </div>
              </div>
            )
          )}
        </div>
      )}
      
      {/* Edit view */}
      {editingProduct && (
        <DndProvider backend={HTML5Backend}>
          <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm p-6 mb-6">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <button
                  onClick={cancelEdit}
                  className="flex items-center text-gray-600 hover:text-[#446E6D] transition-colors"
                >
                  <ChevronLeft size={20} className="mr-1" />
                  <span>Back to Products</span>
                </button>
                
                <h1 className="text-2xl font-bold text-center text-gray-800">Edit Product</h1>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    saving ? 'bg-[#446E6D]/70' : 'bg-[#446E6D] hover:bg-[#375857]'
                  } text-white transition-colors`}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 space-y-8">
              {/* Error display */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-500 mr-3" size={20} />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              {/* Main product info */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Basic Product Information
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column - Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Image* <span className="text-xs text-gray-500">(16:9 ratio required)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="mainImage"
                          name="mainImage"
                          type="file"
                          onChange={handleMainImageChange}
                          className="hidden"
                          accept="image/*"
                          ref={mainImageRef}
                        />
                        
                        {mainImagePreview ? (
                          <div className="relative rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={mainImagePreview}
                              alt="Product preview" 
                              className="w-full h-64 object-cover" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => mainImageRef.current?.click()}
                                className="bg-white rounded-full p-2 shadow-md"
                              >
                                <Upload size={18} className="text-gray-700" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => mainImageRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#446E6D] transition-colors"
                          >
                            <Upload size={36} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload product image (16:9)</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG or GIF (max 10MB)</p>
                          </div>
                        )}
                      </div>

                      {/* Service Selection */}
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Category*
                        </label>
                        <select
                          name="category"
                          value={productData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                        >
                          <option value="">Select a Service</option>
                          {services.map((service) => (
                            <option key={service._id} value={service._id}>
                              {service.Title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Right column - Text fields */}
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-1">
                          Product Title*
                        </label>
                        <input
                          id="Title"
                          name="Title"
                          type="text"
                          value={productData.Title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                          placeholder="Enter product title"
                        />
                      </div>
                      
                      {/* Slug field */}
                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                          Slug* <span className="text-xs text-gray-500">(URL-friendly name)</span>
                        </label>
                        <input
                          id="slug"
                          name="slug"
                          type="text"
                          value={productData.slug}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                          placeholder="product-name-example"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Only lowercase letters, numbers, and hyphens. Used in URLs: /product/{productData.slug || 'example-slug'}
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="detail" className="block text-sm font-medium text-gray-700 mb-1">
                          Short Description*
                        </label>
                        <textarea
                          id="detail"
                          name="detail"
                          value={productData.detail}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                          placeholder="Brief description of the product"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="moreDetail" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Description*
                        </label>
                        <textarea
                          id="moreDetail"
                          name="moreDetail"
                          value={productData.moreDetail}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                          placeholder="Detailed description of the product"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sections */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="bg-[#446E6D]/10 text-[#446E6D] w-8 h-8 rounded-full inline-flex items-center justify-center mr-2">
                      {productData.sections.length}
                    </span>
                    Product Sections
                  </h2>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addSection}
                    className="bg-[#446E6D] hover:bg-[#375857] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Section
                  </motion.button>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <AnimatePresence>
                      {productData.sections.map((section, sectionIndex) => (
                        <SectionItem
                          key={sectionIndex}
                          section={section}
                          index={sectionIndex}
                          handleSectionChange={handleSectionChange}
                          handleSectionImageChange={handleSectionImageChange}
                          handlePointChange={handlePointChange}
                          addPoint={addPoint}
                          removePoint={removePoint}
                          removeSection={removeSection}
                          moveSection={moveSection}
                          totalSections={productData.sections.length}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DndProvider>
      )}
    </div>
  );
}

// Section component with drag and drop
const SectionItem = React.memo(({
  section,
  index,
  handleSectionChange,
  handleSectionImageChange,
  handlePointChange,
  addPoint,
  removePoint,
  removeSection,
  moveSection,
  totalSections
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));
  
  const [, drop] = useDrop(() => ({
    accept: 'SECTION',
    hover: (item) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    }
  }));
  
  const sectionImageRef = useRef(null);
  
  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative rounded-xl ${
        isDragging ? 'border-2 border-[#446E6D] shadow-lg' : 'border border-gray-200'
      } bg-white shadow-sm overflow-hidden`}
      style={{ 
        opacity: isDragging ? 0.7 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Section Header */}
      <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="cursor-move mr-3 text-[#446E6D] hover:text-[#375857] transition-colors">
          <GripVertical size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Section {index + 1}
          {section.title && <span className="ml-2 text-sm text-gray-500">({section.title})</span>}
        </h3>
        <div className="ml-auto">
          {totalSections > 1 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeSection(index)}
              className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
            >
              <Trash2 size={18} />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Section Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <label htmlFor={`section-title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Section Title*
            </label>
            <input
              id={`section-title-${index}`}
              type="text"
              value={section.title}
              onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] shadow-sm"
              placeholder="Enter section title"
            />
          </div>
          
          {/* Right Column - Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Image* <span className="text-xs text-gray-500">(16:9 ratio required)</span>
            </label>
            <div className="relative">
              <input
                id={`section-image-${index}`}
                type="file"
                onChange={(e) => handleSectionImageChange(index, e)}
                className="hidden"
                accept="image/*"
                ref={sectionImageRef}
              />
              
              {!section.imagePreview && !section.image ? (
                <div 
                  onClick={() => sectionImageRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#446E6D] transition-colors"
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <ImageIcon className="text-gray-400 mb-2" size={32} />
                    <p className="text-sm font-medium text-gray-600">Click to upload section image (16:9)</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={section.imagePreview || section.image}
                    alt={`Section ${index + 1} preview`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => sectionImageRef.current?.click()}
                      className="bg-white rounded-full p-2 m-1 shadow-md"
                    >
                      <Upload size={16} className="text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleSectionChange(index, 'image', null);
                        handleSectionChange(index, 'imagePreview', null);
                        if (sectionImageRef.current) sectionImageRef.current.value = '';
                      }}
                      className="bg-white rounded-full p-2 m-1 shadow-md"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Points Section */}
        <div className="mt-8 border-t border-gray-100 pt-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-medium text-gray-700 flex items-center">
              <span className="bg-[#446E6D]/10 text-[#446E6D] w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">
                {section.points?.length || 0}
              </span>
              Key Points
            </h4>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addPoint(index)}
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#446E6D]/10 text-[#446E6D] hover:bg-[#446E6D]/20 transition-all duration-200"
            >
              <Plus size={16} className="mr-1" />
              Add Point
            </motion.button>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {section.points?.map((point, pointIndex) => (
                <motion.div
                  key={pointIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#446E6D]/30 transition-colors"
                >
                  <div>
                    <label htmlFor={`point-title-${index}-${pointIndex}`} className="block text-xs font-medium text-gray-700 mb-1">
                      Point Title*
                    </label>
                    <input
                      id={`point-title-${index}-${pointIndex}`}
                      type="text"
                      value={point.title}
                      onChange={(e) => handlePointChange(index, pointIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                      placeholder="Enter point title"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-center">
                      <label htmlFor={`point-detail-${index}-${pointIndex}`} className="block text-xs font-medium text-gray-700 mb-1">
                        Point Detail*
                      </label>
                      {(section.points?.length > 1) && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removePoint(index, pointIndex)}
                          className="p-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X size={14} />
                        </motion.button>
                      )}
                    </div>
                    <textarea
                      id={`point-detail-${index}-${pointIndex}`}
                      value={point.detail}
                      onChange={(e) => handlePointChange(index, pointIndex, 'detail', e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                      rows={2}
                      placeholder="Enter point detail"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Section Footer */}
      <div className="bg-[#446E6D]/5 p-3 text-xs text-[#446E6D] flex items-start">
        <Info size={14} className="mr-1.5 flex-shrink-0 mt-0.5" />
        <span>Drag to reorder. Each section requires a title, image (16:9 ratio) and at least one point.</span>
      </div>
    </motion.div>
  );
});

SectionItem.displayName = 'SectionItem';