"use client";
import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Save,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { MyContext } from "@/context/context";
import RelatedItemsSelector from "./components/RelatedItemsSelector";
import ImageUploader from "@/components/website/components/ImageUploader";

const CreateIndustry = () => {
  const [formData, setFormData] = useState({
    Title: "",
    Heading: "",
    detail: "",
    Efficiency: 0,
    costSaving: 0,
    customerSatisfaction: 0,
  });

  const [relatedItems, setRelatedItems] = useState({
    relatedServices: [],
    relatedSuccessStory: [],
    relatedProducts: [],
    relatedChikfdServices: [],
    relatedProjects: [],
  });

  const [imageUrl, setImageUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { customToast } = useContext(MyContext) || {
    customToast: (msg) => console.log(msg),
  };

  // Handle related items changes
  const handleRelatedItemsChange = (newRelatedItems) => {
    setRelatedItems(newRelatedItems);
  };

  const handleImageUpload = (url, preview) => {
    setImageUrl(url);
    setImagePreview(preview);
    setError(null);
  };

  const handleLogoUpload = (url, preview) => {
    setLogoUrl(url);
    setLogoPreview(preview);
    setError(null);
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

  const handleLogoRemove = () => {
    setLogoUrl(null);
    setLogoPreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (
      name === "Efficiency" ||
      name === "costSaving" ||
      name === "customerSatisfaction"
    ) {
      // Ensure value is between 0 and 100
      const numValue = Math.min(Math.max(0, Number(value)), 100);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.Title.trim()) {
      setError("Title is required");
      return false;
    }

    if (!formData.Heading.trim()) {
      setError("Heading is required");
      return false;
    }

    if (!formData.detail.trim()) {
      setError("Detail is required");
      return false;
    }

    if (!imageUrl) {
      setError("Industry image is required");
      return false;
    }

    if (!logoUrl) {
      setError("Industry logo is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      customToast({
        success: false,
        message: error,
      });
      return;
    }

    setLoading(true);
    setError(null);

    // Prepare JSON payload with image URLs
    const payload = {
      ...formData,
      image: imageUrl,
      logo: logoUrl,
    };

    // Add related items if any exist
    Object.keys(relatedItems).forEach((key) => {
      if (relatedItems[key] && relatedItems[key].length > 0) {
        payload[key] = relatedItems[key];
      }
    });

    try {
      const response = await axios.post("/api/industry/create", payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 201) {
        setSuccess(true);
        customToast({
          success: true,
          message: "Industry created successfully!",
        });

        // Reset form after successful submission
        setFormData({
          Title: "",
          Heading: "",
          detail: "",
          Efficiency: 0,
          costSaving: 0,
          customerSatisfaction: 0,
        });

        setRelatedItems({
          relatedServices: [],
          relatedSuccessStory: [],
          relatedProducts: [],
          relatedChikfdServices: [],
          relatedProjects: [],
        });

        handleImageRemove();
        handleLogoRemove();

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating industry:", error);
      setError(
        error.response?.data?.message ||
        "Failed to create industry. Please try again."
      );
      customToast({
        success: false,
        message: error.response?.data?.message || "Failed to create industry",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#446E6D]">
        Create New Industry
      </h2>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start">
          <CheckCircle2 className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">Industry created successfully!</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Column - Text Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="Title"
              value={formData.Title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
              placeholder="Enter industry title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading *
            </label>
            <input
              type="text"
              name="Heading"
              value={formData.Heading}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
              placeholder="Enter industry heading"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detail *
            </label>
            <textarea
              name="detail"
              value={formData.detail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
              rows="5"
              placeholder="Enter industry details"
              required
            ></textarea>
          </div>

          {/* Related Items Selector */}
          <RelatedItemsSelector
            relations={[
              "services",
              "testimonials",
              "products",
              "childServices",
              "projects",
            ]}
            value={relatedItems}
            onChange={handleRelatedItemsChange}
            disabled={loading}
            isMultiple={true}
          />
        </div>

        {/* Right Column - Images and Metrics */}
        <div className="space-y-6">
          {/* Image Upload Component */}
          <ImageUploader
            method="url"
            mediaType="image"
            onImageChange={handleImageUpload}
            onImageRemove={handleImageRemove}
            preview={imagePreview}
            label="Industry Image *"
            maxSize={10}
            aspectRatio={null}
          />

          {/* Logo Upload Component */}
          <ImageUploader
            method="url"
            mediaType="image"
            onImageChange={handleLogoUpload}
            onImageRemove={handleLogoRemove}
            preview={logoPreview}
            label="Industry Logo *"
            maxSize={10}
            aspectRatio={null}
          />

          {/* Metrics Inputs */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Efficiency ({formData.Efficiency}%)
              </label>
              <input
                type="range"
                name="Efficiency"
                min="0"
                max="100"
                value={formData.Efficiency}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#446E6D]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Saving ({formData.costSaving}%)
              </label>
              <input
                type="range"
                name="costSaving"
                min="0"
                max="100"
                value={formData.costSaving}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#446E6D]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Satisfaction ({formData.customerSatisfaction}%)
              </label>
              <input
                type="range"
                name="customerSatisfaction"
                min="0"
                max="100"
                value={formData.customerSatisfaction}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#446E6D]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button - Full Width */}
        <div className="col-span-1 md:col-span-2 mt-6">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${loading
              ? "bg-[#446E6D]/70 cursor-not-allowed"
              : "bg-[#446E6D] hover:bg-[#375857] transition-colors"
              } shadow-md flex items-center justify-center`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Creating Industry...
              </>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                Create Industry
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default CreateIndustry;
