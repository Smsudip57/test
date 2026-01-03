'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { MyContext } from '@/context/context';
import { fetchMultiple } from '@/lib/client-fetch';
import TextEditor from '@/components/shaerd/TextEditor';
import RelatedItemsSelector from '@/components/website/components/RelatedItemsSelector';
import ImageUploader from '@/components/website/components/ImageUploader';

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
          <ImageUploader
            aspectRatio="3:2"
            label="Featured Image"
            onImageChange={(file, preview) => {
              setFormData(prev => ({ ...prev, image: file }));
              setImagePreview(preview);
            }}
            initialPreview={imagePreview}
            acceptedFormats="PNG, JPG, WebP"
            maxSize={10}
            required={true}
            placeholder="Upload blog featured image"
          />

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
              // control={false}
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