"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, Loader } from "lucide-react";
import { useUploadFileMutation, useGetPresignedUrlMutation } from "@/redux/api/fileApi";

const ImageUploader = ({
  method = "file",
  aspectRatio = "16:9",
  onImageChange,
  initialPreview = null,
  label = "Upload Image",
  placeholder = null,
  maxSize = 10,
  height = null,
  required = false,
  className = "",
  disabled = false,
  onError = null,
  mediaType = "image", // "image" | "video" | "both"
}) => {
  const [imagePreview, setImagePreview] = useState(initialPreview);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileType, setFileType] = useState(null); // "image" | "video"
  const imageRef = useRef(null);
  const [uploadFile] = useUploadFileMutation();
  const [getPresignedUrl] = useGetPresignedUrlMutation();

  const parseAspectRatio = useCallback((ratio) => {
    if (!ratio) return { width: 0, height: 0, decimal: 1 };
    const [w, h] = ratio.split(":").map(Number);
    return { width: w, height: h, decimal: w / h };
  }, []);

  const { width: ratioWidth, height: ratioHeight, decimal: ratioDecimal } = parseAspectRatio(aspectRatio);

  const getDefaultHeight = useCallback(() => {
    if (height) return height;
    const heights = { "1:1": "h-64", "4:3": "h-60", "3:4": "h-80", "16:9": "h-72", "9:16": "h-96" };
    return heights[aspectRatio] || "h-72";
  }, [aspectRatio, height]);

  const validateMediaDimensions = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const isImage = file.type.match(/image\//i);
      const isVideo = file.type.match(/video\//i);

      if (!isImage && !isVideo) {
        reject({ message: "Invalid file type" });
        return;
      }

      setFileType(isImage ? "image" : "video");

      if (!aspectRatio) {
        resolve({ width: 0, height: 0, aspectRatio: 0 });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (isImage) {
          const img = new Image();
          img.onload = () => {
            const { width, height } = img;
            const imgRatio = width / height;
            const tolerance = 0.1;

            if (Math.abs(imgRatio - ratioDecimal) <= tolerance) {
              resolve({ width, height, aspectRatio: imgRatio });
            } else {
              reject({
                message: `Media must have ${aspectRatio} ratio. Current: ${imgRatio.toFixed(2)}:1`,
                dimensions: { width, height, aspectRatio: imgRatio },
              });
            }
          };
          img.onerror = () => reject({ message: "Invalid image file" });
          img.src = e.target.result;
        } else if (isVideo) {
          const video = document.createElement("video");
          video.onloadedmetadata = () => {
            const { videoWidth, videoHeight } = video;
            const videoRatio = videoWidth / videoHeight;
            const tolerance = 0.1;

            if (Math.abs(videoRatio - ratioDecimal) <= tolerance) {
              resolve({ width: videoWidth, height: videoHeight, aspectRatio: videoRatio });
            } else {
              reject({
                message: `Video must have ${aspectRatio} ratio. Current: ${videoRatio.toFixed(2)}:1`,
                dimensions: { width: videoWidth, height: videoHeight, aspectRatio: videoRatio },
              });
            }
          };
          video.onerror = () => reject({ message: "Invalid video file" });
          video.src = e.target.result;
        }
      };
      reader.onerror = () => reject({ message: "Failed to read file" });
      reader.readAsDataURL(file);
    });
  }, [aspectRatio, ratioDecimal]);

  const handleImageChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError("");
      if (onError) onError("");

      const isImage = file.type.match(/image\//i);
      const isVideo = file.type.match(/video\//i);

      if (!isImage && !isVideo) {
        const msg = "Only image and video files are allowed!";
        setError(msg);
        if (onError) onError(msg);
        return;
      }

      if (mediaType === "image" && !isImage) {
        const msg = "Only image files are allowed!";
        setError(msg);
        if (onError) onError(msg);
        return;
      }

      if (mediaType === "video" && !isVideo) {
        const msg = "Only video files are allowed!";
        setError(msg);
        if (onError) onError(msg);
        return;
      }

      if (file.size > maxSize * 1024 * 1024) {
        const msg = `File size must be less than ${maxSize}MB`;
        setError(msg);
        if (onError) onError(msg);
        return;
      }

      try {
        await validateMediaDimensions(file);

        const reader = new FileReader();
        reader.onloadend = async () => {
          const preview = reader.result;
          setImagePreview(preview);

          if (method === "url") {
            setUploading(true);
            try {
              // For videos, use presigned URL upload directly to R2
              if (isVideo) {
                // Step 1: Get presigned URL from backend
                const presignedData = await getPresignedUrl({
                  filename: file.name,
                  contentType: file.type,
                  expiresIn: 3600, // 1 hour expiration
                }).unwrap();

                // Step 2: Upload directly to R2 using presigned URL
                const uploadResponse = await fetch(presignedData.presignedUrl, {
                  method: "PUT",
                  body: file,
                  headers: {
                    "Content-Type": file.type,
                  },
                });

                if (!uploadResponse.ok) {
                  throw new Error(`Upload failed: ${uploadResponse.statusText}`);
                }

                // Step 3: Return the final R2 URL (no junk file needed)
                if (onImageChange) onImageChange(presignedData.finalUrl, preview);
                setUploading(false);
              } else {
                // For images, use traditional junk URL upload
                const formData = new FormData();
                formData.append("file", file);
                const result = await uploadFile(formData).unwrap();
                if (onImageChange) onImageChange(result.url, preview);
                setUploading(false);
              }
            } catch (uploadErr) {
              const msg = uploadErr?.data?.error || uploadErr?.message || "Failed to upload file";
              setError(msg);
              if (onError) onError(msg);
              setUploading(false);
              setImagePreview(null);
              setFileType(null);
              if (imageRef.current) imageRef.current.value = "";
            }
          } else if (method === "file") {
            if (onImageChange) onImageChange(file, preview);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        const msg = err.message || "Invalid file";
        setError(msg);
        if (onError) onError(msg);
        if (imageRef.current) imageRef.current.value = "";
      }
    },
    [maxSize, validateMediaDimensions, onImageChange, onError, method, uploadFile, getPresignedUrl, mediaType]
  );

  const handleImageRemove = useCallback(() => {
    setImagePreview(null);
    setFileType(null);
    setError("");
    if (imageRef.current) imageRef.current.value = "";
    if (onImageChange) onImageChange(null, null);
    if (onError) onError("");
  }, [onImageChange, onError]);

  const getPlaceholderText = useCallback(() => {
    if (placeholder) return placeholder;
    const ratio = aspectRatio ? ` (${aspectRatio})` : "";
    const safeLabel = typeof label === "string" && label.trim() ? label.toLowerCase() : "image";
    return `Upload ${safeLabel}${ratio}`;
  }, [placeholder, label, aspectRatio]);

  const getAcceptedTypes = useCallback(() => {
    if (mediaType === "video") return "video/*";
    if (mediaType === "image") return "image/*";
    return "image/*,video/*";
  }, [mediaType]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {aspectRatio && <span className="text-xs text-gray-500 ml-1">({aspectRatio} ratio)</span>}
        </label>
      )}

      <input
        type="file"
        onChange={handleImageChange}
        className="hidden"
        accept={getAcceptedTypes()}
        ref={imageRef}
        disabled={disabled}
      />

      <div className="relative">
        {!imagePreview ? (
          <motion.div
            onClick={() => !disabled && !uploading && imageRef.current?.click()}
            whileHover={!disabled && !uploading ? { scale: 1.01 } : {}}
            whileTap={!disabled && !uploading ? { scale: 0.99 } : {}}
            className={`
              flex flex-col items-center justify-center w-full ${getDefaultHeight()}
              border-2 border-dashed rounded-xl transition-all
              ${uploading ? "border-blue-300 bg-blue-50 cursor-wait" : disabled ? "border-gray-200 bg-gray-50 cursor-not-allowed" : "border-[#446E6D]/30 bg-[#446E6D]/5 hover:bg-[#446E6D]/10 cursor-pointer"}
            `}
          >
            <div className="flex flex-col items-center justify-center py-8">
              {uploading ? (
                <>
                  <Loader className="mb-3 text-blue-500 animate-spin" size={48} />
                  <p className="text-base font-medium text-blue-600">Uploading...</p>
                  <p className="text-sm text-gray-500">Please wait</p>
                </>
              ) : (
                <>
                  <Upload className={`mb-3 ${disabled ? "text-gray-400" : "text-[#446E6D]"}`} size={48} />
                  <p className={`text-base font-medium ${disabled ? "text-gray-400" : "text-[#446E6D]"}`}>
                    {getPlaceholderText()}
                  </p>
                  <p className="text-sm text-gray-500">Max {maxSize}MB</p>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <div className={`relative w-full ${getDefaultHeight()} rounded-xl overflow-hidden shadow-sm border border-gray-200`}>
            {fileType === "video" ? (
              <video src={imagePreview} className="w-full h-full object-cover" controls />
            ) : (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            )}
            {!disabled && !uploading && (
              <motion.button
                type="button"
                onClick={handleImageRemove}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 shadow-md"
              >
                <X size={20} />
              </motion.button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                  <Loader className="text-blue-500 animate-spin mb-2" size={32} />
                  <p className="text-sm font-medium text-gray-700">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200"
        >
          {error}
        </motion.p>
      )}

      {!error && (
        <p className="mt-2 text-xs text-gray-500">
          {mediaType === "video"
            ? `Video upload`
            : mediaType === "image"
              ? `${aspectRatio ? `Ratio: ${ratioWidth}:${ratioHeight}` : "Any image size"}`
              : `${aspectRatio ? `Ratio: ${ratioWidth}:${ratioHeight}` : "Any size"} • Image or Video`}
          {" •"} Max: {maxSize}MB
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
