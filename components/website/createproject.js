"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, PlusCircle, X, Film, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateProject() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    Title: "",
    detail: "",
    slug: "",
    mediaType: "image", // Default to image
    media: null,
    relatedServices: [], // Changed to array
    relatedProducts: [], // Added
    relatedChikfdServices: [], // Added
    sections: [
      {
        title: "",
        points: [{ title: "", detail: "" }],
      },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [videoKey, setVideoKey] = useState(0); // Key to force video element to remount
  const [services, setServices] = useState([]); // Add state for services list
  const [products, setProducts] = useState([]); // Add state for products list
  const [childServices, setChildServices] = useState([]); // Add state for child services list
  const [loading, setLoading] = useState(false); // Add loading state for services

  // Arrays for section images - similar to editproject.js approach
  const [sectionImages, setSectionImages] = useState([[]]);
  const [sectionPreviews, setSectionPreviews] = useState([[]]);

  // Fetch services, products, and child services when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [servicesRes, productsRes, childServicesRes] = await Promise.all([
          axios.get("/api/service/getservice"),
          axios.get("/api/product/get"),
          axios.get("/api/child/get"),
        ]);

        if (servicesRes.data && servicesRes.data.success) {
          setServices(servicesRes.data.services || []);
        }

        if (productsRes.data && productsRes.data.success) {
          setProducts(productsRes.data.products || []);
        }

        if (childServicesRes.data && childServicesRes.data.success) {
          setChildServices(childServicesRes.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load services, products, or child services");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (mediaPreview && !mediaPreview.startsWith("http")) {
        URL.revokeObjectURL(mediaPreview);
      }

      // Clean up all section image previews
      sectionPreviews.forEach((sectionPreview) => {
        if (sectionPreview) {
          sectionPreview.forEach((preview) => {
            if (preview && !preview.startsWith("http")) {
              URL.revokeObjectURL(preview);
            }
          });
        }
      });
    };
  }, []);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug when title changes
    if (name === "Title" && value) {
      setFormValues((prev) => ({ ...prev, slug: generateSlug(value) }));
    }

    // When mediaType changes, clear the current media if it's not compatible
    if (name === "mediaType") {
      if (
        (value === "image" && formValues.media?.type?.startsWith("video/")) ||
        (value === "video" && formValues.media?.type?.startsWith("image/"))
      ) {
        setFormValues((prev) => ({ ...prev, media: null }));
        setMediaPreview(null);
      }
    }
  };

  // Handle multi-select changes for related items
  const handleMultiSelectChange = (field, value) => {
    setFormValues((prev) => {
      const currentValues = prev[field] || [];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value) // Remove if already selected
        : [...currentValues, value]; // Add if not selected

      return { ...prev, [field]: updatedValues };
    });
  };

  // Handle select all / deselect all
  const handleSelectAll = (field, allItems) => {
    setFormValues((prev) => {
      const currentValues = prev[field] || [];
      const allIds = allItems.map((item) => item._id);
      const isAllSelected = allIds.every((id) => currentValues.includes(id));

      return {
        ...prev,
        [field]: isAllSelected ? [] : allIds,
      };
    });
  };

  // Helper function to validate image dimensions
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const targetAspectRatio = 16 / 9;
        const tolerance = 0.1; // Allow small tolerance for aspect ratio

        URL.revokeObjectURL(img.src); // Clean up object URL

        if (Math.abs(aspectRatio - targetAspectRatio) > tolerance) {
          reject({
            message: `Image should have a 16:9 aspect ratio. Current ratio is ${
              img.width
            }x${img.height} (${aspectRatio.toFixed(2)}:1).`,
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

  // Handle media file selection
  const handleMediaChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (formValues.mediaType === "image" && !file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    } else if (
      formValues.mediaType === "video" &&
      !file.type.startsWith("video/")
    ) {
      setError("Please select a video file");
      return;
    }

    // For images, check dimensions
    if (formValues.mediaType === "image" && file.type.startsWith("image/")) {
      try {
        await validateImageDimensions(file);
      } catch (dimensionError) {
        setError(dimensionError.message);
        e.target.value = "";
        return;
      }
    }

    // If validation passes, proceed with file handling
    setFormValues((prev) => ({ ...prev, media: file }));

    // Revoke old preview URL if it exists
    if (mediaPreview && !mediaPreview.startsWith("http")) {
      URL.revokeObjectURL(mediaPreview);
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMediaPreview(previewUrl);

    // Auto-detect media type
    if (file.type.startsWith("video/")) {
      setFormValues((prev) => ({ ...prev, mediaType: "video" }));
      setVideoKey((prev) => prev + 1); // Force video element to remount
    } else {
      setFormValues((prev) => ({ ...prev, mediaType: "image" }));
    }

    // Clear any error
    setError("");
  };

  // Handle section title changes
  const handleSectionTitleChange = (index, value) => {
    const updatedSections = [...formValues.sections];
    updatedSections[index].title = value;
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Handle section image changes (multiple images)
  const handleSectionImageChange = async (sectionIndex, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Create new arrays by copying the old ones to avoid reference issues
    const newImages = [...sectionImages];
    const newPreviews = [...sectionPreviews];

    // Initialize arrays if they don't exist
    if (!newImages[sectionIndex]) newImages[sectionIndex] = [];
    if (!newPreviews[sectionIndex]) newPreviews[sectionIndex] = [];

    // Convert FileList to Array for easier processing
    const fileArray = Array.from(files);

    try {
      // Process all selected files
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          console.error(
            `Invalid file type: ${file.type} for file: ${file.name}`
          );
          setError("Please select only image files");
          e.target.value = "";
          return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          console.error(
            `File too large: ${file.size} bytes for file: ${file.name}`
          );
          setError(`File ${file.name} is too large. Maximum size is 10MB.`);
          e.target.value = "";
          return;
        }

        // Validate image dimensions (16:9 aspect ratio)
        try {
          const dimensions = await validateImageDimensions(file);
        } catch (dimensionError) {
          console.error(
            `Dimension validation failed for ${file.name}:`,
            dimensionError
          );

          // Set error message with clear 16:9 requirement
          setError(
            `Image must have a 16:9 aspect ratio. Current ratio is ${
              dimensionError.dimensions?.width
            }x${
              dimensionError.dimensions?.height
            } (${dimensionError.dimensions?.aspectRatio.toFixed(
              2
            )}:1). Please use an image with 16:9 dimensions like 1920x1080, 1600x900, etc.`
          );

          // If you have a toast notification system, uncomment the line below:
          toast.error("Image must have a 16:9 aspect ratio");

          e.target.value = "";
          return;
        }

        // Add file to the images array
        newImages[sectionIndex].push(file);

        // Create and add preview URL
        const previewUrl = URL.createObjectURL(file);
        newPreviews[sectionIndex].push(previewUrl);
      }

      // Update state with the new arrays
      setSectionImages(newImages);
      setSectionPreviews(newPreviews);

      // Clear any previous error
      setError("");

      // Clear the file input to allow re-uploading the same file
      e.target.value = "";
    } catch (error) {
      console.error("Error processing images:", error);
      setError(
        "An error occurred while processing the images. Please try again."
      );
      e.target.value = "";
    }
  };

  // Remove a specific image from a section
  const removeSectionImage = (sectionIndex, imageIndex) => {
    if (!sectionImages[sectionIndex] || !sectionPreviews[sectionIndex]) return;

    // Create copies of the arrays
    const updatedImages = [...sectionImages];
    const updatedPreviews = [...sectionPreviews];

    // Revoke the object URL to prevent memory leaks
    const previewUrl = updatedPreviews[sectionIndex][imageIndex];
    if (
      previewUrl &&
      typeof previewUrl === "string" &&
      !previewUrl.startsWith("http")
    ) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch (err) {
        console.error("Error revoking URL:", err);
      }
    }

    // Remove the items from the arrays
    updatedImages[sectionIndex] = [
      ...updatedImages[sectionIndex].slice(0, imageIndex),
      ...updatedImages[sectionIndex].slice(imageIndex + 1),
    ];

    updatedPreviews[sectionIndex] = [
      ...updatedPreviews[sectionIndex].slice(0, imageIndex),
      ...updatedPreviews[sectionIndex].slice(imageIndex + 1),
    ];

    // Update state
    setSectionImages(updatedImages);
    setSectionPreviews(updatedPreviews);
  };

  // Add a new section
  const addSection = () => {
    setFormValues((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          points: [{ title: "", detail: "" }],
        },
      ],
    }));

    // Add empty arrays for the new section's images
    setSectionImages([...sectionImages, []]);
    setSectionPreviews([...sectionPreviews, []]);
  };

  // Remove a section
  const removeSection = (index) => {
    // Clean up image preview URLs for this section
    if (sectionPreviews[index]) {
      sectionPreviews[index].forEach((preview) => {
        if (preview && !preview.startsWith("http")) {
          URL.revokeObjectURL(preview);
        }
      });
    }

    // Remove section from all state
    setFormValues({
      ...formValues,
      sections: formValues.sections.filter((_, i) => i !== index),
    });

    setSectionImages([
      ...sectionImages.slice(0, index),
      ...sectionImages.slice(index + 1),
    ]);

    setSectionPreviews([
      ...sectionPreviews.slice(0, index),
      ...sectionPreviews.slice(index + 1),
    ]);
  };

  // Add a new point to a section
  const addPoint = (sectionIndex) => {
    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex].points.push({ title: "", detail: "" });
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Remove a point from a section
  const removePoint = (sectionIndex, pointIndex) => {
    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex].points = updatedSections[
      sectionIndex
    ].points.filter((_, i) => i !== pointIndex);
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Handle point changes
  const handlePointChange = (sectionIndex, pointIndex, field, value) => {
    const updatedSections = [...formValues.sections];
    updatedSections[sectionIndex].points[pointIndex][field] = value;
    setFormValues({ ...formValues, sections: updatedSections });
  };

  // Get readable file size
  const getFileSize = (file) => {
    if (!file) return "";
    const sizeMB = file.size / (1024 * 1024);
    return sizeMB < 1
      ? `${(sizeMB * 1024).toFixed(2)} KB`
      : `${sizeMB.toFixed(2)} MB`;
  };

  // Form validation
  const validateForm = () => {
    if (
      !formValues.Title ||
      !formValues.detail ||
      !formValues.slug ||
      !formValues.media
    ) {
      setError("Please fill all required fields and upload a media file");
      return false;
    }

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formValues.slug)) {
      setError(
        "Slug must be lowercase, containing only letters, numbers, and hyphens"
      );
      return false;
    }

    // At least one related item should be selected
    if (
      formValues.relatedServices.length === 0 &&
      formValues.relatedProducts.length === 0 &&
      formValues.relatedChikfdServices.length === 0
    ) {
      setError(
        "Please select at least one related service, product, or child service"
      );
      return false;
    }

    // Validate media type matches file type
    if (
      formValues.mediaType === "image" &&
      formValues.media.type.startsWith("video/")
    ) {
      setError("Selected file is a video but media type is set to image");
      return false;
    }

    if (
      formValues.mediaType === "video" &&
      formValues.media.type.startsWith("image/")
    ) {
      setError("Selected file is an image but media type is set to video");
      return false;
    }

    // Validate sections
    for (const [sectionIndex, section] of formValues.sections.entries()) {
      // Check if section has images
      const hasSectionImages = sectionImages[sectionIndex]?.length > 0;

      if (!section.title || !hasSectionImages || section.points.length === 0) {
        setError(
          "Each section must have a title, at least one image, and at least one point"
        );
        return false;
      }

      for (const point of section.points) {
        if (!point.title || !point.detail) {
          setError("All points must have a title and detail");
          return false;
        }
      }
    }

    return true;
  };

  // Get accepted file types based on mediaType
  const getAcceptedFileTypes = () => {
    return formValues.mediaType === "image"
      ? "image/jpeg, image/png, image/gif, image/webp"
      : "video/mp4, video/webm, video/ogg";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setSaving(true);

    const formData = new FormData();
    formData.append("Title", formValues.Title);
    formData.append("detail", formValues.detail);
    formData.append("slug", formValues.slug);
    formData.append("mediaType", formValues.mediaType);
    formData.append("media", formValues.media);

    // Send related items as JSON strings
    formData.append(
      "relatedServices",
      JSON.stringify(formValues.relatedServices)
    );
    formData.append(
      "relatedProducts",
      JSON.stringify(formValues.relatedProducts)
    );
    formData.append(
      "relatedChikfdServices",
      JSON.stringify(formValues.relatedChikfdServices)
    );

    // Add sections data
    formValues.sections.forEach((section, sectionIndex) => {
      formData.append(`section[${sectionIndex}][title]`, section.title);

      // Add multiple images for each section
      if (
        sectionImages[sectionIndex] &&
        sectionImages[sectionIndex].length > 0
      ) {
        sectionImages[sectionIndex].forEach((image) => {
          formData.append(`section[${sectionIndex}][image]`, image);
        });
      }

      // Add points for each section
      section.points.forEach((point, pointIndex) => {
        formData.append(
          `section[${sectionIndex}][points][${pointIndex}][title]`,
          point.title
        );
        formData.append(
          `section[${sectionIndex}][points][${pointIndex}][detail]`,
          point.detail
        );
      });
    });

    try {
      const response = await axios.post("/api/project/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        timeout: 60000, // 60 seconds timeout for large uploads
        maxContentLength: 100 * 1024 * 1024, // 100MB max content length
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      });

      if (response.status === 201) {
        setSuccess("Project created successfully!");

        // Clean up all preview URLs
        if (mediaPreview && !mediaPreview.startsWith("http")) {
          URL.revokeObjectURL(mediaPreview);
        }

        sectionPreviews.forEach((sectionPreview) => {
          if (sectionPreview) {
            sectionPreview.forEach((preview) => {
              if (preview && !preview.startsWith("http")) {
                URL.revokeObjectURL(preview);
              }
            });
          }
        });

        // Reset form after successful submission
        setFormValues({
          Title: "",
          detail: "",
          slug: "",
          mediaType: "image",
          media: null,
          relatedServices: [],
          relatedProducts: [],
          relatedChikfdServices: [],
          sections: [
            {
              title: "",
              points: [{ title: "", detail: "" }],
            },
          ],
        });
        setMediaPreview(null);
        setSectionImages([[]]);
        setSectionPreviews([[]]);
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError(err.response?.data?.message || "Error creating project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        Create New Project
      </h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlusCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                name="Title"
                value={formValues.Title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Project Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Slug *
                <span className="text-xs text-gray-500 ml-1">
                  (URL-friendly identifier)
                </span>
              </label>
              <input
                type="text"
                name="slug"
                value={formValues.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use lowercase letters, numbers, and hyphens only (e.g.,
                &quot;my-project-name&quot;)
              </p>
            </div>

            {/* Related Services Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Services
                <span className="text-xs text-gray-500 ml-1">
                  ({formValues.relatedServices.length} selected)
                </span>
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
                {loading ? (
                  <p className="text-xs text-gray-500">Loading services...</p>
                ) : services.length > 0 ? (
                  <>
                    <div className="mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectAll("relatedServices", services)
                        }
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {services.every((service) =>
                          formValues.relatedServices.includes(service._id)
                        )
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    {services.map((service) => (
                      <label
                        key={service._id}
                        className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-1"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.relatedServices.includes(
                            service._id
                          )}
                          onChange={() =>
                            handleMultiSelectChange(
                              "relatedServices",
                              service._id
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {service.Title}
                        </span>
                      </label>
                    ))}
                  </>
                ) : (
                  <p className="text-xs text-gray-500">No services available</p>
                )}
              </div>
            </div>

            {/* Related Products Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Products
                <span className="text-xs text-gray-500 ml-1">
                  ({formValues.relatedProducts.length} selected)
                </span>
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
                {loading ? (
                  <p className="text-xs text-gray-500">Loading products...</p>
                ) : products.length > 0 ? (
                  <>
                    <div className="mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectAll("relatedProducts", products)
                        }
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {products.every((product) =>
                          formValues.relatedProducts.includes(product._id)
                        )
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    {products.map((product) => (
                      <label
                        key={product._id}
                        className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-1"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.relatedProducts.includes(
                            product._id
                          )}
                          onChange={() =>
                            handleMultiSelectChange(
                              "relatedProducts",
                              product._id
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {product.Title}
                        </span>
                      </label>
                    ))}
                  </>
                ) : (
                  <p className="text-xs text-gray-500">No products available</p>
                )}
              </div>
            </div>

            {/* Related Child Services Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Child Services
                <span className="text-xs text-gray-500 ml-1">
                  ({formValues.relatedChikfdServices.length} selected)
                </span>
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
                {loading ? (
                  <p className="text-xs text-gray-500">
                    Loading child services...
                  </p>
                ) : childServices.length > 0 ? (
                  <>
                    <div className="mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectAll(
                            "relatedChikfdServices",
                            childServices
                          )
                        }
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {childServices.every((childService) =>
                          formValues.relatedChikfdServices.includes(
                            childService._id
                          )
                        )
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>
                    {childServices.map((childService) => (
                      <label
                        key={childService._id}
                        className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-1"
                      >
                        <input
                          type="checkbox"
                          checked={formValues.relatedChikfdServices.includes(
                            childService._id
                          )}
                          onChange={() =>
                            handleMultiSelectChange(
                              "relatedChikfdServices",
                              childService._id
                            )
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {childService.Title}
                        </span>
                      </label>
                    ))}
                  </>
                ) : (
                  <p className="text-xs text-gray-500">
                    No child services available
                  </p>
                )}
              </div>
            </div>

            {/* Project Detail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Detail *
              </label>
              <textarea
                name="detail"
                value={formValues.detail}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Media Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Type *
              </label>
              <div className="flex space-x-4">
                <label
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    formValues.mediaType === "image"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="mediaType"
                    value="image"
                    checked={formValues.mediaType === "image"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <ImageIcon className="h-5 w-5 text-gray-700 mr-2" />
                  <span>Image</span>
                </label>
                <label
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    formValues.mediaType === "video"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="mediaType"
                    value="video"
                    checked={formValues.mediaType === "video"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <Film className="h-5 w-5 text-gray-700 mr-2" />
                  <span>Video</span>
                </label>
              </div>
            </div>

            {/* Project Media Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project {formValues.mediaType === "image" ? "Image" : "Video"} *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {mediaPreview ? (
                    <div className="relative">
                      {formValues.mediaType === "image" ? (
                        <img
                          src={mediaPreview}
                          alt="Media preview"
                          className="mx-auto h-64 w-full object-cover rounded-md"
                        />
                      ) : (
                        <video
                          key={videoKey}
                          src={mediaPreview}
                          controls
                          className="mx-auto h-64 w-full rounded-md"
                        />
                      )}
                      {formValues.media && (
                        <div className="mt-2 text-xs text-gray-500">
                          {formValues.media.name} (
                          {getFileSize(formValues.media)})
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            mediaPreview &&
                            !mediaPreview.startsWith("http")
                          ) {
                            URL.revokeObjectURL(mediaPreview);
                          }
                          setMediaPreview(null);
                          setFormValues((prev) => ({ ...prev, media: null }));
                        }}
                        className="absolute top-2 right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="media-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                          <span>Upload a file</span>
                          <input
                            id="media-upload"
                            name="media"
                            type="file"
                            className="sr-only"
                            onChange={handleMediaChange}
                            accept={getAcceptedFileTypes()}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formValues.mediaType === "image"
                          ? "PNG, JPG, GIF, WebP up to 10MB (16:9 ratio required)"
                          : "MP4, WebM, OGG up to 50MB"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Project Sections
          </h2>

          {formValues.sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="mb-8 p-6 border rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Section {sectionIndex + 1}
                </h3>
                {formValues.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Section Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title *
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        handleSectionTitleChange(sectionIndex, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Section Images */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Section Images *
                      </label>
                      <span className="text-xs text-gray-500">
                        {sectionImages[sectionIndex]?.length || 0} image(s)
                      </span>
                    </div>

                    {/* Display existing images */}
                    {sectionImages[sectionIndex]?.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {sectionImages[sectionIndex].map(
                          (image, imageIndex) => (
                            <div
                              key={`new-${sectionIndex}-${imageIndex}-${image.name}`}
                              className="relative border rounded-md overflow-hidden"
                            >
                              <img
                                src={
                                  sectionPreviews[sectionIndex]?.[imageIndex] ||
                                  ""
                                }
                                alt={`Section image ${imageIndex + 1}`}
                                className="w-full h-24 object-cover"
                                onError={(e) => {
                                  console.error(
                                    "Image load error for:",
                                    sectionPreviews[sectionIndex]?.[imageIndex]
                                  );
                                  e.target.onerror = null; // Prevent infinite loop
                                  e.target.src =
                                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                                  e.target.className =
                                    "w-full h-24 bg-gray-200";
                                }}
                                onLoad={() => {}}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeSectionImage(sectionIndex, imageIndex)
                                }
                                className="absolute top-1 right-1 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="mt-1 text-xs text-gray-500 p-1 truncate">
                                {image.name &&
                                  `${image.name.substring(
                                    0,
                                    15
                                  )}... (${getFileSize(image)})`}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Upload new images */}
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor={`section-image-${sectionIndex}`}
                            className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            <span>Upload images</span>
                            <input
                              id={`section-image-${sectionIndex}`}
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={(e) =>
                                handleSectionImageChange(sectionIndex, e)
                              }
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB each (16:9 ratio required)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Points */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Points *
                      </label>
                      <button
                        type="button"
                        onClick={() => addPoint(sectionIndex)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
                      >
                        <PlusCircle className="h-3 w-3 mr-1" /> Add Point
                      </button>
                    </div>

                    <div className="space-y-4 max-h-80 overflow-y-auto p-2">
                      {section.points.map((point, pointIndex) => (
                        <div
                          key={pointIndex}
                          className="p-3 border rounded-md bg-white"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">
                              Point {pointIndex + 1}
                            </h4>
                            {section.points.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removePoint(sectionIndex, pointIndex)
                                }
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={point.title}
                                onChange={(e) =>
                                  handlePointChange(
                                    sectionIndex,
                                    pointIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Detail
                              </label>
                              <textarea
                                value={point.detail}
                                onChange={(e) =>
                                  handlePointChange(
                                    sectionIndex,
                                    pointIndex,
                                    "detail",
                                    e.target.value
                                  )
                                }
                                rows="2"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" /> Add Section
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              saving ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
