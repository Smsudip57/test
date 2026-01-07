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

const CreateTestimonial = () => {
  const [formData, setFormData] = useState({
    Testimonial: "",
    video: null,
    image: null,
    postedBy: "",
    role: "",
    relatedServices: [],
    relatedIndustries: [],
    relatedProducts: [],
    relatedChikfdServices: [],
  });

  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState("");
  const { customToast } = useContext(MyContext);

  // Validate image dimensions (1:1 aspect ratio with 0.1% tolerance)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const width = this.width;
          const height = this.height;
          const aspectRatio = width / height;
          const targetRatio = 1 / 1;
          const tolerance = 0.1; // 0.1% tolerance

          if (Math.abs(aspectRatio - targetRatio) <= tolerance) {
            resolve({ width, height, aspectRatio });
          } else {
            reject({
              message: `Image must have a 1:1 aspect ratio. Current ratio is ${aspectRatio.toFixed(
                2
              )}:1`,
              dimensions: { width, height, aspectRatio },
            });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    // Image dimension validation happens at upload time
  }, []);

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
    const { name } = e.target;

    if (!file) return;

    // Check file type
    if (name === "image") {
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        customToast({
          success: false,
          message: "Only image files are allowed!",
        });
        e.target.value = "";
        return;
      }

      try {
        // Validate image dimensions (1:1)
        await validateImageDimensions(file);

        // If previous preview exists, revoke its URL
        if (imagePreview) URL.revokeObjectURL(imagePreview);

        setImagePreview(URL.createObjectURL(file));
        setFormData((prev) => ({ ...prev, [name]: file }));
      } catch (err) {
        console.error("Image validation error:", err);
        customToast({
          success: false,
          message: `Image must have a 1:1 aspect ratio. Current ratio is ${err.dimensions?.aspectRatio.toFixed(
            2
          )}:1`,
        });
        e.target.value = "";
        return;
      }
    } else if (name === "video") {
      if (!file.type.match(/video\/(mp4|webm|ogg|quicktime)/i)) {
        customToast({
          success: false,
          message: "Only video files are allowed!",
        });
        e.target.value = "";
        return;
      }

      // If previous preview exists, revoke its URL
      if (videoPreview) URL.revokeObjectURL(videoPreview);

      setVideoPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  const clearFilePreview = (fieldName) => {
    if (fieldName === "image") {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, image: null }));
    } else if (fieldName === "video") {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
      setFormData((prev) => ({ ...prev, video: null }));
    }
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
      !formData.image ||
      !formData.video
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

    const data = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (
        key === "relatedServices" ||
        key === "relatedIndustries" ||
        key === "relatedProducts" ||
        key === "relatedChikfdServices"
      ) {
        // Append array fields as JSON strings
        data.append(key, JSON.stringify(formData[key]));
      } else if (formData[key]) {
        // Only append if value exists
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("/api/testimonial/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      if (response.status === 201) {
        // Reset form and show success message
        setMessage("Testimonial created successfully!");
        setProgress(0);
        setImagePreview(null);
        setVideoPreview(null);
        setFormData({
          Testimonial: "",
          video: null,
          image: null,
          postedBy: "",
          role: "",
          relatedServices: [],
          relatedIndustries: [],
          relatedProducts: [],
          relatedChikfdServices: [],
        });

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
      setProgress(0);
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
          {/* Image Upload with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Image*{" "}
              <span className="text-xs text-gray-500">
                (1:1 ratio required)
              </span>
            </label>
            <div className="relative border-2 border-dashed border-[#446E6D]/30 rounded-lg p-4 text-center hover:bg-[#446E6D]/5 transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => clearFilePreview("image")}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:bg-red-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-[#446E6D]" />
                  <p className="mt-2 text-sm font-medium text-[#446E6D]">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB (1:1 ratio required)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Video Upload with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Video*
            </label>
            <div className="relative border-2 border-dashed border-[#446E6D]/30 rounded-lg p-4 text-center hover:bg-[#446E6D]/5 transition-colors">
              {videoPreview ? (
                <div className="relative">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => clearFilePreview("video")}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:bg-red-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                  <Video className="h-12 w-12 text-[#446E6D]" />
                  <p className="mt-2 text-sm font-medium text-[#446E6D]">
                    Click to upload a video
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM up to 50MB
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    name="video"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
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
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                loading
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
