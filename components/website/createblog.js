'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { MyContext } from '@/context/context';
import { fetchMultiple } from '@/lib/client-fetch';
import TextEditor from '@/components/shaerd/TextEditor';
import RelatedItemsSelector from '@/components/website/RelatedItemsSelector';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    description: "",
    title: "",
    type: "",
    image: null,
    contents: "",
    relatedServices: [],
    relatedIndustries: [],
    relatedProducts: [],
    relatedChikfdServices: [],
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { customToast } = useContext(MyContext);

  // Function to validate image dimensions (16:7 aspect ratio with 5% tolerance)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const aspectRatio = width / height;
          const targetRatio = 16 / 7;
          const tolerance = 0.05; // 5% tolerance

          if (Math.abs(aspectRatio - targetRatio) <= tolerance) {
            resolve({ width, height, aspectRatio });
          } else {
            reject({
              message: `Image must have a 16:7 aspect ratio. Current ratio is ${aspectRatio.toFixed(2)}:1`,
              dimensions: { width, height, aspectRatio }
            });
          }
        };
        img.onerror = () => {
          reject({ message: "Failed to load image. Please select a valid image file." });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRelatedItemsChange = (relatedItems) => {
    setFormData((prev) => ({
      ...prev,
      relatedServices: relatedItems.relatedServices || [],
      relatedIndustries: relatedItems.relatedIndustries || [],
      relatedProducts: relatedItems.relatedProducts || [],
      relatedChikfdServices: relatedItems.relatedChikfdServices || [],
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate image dimensions (16:7 aspect ratio with 5% tolerance)
      await validateImageDimensions(file);

      // If validation passes, set the image preview and update formData
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: file }));
    } catch (error) {
      console.error("Image validation failed:", error);
      customToast({
        success: false,
        message: error.message || "Image must have a 16:7 aspect ratio"
      });
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description || !formData.type || !formData.image || !formData.contents) {
      customToast({ success: false, message: 'Please fill all required fields!' });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      // Append regular fields
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('contents', formData.contents);
      data.append('type', formData.type);
      data.append('image', formData.image);

      // Send related items as JSON strings for consistent backend parsing
      data.append('relatedServices', JSON.stringify(formData.relatedServices || []));
      data.append('relatedIndustries', JSON.stringify(formData.relatedIndustries || []));
      data.append('relatedProducts', JSON.stringify(formData.relatedProducts || []));
      data.append('relatedChikfdServices', JSON.stringify(formData.relatedChikfdServices || []));

      const response = await axios.post('/api/blog/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.status === 201) {
        customToast(response.data);
        setFormData({
          description: "",
          title: "",
          type: "",
          image: null,
          contents: "",
          relatedServices: [],
          relatedIndustries: [],
          relatedProducts: [],
          relatedChikfdServices: [],
        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      customToast(error.response?.data || { success: false, message: 'Failed to create blog' });
    }
    setLoading(false);
  };

  return (
    <div className="w-full mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create Blog Post</h1>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex flex-col items-center">
              <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Creating Blog...</h3>
              <p className="text-gray-500">
                Please wait while we create your blog post.
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
      >
        {/* Image Upload Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center min-h-[300px] relative">
            {imagePreview ? (
              <div className="relative w-full h-full flex justify-center">
                <img
                  src={imagePreview}
                  alt="Blog preview"
                  className="object-contain max-h-[250px] rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, image: null }));
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud size={50} className="text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2 text-center">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-gray-400 text-sm mb-4 text-center">
                  Recommended size: 16:7 aspect ratio (required)
                </p>
                <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4">Blog Details</h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Blog Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter blog category"
                required
              />
            </div>

            {/* Related Items Selector */}
            <RelatedItemsSelector
              relations={['services', 'industries', 'products', 'childServices']}
              value={{
                relatedServices: formData.relatedServices,
                relatedIndustries: formData.relatedIndustries,
                relatedProducts: formData.relatedProducts,
                relatedChikfdServices: formData.relatedChikfdServices,
              }}
              onChange={handleRelatedItemsChange}
              disabled={loading}
              isMultiple={true}
            />
          </div>
        </div>

        {/* Main Content Section */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter blog description"
              rows="5"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <TextEditor
              name="contents"
              label="Blog Contents *"
              value={formData.contents}
              onChange={(value) => setFormData(prev => ({ ...prev, contents: value }))}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Blog"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;