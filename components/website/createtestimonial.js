"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Loader2,
  UploadCloud,
  X,
  Video,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { MyContext } from "@/context/context";
import RelatedItemsSelector from "@/components/website/components/RelatedItemsSelector";
import ImageUploader from "@/components/website/components/ImageUploader";

const CreateTestimonial = () => {
  const [formData, setFormData] = useState({
    Testimonial: "",
    postedBy: "",
    role: "",
    relatedServices: [],
    relatedIndustries: [],
    relatedProducts: [],
    relatedChikfdServices: [],
  });

  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState("");
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

  const handleImageUpload = (fileUrl, preview) => {
    setImageUrl(fileUrl);
    setImagePreview(preview);
    setError("");
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

  const handleVideoUpload = (videoUrl, preview) => {
    setVideoUrl(videoUrl);
    setVideoPreview(preview);
    setError("");
  };

  const handleVideoRemove = () => {
    setVideoUrl(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (
      !formData.Testimonial ||
      !formData.postedBy ||
      !formData.role ||
      !imageUrl ||
      !videoUrl
    ) {
      setError("Please fill all required fields!");
      customToast({
        success: false,
        message: "Please fill all required fields!",
      });
      setLoading(false);
      return;
    }

    // Validate at least one relationship is selected
    const totalRelations =
      (formData.relatedServices?.length || 0) +
      (formData.relatedIndustries?.length || 0) +
      (formData.relatedProducts?.length || 0) +
      (formData.relatedChikfdServices?.length || 0);

    if (totalRelations === 0) {
      setError("Please select at least one relationship!");
      customToast({
        success: false,
        message: "Please select at least one relationship!",
      });
      setLoading(false);
      return;
    }

    // Prepare JSON payload with image and video URLs
    const payload = {
      Testimonial: formData.Testimonial,
      postedBy: formData.postedBy,
      role: formData.role,
      image: imageUrl,
      video: videoUrl,
      relatedServices: formData.relatedServices,
      relatedIndustries: formData.relatedIndustries,
      relatedProducts: formData.relatedProducts,
      relatedChikfdServices: formData.relatedChikfdServices,
    };

    try {
      const response = await axios.post("/api/testimonial/create", payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 201) {
        // Reset form and show success message
        setMessage("Testimonial created successfully!");
        setProgress(0);
        setImagePreview(null);
        setVideoPreview(null);
        setFormData({
          Testimonial: "",
          postedBy: "",
          role: "",
          relatedServices: [],
          relatedIndustries: [],
          relatedProducts: [],
          relatedChikfdServices: [],
        });
        setImageUrl(null);
        setVideoUrl(null);

        customToast(response.data);
      }
    } catch (error) {
      console.error("Error creating testimonial:", error);
      setError(error.response?.data?.message || "Failed to create testimonial");
      customToast(
        error.response?.data || {
          success: false,
          message: "Failed to create testimonial",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg border">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#446E6D]">
        Create Testimonial
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-white text-lg font-semibold mt-2">
            {progress}% Uploaded
          </p>
        </div>
      )}

      <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Media Uploads */}
        <div className="space-y-6">
          {/* Image Upload Component */}
          <ImageUploader
            method="url"
            mediaType="image"
            onImageChange={handleImageUpload}
            onImageRemove={handleImageRemove}
            preview={imagePreview}
            label="Testimonial Image* (1:1 ratio required)"
            maxSize={10}
            aspectRatio="1:1"
          />

          {/* Video Upload Component */}
          <ImageUploader
            method="url"
            mediaType="video"
            onImageChange={handleVideoUpload}
            onImageRemove={handleVideoRemove}
            preview={videoPreview}
            label="Testimonial Video*"
            maxSize={50}
            aspectRatio={null}
          />
        </div>

        {/* Right Column - Text Fields */}
        <div className="space-y-6">
          {/* Testimonial Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Text*
            </label>
            <textarea
              name="Testimonial"
              value={formData.Testimonial}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
              rows="4"
              placeholder="Enter the testimonial content..."
            />
          </div>

          {/* Author Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posted By*
              </label>
              <input
                type="text"
                name="postedBy"
                value={formData.postedBy}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                placeholder="Author's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role*
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                placeholder="Author's position or role"
              />
            </div>
          </div>

          {/* Related Entities */}
          <RelatedItemsSelector
            relations={["services", "industries", "products", "childServices"]}
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

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${loading
                ? "bg-[#446E6D]/70 cursor-not-allowed"
                : "bg-[#446E6D] hover:bg-[#375857] transition-colors"
                } shadow-md`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Creating...
                </span>
              ) : (
                "Create Testimonial"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTestimonial;
