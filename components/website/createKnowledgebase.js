"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
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
import RelatedItemsSelector from "./RelatedItemsSelector";
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  // Validate image aspect ratio (16:7)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const targetAspectRatio = 16 / 7;
      const tolerance = 0.1; // Allow some tolerance in aspect ratio

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        URL.revokeObjectURL(img.src); // Clean up object URL

        if (Math.abs(aspectRatio - targetAspectRatio) > tolerance) {
          reject({
            message: `Image should have a 16:7 aspect ratio. Current ratio is ${img.width}x${img.height} (${aspectRatio.toFixed(2)}:1).`,
            dimensions: { width: img.width, height: img.height, aspectRatio },
          });
        } else {
          resolve({ width: img.width, height: img.height, aspectRatio });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject({
          message: "Failed to load image. Please select a valid image file.",
        });
      };

      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
    });
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      customToast({
        success: false,
        message: "Please select only image files"
      });
      e.target.value = "";
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      customToast({
        success: false,
        message: `File ${file.name} is too large. Maximum size is 10MB.`
      });
      e.target.value = "";
      return;
    }

    // Validate image dimensions (16:7 aspect ratio)
    try {
      await validateImageDimensions(file);
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

    } catch (dimensionError) {
      console.error(`Dimension validation failed:`, dimensionError);
      customToast({
        success: false,
        message: `Image must have a 16:7 aspect ratio. Current ratio is ${dimensionError.dimensions?.width
          }x${dimensionError.dimensions?.height} (${dimensionError.dimensions?.aspectRatio.toFixed(2)
          }:1)`
      });
      e.target.value = "";
    }
  };

  // Remove image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
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
    if (!imageFile) {
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
      // Create FormData object to handle file upload
      const formDataToSubmit = new FormData();

      // Append image file
      formDataToSubmit.append("Image", imageFile);

      // Append other form fields
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("introduction", formData.introduction);
      formDataToSubmit.append("contents", formData.contents);
      formDataToSubmit.append("tags", JSON.stringify(formData.tags));
      formDataToSubmit.append("relatedServices", JSON.stringify(formData.relatedServices));
      formDataToSubmit.append("relatedIndustries", JSON.stringify(formData.relatedIndustries));
      formDataToSubmit.append("relatedProducts", JSON.stringify(formData.relatedProducts));
      formDataToSubmit.append("relatedChikfdServices", JSON.stringify(formData.relatedChikfdServices));
      formDataToSubmit.append("status", formData.status);

      const response = await axios.post(
        "/api/knowledgebase/create",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
        setImageFile(null);
        setImagePreview(null);
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
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
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Featured Image <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-gray-500 ml-2">(16:7 aspect ratio required)</span>
              </label>

              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {!imagePreview ? (
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-500 mb-1">Click to upload an image</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB (16:7 aspect ratio required)</p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Featured image preview"
                    className="w-full h-auto object-cover max-h-[300px]"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

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