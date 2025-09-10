"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";


const ImageUploader = ({
  aspectRatio = "16:9",
  onImageChange,
  initialPreview = null,
  label = "Upload Image",
  placeholder = null,
  acceptedFormats = "PNG, JPG or GIF",
  maxSize = 10,
  height = null,
  required = false,
  className = "",
  disabled = false,
  onError = null,
}) => {
  const [imagePreview, setImagePreview] = useState(initialPreview);
  const [error, setError] = useState("");
  const imageRef = useRef(null);

  // Parse aspect ratio
  const parseAspectRatio = useCallback((ratio) => {
    const [width, height] = ratio.split(":").map(Number);
    return { width, height, decimal: width / height };
  }, []);

  const { width: ratioWidth, height: ratioHeight, decimal: ratioDecimal } = parseAspectRatio(aspectRatio);

  // Get default height based on aspect ratio
  const getDefaultHeight = useCallback(() => {
    if (height) return height;

    // Provide sensible defaults for common aspect ratios
    switch (aspectRatio) {
      case "1:1":
        return "h-64";
      case "4:3":
        return "h-60";
      case "3:4":
        return "h-80";
      case "16:9":
        return "h-72";
      case "9:16":
        return "h-96";
      default:
        return "h-72";
    }
  }, [aspectRatio, height]);

  // Validate image dimensions based on aspect ratio
  const validateImageDimensions = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const width = this.width;
          const height = this.height;
          const imageAspectRatio = width / height;
          const tolerance = 0.10;   

          if (Math.abs(imageAspectRatio - ratioDecimal) <= tolerance) {
            resolve({ width, height, aspectRatio: imageAspectRatio });
          } else {
            reject({
              message: `Image must have a ${aspectRatio} aspect ratio. Current ratio is ${imageAspectRatio.toFixed(2)}:1`,
              dimensions: { width, height, aspectRatio: imageAspectRatio },
            });
          }
        };
        img.onerror = () => reject({ message: "Invalid image file" });
        img.src = e.target.result;
      };
      reader.onerror = () => reject({ message: "Failed to read file" });
      reader.readAsDataURL(file);
    });
  }, [aspectRatio, ratioDecimal]);

  // Handle image upload
  const handleImageChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset previous errors
      setError("");
      if (onError) onError("");

      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
        const errorMsg = "Only image files are allowed!";
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        const errorMsg = `File size must be less than ${maxSize}MB`;
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      try {
        // Validate image dimensions
        await validateImageDimensions(file);

        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const preview = reader.result;
          setImagePreview(preview);

          // Call parent callback with file and preview
          if (onImageChange) {
            onImageChange(file, preview);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        const errorMsg = err.message || "Invalid image dimensions";
        setError(errorMsg);
        if (onError) onError(errorMsg);
        // Clear the file input
        if (imageRef.current) {
          imageRef.current.value = "";
        }
      }
    },
    [maxSize, validateImageDimensions, onImageChange, onError]
  );

  // Handle image removal
  const handleImageRemove = useCallback(() => {
    setImagePreview(null);
    setError("");
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    if (onImageChange) {
      onImageChange(null, null);
    }
    if (onError) onError("");
  }, [onImageChange, onError]);

  // Generate placeholder text
  const getPlaceholderText = useCallback(() => {
    if (placeholder) return placeholder;
    return `Upload ${label.toLowerCase()} (${aspectRatio})`;
  }, [placeholder, label, aspectRatio]);

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          <span className="text-xs text-gray-500 ml-1">
            ({aspectRatio} ratio required)
          </span>
        </label>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
        ref={imageRef}
        disabled={disabled}
      />

      {/* Upload Area */}
      <div className="relative">
        {!imagePreview ? (
          <motion.div
            onClick={() => !disabled && imageRef.current?.click()}
            whileHover={!disabled ? { scale: 1.01 } : {}}
            whileTap={!disabled ? { scale: 0.99 } : {}}
            className={`
              flex flex-col items-center justify-center w-full ${getDefaultHeight()}
              border-2 border-dashed rounded-xl transition-all duration-200
              ${disabled
                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                : "border-[#446E6D]/30 bg-[#446E6D]/5 hover:bg-[#446E6D]/10 cursor-pointer"
              }
            `}
          >
            <div className="flex flex-col items-center justify-center py-8">
              <Upload
                className={`mb-3 ${disabled ? "text-gray-400" : "text-[#446E6D]"}`}
                size={48}
              />
              <p className={`text-base font-medium mb-1 ${disabled ? "text-gray-400" : "text-[#446E6D]"
                }`}>
                {getPlaceholderText()}
              </p>
              <p className="text-sm text-gray-500">
                {acceptedFormats} (Max {maxSize}MB)
              </p>
            </div>
          </motion.div>
        ) : (
          <div className={`relative w-full ${getDefaultHeight()} rounded-xl overflow-hidden shadow-sm border border-gray-200`}>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <motion.button
                type="button"
                onClick={handleImageRemove}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 shadow-md transition-all"
              >
                <X size={20} />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200"
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-2 text-xs text-gray-500">
          Aspect ratio: {ratioWidth}:{ratioHeight} • Max size: {maxSize}MB • Formats: {acceptedFormats}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
