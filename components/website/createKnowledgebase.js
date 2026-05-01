"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Loader2,
  Save,
  Tag,
  Book,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
} from "lucide-react";
import { MyContext } from "@/context/context";
import { toast } from "react-toastify";
import RelatedItemsSelector from "./components/RelatedItemsSelector";
import ImageUploader from "@/components/website/components/ImageUploader";
import dynamic from "next/dynamic";

// Dynamically import TextEditor to avoid SSR issues
const TextEditor = dynamic(() => import("../shaerd/TextEditor"), { ssr: false });

export default function CreateKnowledgebase() {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    introduction: "",
    contents: "",
    tags: [],
    relatedServices: [],
    relatedIndustries: [],
    relatedProducts: [],
    relatedChikfdServices: [],
    status: "draft",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { customToast } = useContext(MyContext);
  const [tagError, setTagError] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image upload from ImageUploader
  const handleImageUpload = (url, preview) => {
    setImageUrl(url);
    setImagePreview(preview);
  };

  // Handle image removal
  const handleImageRemove = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle contents change from TextEditor
  const handleContentsChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      contents: value,
    }));
  };

  // Handle related items changes from RelatedItemsSelector
  const handleRelatedItemsChange = (relatedItemsData) => {
    setFormData(prev => ({
      ...prev,
      ...relatedItemsData
    }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim();

    if (trimmedTag) {
      if (formData.tags.includes(trimmedTag)) {
        setTagError("This tag already exists!");
        // Clear error after 3 seconds
        setTimeout(() => setTagError(""), 3000);
      } else {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, trimmedTag],
        }));
        setTagInput("");
        setTagError(""); // Clear any existing error
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    if (!imageUrl) {
      customToast({
        success: false,
        message: "Featured image is required"
      });
      return false;
    }

    if (!formData.title.trim()) {
      customToast({
        success: false,
        message: "Title is required"
      });
      return false;
    }

    if (!formData.introduction.trim()) {
      customToast({
        success: false,
        message: "Introduction is required"
      });
      return false;
    }

    if (!formData.contents.trim()) {
      customToast({
        success: false,
        message: "Contents is required"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create JSON payload
      const payload = {
        Image: imageUrl,
        title: formData.title,
        introduction: formData.introduction,
        contents: formData.contents,
        tags: formData.tags,
        relatedServices: formData.relatedServices,
        relatedIndustries: formData.relatedIndustries,
        relatedProducts: formData.relatedProducts,
        relatedChikfdServices: formData.relatedChikfdServices,
        status: formData.status,
      };

      const response = await axios.post(
        "/api/knowledgebase/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        customToast({
          success: true,
          message: "Knowledge base article created successfully"
        });

        // Reset form
        setFormData({
          title: "",
          introduction: "",
          contents: "",
          tags: [],
          relatedServices: [],
          relatedIndustries: [],
          relatedProducts: [],
          relatedChikfdServices: [],
          status: "draft",
        });
        setTagInput("");
        setTagError("");
        setImageUrl(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error creating article:", error);
      customToast({
        success: false,
        message: error.response?.data?.message || "Failed to create article"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mb-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Knowledge Base Article
        </h1>
        <p className="text-gray-600">
          Share your expertise with comprehensive documentation
        </p>
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
          <p className="text-white font-medium">Creating article...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload and Details */}
          <div className="space-y-6">
            {/* Featured Image */}
            <ImageUploader
              method="url"
              mediaType="image"
              onImageChange={handleImageUpload}
              onImageRemove={handleImageRemove}
              preview={imagePreview}
              label="Featured Image* (16:7 aspect ratio required)"
              maxSize={10}
              aspectRatio="16:7"
            />

            {/* Tags */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.tags.length === 0 && (
                  <span className="text-gray-400 text-sm">No tags added yet</span>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {tagError && (
                  <p className="text-red-500 text-sm animate-fade-in">{tagError}</p>
                )}
              </div>
            </div>

            {/* Related Items Section */}
            <RelatedItemsSelector
              relations={['services', 'industries', 'childServices', 'products']}
              value={{
                relatedServices: formData.relatedServices,
                relatedIndustries: formData.relatedIndustries,
                relatedChikfdServices: formData.relatedChikfdServices,
                relatedProducts: formData.relatedProducts
              }}
              onChange={handleRelatedItemsChange}
              disabled={loading}
              isMultiple={true}
            />

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter article title"
                required
              />
            </div>

            {/* Introduction */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Introduction <span className="text-red-500">*</span>
              </label>
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Write an introduction for your article"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                A brief introduction that will appear at the beginning of your article.
              </p>
            </div>

            {/* Contents */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contents <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-md">
                <TextEditor
                  name="contents"
                  value={formData.contents}
                  onChange={handleContentsChange}
                  className="min-h-[400px]"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Write your comprehensive knowledge base article content using the rich text editor.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Create Article</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}