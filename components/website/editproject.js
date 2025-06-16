"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Upload, PlusCircle, X, Film, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/context";
import { toast } from 'react-toastify';

export default function EditProject() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formValues, setFormValues] = useState({
    Title: "",
    slug: "",
    detail: "",
    mediaType: "image",
    media: null,
    relatedServices: "",
    sections: [],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [videoKey, setVideoKey] = useState(0);
  const { setUser, customToast } = useContext(MyContext); 
  const [existingSectionImages, setExistingSectionImages] = useState([]);
  // 2. Newly uploaded images
  const [newSectionImages, setNewSectionImages] = useState([]);
  const [newSectionPreviews, setNewSectionPreviews] = useState([]);

  // Fetch projects and services on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch projects
        const projectsResponse = await axios.get("/api/project/get", {
          withCredentials: true,
        });
        if (projectsResponse.data.success) {
          setProjects(projectsResponse.data.data);
        } else {
          setError("Failed to load projects");
        }

        // Fetch services for the dropdown
        const servicesResponse = await axios.get("/api/service/getservice", {
          withCredentials: true,
        });
        if (servicesResponse.data.success) {
          setServices(servicesResponse.data.services || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
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
      newSectionPreviews.forEach((sectionPreview) => {
        if (sectionPreview && Array.isArray(sectionPreview)) {
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

  // Handle selecting a project for editing
  const handleSelectProject = (project) => {
    if (!project) return;

    setSelectedProject(project);

    // Set up existing section images
    const existingImages =
      project.section?.map((section) => {
        const images = Array.isArray(section.image)
          ? section.image
          : [section.image];
        return images.filter((img) => img); // Filter out any null or undefined
      }) || [];

    setExistingSectionImages(existingImages);

    // Initialize empty arrays for new images
    setNewSectionImages(project.section?.map(() => []) || []);
    setNewSectionPreviews(project.section?.map(() => []) || []);

    setFormValues({
      Title: project.Title || "",
      slug: project.slug || "",
      detail: project.detail || "",
      mediaType: project.media?.type || "image",
      media: null, // We don't load the actual file, just the URL
      relatedServices: project.relatedServices || "",
      sections:
        project.section?.map((section) => ({
          title: section.title || "",
          points:
            section.points?.map((point) => ({
              title: point.title || "",
              detail: point.detail || "",
            })) || [],
        })) || [],
    });

    // Set preview URLs from the project data
    if (project.media?.url) {
      setMediaPreview(project.media.url);
    } else {
      setMediaPreview(null);
    }
  };

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug when title changes
    if (name === "Title") {
      setFormValues((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  // Handle media type change
  const handleMediaTypeChange = (type) => {
    setFormValues((prev) => ({ ...prev, mediaType: type }));
    // Clear media file if changing type and it's not compatible
    if (formValues.media) {
      const isMediaImage = formValues.media.type?.startsWith("image/");
      const isMediaVideo = formValues.media.type?.startsWith("video/");

      if (
        (type === "image" && isMediaVideo) ||
        (type === "video" && isMediaImage)
      ) {
        setFormValues((prev) => ({ ...prev, media: null }));
        if (!mediaPreview?.startsWith("http")) {
          URL.revokeObjectURL(mediaPreview);
        }
        setMediaPreview(null);
      }
    }
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
            message: `Image must have a 16:9 aspect ratio. Current ratio is ${img.width}x${img.height} (${aspectRatio.toFixed(2)}:1). Please use an image with 16:9 dimensions like 1920x1080, 1600x900, etc.`,
            dimensions: { width: img.width, height: img.height, aspectRatio }
          });
        } else {
          resolve({ width: img.width, height: img.height, aspectRatio });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject({ message: "Failed to load image. Please select a valid image file." });
      };

      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
    });
  };

  // Handle main media file selection
  const handleMediaChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (formValues.mediaType === "image" && !file.type.startsWith("image/")) {
      setError("Please select an image file");
      toast.error("Please select an image file");
      return;
    } else if (
      formValues.mediaType === "video" &&
      !file.type.startsWith("video/")
    ) {
      setError("Please select a video file");
      toast.error("Please select a video file");
      return;
    }

    // For images, check dimensions
    if (formValues.mediaType === "image" && file.type.startsWith("image/")) {
      try {
        await validateImageDimensions(file);
      } catch (dimensionError) {
        setError(dimensionError.message);
        toast.error('Image must have a 16:9 aspect ratio');
        e.target.value = '';
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
      setVideoKey((prev) => prev + 1);
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

  // Handle section image uploads
  const handleSectionImageChange = async (sectionIndex, e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;


    // Create new arrays by copying the old ones to avoid reference issues
    const newImages = [...newSectionImages];
    const newPreviews = [...newSectionPreviews];

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
          console.error(`Invalid file type: ${file.type} for file: ${file.name}`);
          setError("Please select only image files");
          toast.error("Please select only image files");
          e.target.value = '';
          return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          console.error(`File too large: ${file.size} bytes for file: ${file.name}`);
          setError(`File ${file.name} is too large. Maximum size is 10MB.`);
          toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
          e.target.value = '';
          return;
        }

        // Validate image dimensions (16:9 aspect ratio)
        try {
          const dimensions = await validateImageDimensions(file);
        } catch (dimensionError) {
          console.error(`Dimension validation failed for ${file.name}:`, dimensionError);
          setError(`${file.name}: ${dimensionError.message}`);
          toast.error('Image must have a 16:9 aspect ratio');
          e.target.value = '';
          return;
        }

        // Add file to the images array
        newImages[sectionIndex].push(file);

        // Create and add preview URL
        const previewUrl = URL.createObjectURL(file);
        newPreviews[sectionIndex].push(previewUrl);
      }


      // Update state with the new arrays
      setNewSectionImages(newImages);
      setNewSectionPreviews(newPreviews);
      
      // Clear any previous error
      setError("");
      
      // Clear the file input to allow re-uploading the same file
      e.target.value = '';
    } catch (error) {
      console.error('Error processing images:', error);
      setError('An error occurred while processing the images. Please try again.');
      toast.error('An error occurred while processing the images. Please try again.');
      e.target.value = '';
    }
  };

  const removeExistingImage = (sectionIndex, imageIndex) => {
    if (!existingSectionImages[sectionIndex]) return;

    const updatedExistingImages = [...existingSectionImages];
    updatedExistingImages[sectionIndex] = [
      ...updatedExistingImages[sectionIndex].slice(0, imageIndex),
      ...updatedExistingImages[sectionIndex].slice(imageIndex + 1),
    ];
    setExistingSectionImages(updatedExistingImages);
  };

  // Remove a new image from a section
  const removeNewImage = (sectionIndex, imageIndex) => {
    if (!newSectionImages[sectionIndex] || !newSectionPreviews[sectionIndex])
      return;

    // Create copies of the arrays
    const updatedImages = [...newSectionImages];
    const updatedPreviews = [...newSectionPreviews];

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
    setNewSectionImages(updatedImages);
    setNewSectionPreviews(updatedPreviews);
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
    setExistingSectionImages([...existingSectionImages, []]);
    setNewSectionImages([...newSectionImages, []]);
    setNewSectionPreviews([...newSectionPreviews, []]);
  };

  // Remove a section
  const removeSection = (index) => {
    // Clean up image preview URLs for this section
    if (newSectionPreviews[index]) {
      newSectionPreviews[index].forEach((preview) => {
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

    setExistingSectionImages([
      ...existingSectionImages.slice(0, index),
      ...existingSectionImages.slice(index + 1),
    ]);

    setNewSectionImages([
      ...newSectionImages.slice(0, index),
      ...newSectionImages.slice(index + 1),
    ]);

    setNewSectionPreviews([
      ...newSectionPreviews.slice(0, index),
      ...newSectionPreviews.slice(index + 1),
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

  // Get accepted file types based on media type
  const getAcceptedFileTypes = () => {
    return formValues.mediaType === "image" ? "image/*" : "video/*";
  };

  // Form validation
  const validateForm = () => {
    if (
      !formValues.Title ||
      !formValues.detail ||
      !formValues.slug ||
      !formValues.relatedServices
    ) {
      setError("Please fill all required fields, including related service");
      return false;
    }

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formValues.slug)) {
      setError(
        "Slug must be lowercase, containing only letters, numbers, and hyphens"
      );
      return false;
    }

    // Validate sections
    for (const [sectionIndex, section] of formValues.sections.entries()) {
      // Check if there are images either in existing or new images
      const hasExistingImages = existingSectionImages[sectionIndex]?.length > 0;
      const hasNewImages = newSectionImages[sectionIndex]?.length > 0;

      if (
        !section.title ||
        (!hasExistingImages && !hasNewImages) ||
        section.points.length === 0
      ) {
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

  // Handle form submission - UPDATED to match the server endpoint format
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setSaving(true);

    const formData = new FormData();
    
    // Add project ID and basic fields
    formData.append("_id", selectedProject._id);
    formData.append("Title", formValues.Title);
    formData.append("detail", formValues.detail);
    formData.append("slug", formValues.slug);
    formData.append("mediaType", formValues.mediaType);
    formData.append("relatedServices", formValues.relatedServices);

    // Add media file if provided
    if (formValues.media) {
      formData.append("media", formValues.media);
    }

    // Process sections
    formValues.sections.forEach((section, sectionIndex) => {
      // Add section title
      formData.append(`section[${sectionIndex}][title]`, section.title);
      
      // Add existing images to keep
      if (existingSectionImages[sectionIndex] && existingSectionImages[sectionIndex].length > 0) {
        existingSectionImages[sectionIndex].forEach((imageUrl) => {
          formData.append(`section[${sectionIndex}][keepImages]`, imageUrl);
        });
      }
      
      // Add new section images
      if (newSectionImages[sectionIndex] && newSectionImages[sectionIndex].length > 0) {
        newSectionImages[sectionIndex].forEach((imageFile) => {
          formData.append(`section[${sectionIndex}][image]`, imageFile);
        });
      }
      
      // Add section points
      section.points.forEach((point, pointIndex) => {
        formData.append(`section[${sectionIndex}][points][${pointIndex}][title]`, point.title);
        formData.append(`section[${sectionIndex}][points][${pointIndex}][detail]`, point.detail);
      });
    });

    try {
      const response = await axios.post("/api/project/edit", formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
        timeout: 60000, // 60 seconds timeout
        maxContentLength: 100 * 1024 * 1024, // 100MB max content length
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      });

      if (response.data.success) {
        setSuccess("Project updated successfully!");
        toast.success("Project updated successfully!");

        // Redirect to projects page after 2 seconds
        setTimeout(() => {
          router.push("/admin/website/projects/edit");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to update project");
        toast.error(response.data.message || "Failed to update project");
      }
    } catch (err) {
      console.error("Error updating project:", err);
      const errorMessage = err.response?.data?.message || 
                          (err.message.includes("timeout") ? "Upload timed out. Your images may be too large." : 
                          "Error updating project");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        Edit Project
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

      {/* Project Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Project to Edit
        </label>
        <select
          onChange={(e) =>
            handleSelectProject(projects.find((p) => p._id === e.target.value))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.Title}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
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

              {/* Related Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Service *
                </label>
                <select
                  name="relatedServices"
                  value={formValues.relatedServices}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Select a related service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.Title}
                    </option>
                  ))}
                </select>
                {loading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading services...
                  </p>
                )}
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
                      checked={formValues.mediaType === "image"}
                      onChange={() => handleMediaTypeChange("image")}
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
                      checked={formValues.mediaType === "video"}
                      onChange={() => handleMediaTypeChange("video")}
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
                  Project {formValues.mediaType === "image" ? "Image" : "Video"}{" "}
                  *
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
                          {(existingSectionImages[sectionIndex]?.length || 0) +
                            (newSectionImages[sectionIndex]?.length || 0)}{" "}
                          image(s)
                        </span>
                      </div>

                      {/* Display all images */}
                      {(existingSectionImages[sectionIndex]?.length > 0 ||
                        newSectionImages[sectionIndex]?.length > 0) && (
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {/* Show existing images */}
                          {existingSectionImages[sectionIndex]?.map(
                            (imageUrl, imageIndex) => (
                              <div
                                key={`existing-${sectionIndex}-${imageIndex}`}
                                className="relative"
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Existing section image ${
                                    imageIndex + 1
                                  }`}
                                  className="w-full h-24 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeExistingImage(
                                      sectionIndex,
                                      imageIndex
                                    )
                                  }
                                  className="absolute top-1 right-1 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                                <div className="mt-1 text-xs text-gray-500">
                                  Existing image
                                </div>
                              </div>
                            )
                          )}

                          {/* Show new images */}
                          {newSectionImages[sectionIndex]?.map(
                            (image, imageIndex) => (
                              <div
                                key={`new-${sectionIndex}-${imageIndex}-${image.name}`}
                                className="relative border rounded-md overflow-hidden"
                              >
                                <img
                                  src={
                                    newSectionPreviews[sectionIndex]?.[
                                      imageIndex
                                    ] || ""
                                  }
                                  alt={`Section image ${imageIndex + 1}`}
                                  className="w-full h-24 object-cover"
                                  onError={(e) => {
                                    console.error("Image load error for:", newSectionPreviews[sectionIndex]?.[imageIndex]);
                                    e.target.onerror = null; // Prevent infinite loop
                                    e.target.src =
                                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                                    e.target.className =
                                      "w-full h-24 bg-gray-200";
                                  }}
                                  onLoad={() => {
                                  
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeNewImage(sectionIndex, imageIndex)
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
                              className=" cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 transition-colors"
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}