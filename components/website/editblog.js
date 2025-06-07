"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Loader2,
  UploadCloud,
  X,
  PlusCircle,
  Save,
  ArrowLeft,
  Edit,
  Search,
  Filter,
  Calendar,
  Trash2,
  ListOrdered,
} from "lucide-react";
import { MyContext } from "@/context/context";
import Link from "next/link";

const BlogManager = () => {
  // States for blog listing
  const [blogs, setBlogs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // States for blog editing
  const [formData, setFormData] = useState({
    description: "",
    title: "",
    type: "",
    image: null,
    points: [],
    relatedService: "",
    relatedIndustries: "",
  });
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [pointImagePreviews, setPointImagePreviews] = useState({});
  const [uploadingPointImages, setUploadingPointImages] = useState(false);

  const { customToast } = useContext(MyContext);

  // Function to validate image dimensions (16:7 aspect ratio with 5% tolerance)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const aspectRatio = width / height;
          const targetRatio = 16 / 7;
          const tolerance = 0.05; // 5% tolerance

          if (Math.abs(aspectRatio - targetRatio) <= tolerance) {
            resolve({ width, height, aspectRatio });
          } else {
            reject({
              message: `Image must have a 16:7 aspect ratio. Current ratio is ${aspectRatio.toFixed(
                2
              )}:1`,
              dimensions: { width, height, aspectRatio },
            });
          }
        };
        img.onerror = () => {
          reject({
            message: "Failed to load image. Please select a valid image file.",
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Fetch all blogs initially
  useEffect(() => {
    fetchBlogs();

    // Also fetch services and industries for the edit form
    const fetchServicesAndIndustries = async () => {
      try {
        const [servicesResponse, industriesResponse] = await Promise.all([
          axios.get("/api/service/getservice"),
          axios.get("/api/industry/get"),
        ]);

        setServices(servicesResponse.data.services || []);
        setIndustries(industriesResponse.data.industries || []);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    fetchServicesAndIndustries();
  }, []);

  const fetchBlogs = async () => {
    try {
      setListLoading(true);
      const response = await axios.get("/api/blog/get");
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error loading blogs:", error);
      customToast({ success: false, message: "Failed to load blogs" });
    } finally {
      setListLoading(false);
    }
  };

  const handleEditClick = async (blogId) => {
    try {
      setLoading(true);

      const blogData = blogs?.find((blog) => blog._id === blogId);

      // Transform points to match the updated schema if needed
      const updatedPoints = blogData.points.map((point) => {
        // Handle old format points (backward compatibility)
        if (point.explanation !== undefined && !point.explanationType) {
          return {
            title: point.title || "",
            explanationType: "article",
            article: point.explanation || "",
            bullets: [],
            image: point.image || null,
          };
        }

        // Make sure bullets array is properly initialized
        if (
          point.explanationType === "bullets" &&
          (!point.bullets || !Array.isArray(point.bullets))
        ) {
          point.bullets = [];
        }

        return point;
      });

      setFormData({
        title: blogData.title || "",
        type: blogData.type || "",
        description: blogData.description || "",
        points: updatedPoints,
        relatedService: blogData.relatedService || "",
        relatedIndustries: blogData.relatedIndustries || "",
        image: null, // Will be populated only if user uploads a new image
      });

      // Set image preview
      if (blogData.image) {
        setImagePreview(blogData.image);
      }

      // Initialize point image previews
      const previews = {};
      updatedPoints.forEach((point, index) => {
        if (point.image && typeof point.image === "string") {
          previews[index] = point.image;
        }
      });
      setPointImagePreviews(previews);

      setSelectedBlog(blogData);
    } catch (error) {
      console.error("Error loading blog data:", error);
      customToast({ success: false, message: "Failed to load blog data" });
    } finally {
      setLoading(false);
    }
  };

  // Form handling functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate image dimensions (16:7 aspect ratio with 5% tolerance)
      await validateImageDimensions(file);

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image validation failed:", error);
      customToast({
        success: false,
        message: error.message || "Image must have a 16:7 aspect ratio",
      });
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const addPoint = () => {
    setFormData((prev) => ({
      ...prev,
      points: [
        ...prev.points,
        {
          title: "",
          explanationType: "article",
          article: "",
          bullets: [],
          image: null,
        },
      ],
    }));
  };

  const removePoint = (index) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index),
    }));

    // Also remove the image preview
    setPointImagePreviews((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const handlePointChange = (index, field, value) => {
    const updatedPoints = [...formData.points];

    if (field === "explanationType") {
      // When changing type, set up the appropriate structure
      if (value === "article") {
        updatedPoints[index] = {
          ...updatedPoints[index],
          explanationType: "article",
          article: updatedPoints[index].article || "",
          // Keep bullets array but it won't be used
        };
      } else if (value === "bullets") {
        updatedPoints[index] = {
          ...updatedPoints[index],
          explanationType: "bullets",
          // If no bullets exist yet, initialize with one empty bullet
          bullets: updatedPoints[index].bullets?.length
            ? updatedPoints[index].bullets
            : [{ style: "dot", content: "" }],
          // Keep article field but it won't be used
        };
      }
    } else {
      // For other fields, just update normally
      updatedPoints[index] = {
        ...updatedPoints[index],
        [field]: value,
      };
    }

    setFormData((prev) => ({
      ...prev,
      points: updatedPoints,
    }));
  };

  // Upload a single point image and return the URL
  const uploadPointImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        throw new Error(response.data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading point image:", error);
      throw error;
    }
  };

  // Handle point image upload
  const handlePointImageChange = (pointIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedPoints = [...formData.points];
    // Store the file object temporarily
    updatedPoints[pointIndex].imageFile = file;

    setFormData((prev) => ({
      ...prev,
      points: updatedPoints,
    }));

    // Create preview for point image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPointImagePreviews((prev) => ({
        ...prev,
        [pointIndex]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove point image
  const removePointImage = (pointIndex) => {
    const updatedPoints = [...formData.points];
    // Clear both image (string URL) and imageFile (File object)
    updatedPoints[pointIndex].image = null;
    updatedPoints[pointIndex].imageFile = null;

    setFormData((prev) => ({
      ...prev,
      points: updatedPoints,
    }));

    // Remove the preview
    setPointImagePreviews((prev) => {
      const updated = { ...prev };
      delete updated[pointIndex];
      return updated;
    });
  };

  // Handle bullet points
  const handleAddBullet = (pointIndex) => {
    const updatedPoints = [...formData.points];
    if (!updatedPoints[pointIndex].bullets) {
      updatedPoints[pointIndex].bullets = [];
    }

    updatedPoints[pointIndex].bullets.push({
      style: "dot",
      content: "",
    });

    setFormData((prev) => ({
      ...prev,
      points: updatedPoints,
    }));
  };

  const handleBulletChange = (pointIndex, bulletIndex, field, value) => {
    const updatedPoints = [...formData.points];
    updatedPoints[pointIndex].bullets[bulletIndex][field] = value;

    setFormData((prev) => ({
      ...prev,
      points: updatedPoints,
    }));
  };

  const handleRemoveBullet = (pointIndex, bulletIndex) => {
    const updatedPoints = [...formData.points];
    updatedPoints[pointIndex].bullets = updatedPoints[
      pointIndex
    ].bullets.filter((_, i) => i !== bulletIndex);

    setFormData((prev) => ({
      ...prev,
      points: updatedPoints,
    }));
  };

  // Upload all point images before form submission
  const uploadAllPointImages = async () => {
    const updatedPoints = [...formData.points];
    let hasImagesToUpload = false;

    // Check if any points have image files to upload
    for (const point of updatedPoints) {
      if (point.imageFile) {
        hasImagesToUpload = true;
        break;
      }
    }

    if (!hasImagesToUpload) {
      return updatedPoints; // No images to upload, return points as is
    }

    setUploadingPointImages(true);

    try {
      // Upload each point image and update the points with the returned URLs
      for (let i = 0; i < updatedPoints.length; i++) {
        const point = updatedPoints[i];

        if (point.imageFile) {
          // Upload the image and get the URL
          const imageUrl = await uploadPointImage(point.imageFile);

          // Update the point with the image URL
          updatedPoints[i] = {
            ...point,
            image: imageUrl,
            imageFile: null, // Clear the file object
          };
        }
      }

      return updatedPoints;
    } catch (error) {
      console.error("Error uploading point images:", error);
      customToast({
        success: false,
        message: "Failed to upload one or more point images",
      });
      throw error;
    } finally {
      setUploadingPointImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.type || !formData.description) {
      setMessage("Please fill in all required fields.");
      return;
    }

    // Validate points structure
    for (const point of formData.points) {
      if (!point.title) {
        setMessage("All points must have a title!");
        return;
      }

      if (point.explanationType === "article" && !point.article) {
        setMessage("Points with article explanation type must have content!");
        return;
      }

      if (point.explanationType === "bullets") {
        if (!point.bullets || point.bullets.length === 0) {
          setMessage(
            "Points with bullets explanation type must have at least one bullet!"
          );
          return;
        }

        for (const bullet of point.bullets) {
          if (!bullet.content) {
            setMessage("All bullets must have content!");
            return;
          }
        }
      }
    }

    setLoading(true);
    setProgress(0);

    try {
      // Step 1: Upload any new point images first
      let updatedPoints;
      try {
        updatedPoints = await uploadAllPointImages();

        // Update form data with the new points that have image URLs
        setFormData((prev) => ({
          ...prev,
          points: updatedPoints,
        }));
      } catch (error) {
        setLoading(false);
        return; // Stop if image uploads fail
      }

      // Step 2: Prepare the main form data for submission
      const data = new FormData();
      data.append("blogId", selectedBlog._id);
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("relatedService", formData.relatedService);
      data.append("relatedIndustries", formData.relatedIndustries);

      // Only append image if a new one is selected
      if (formData.image) {
        data.append("image", formData.image);
      }

      // Prepare points for submission - remove any imageFile properties
      const pointsForSubmission = updatedPoints.map((point) => {
        const { imageFile, ...pointWithoutImageFile } = point;
        return pointWithoutImageFile;
      });

      // Add points as JSON string
      data.append("points", JSON.stringify(pointsForSubmission));

      // Step 3: Submit the form
      const response = await axios.post("/api/blog/edit", data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
        withCredentials: true,
      });

      if (response.data.success) {
        customToast({ success: true, message: "Blog updated successfully!" });
        setMessage("Blog updated successfully!");

        // Update the blog in the list
        fetchBlogs();

        // Return to list view after a short delay
        setTimeout(() => {
          setSelectedBlog(null);
          setMessage("");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      customToast({ success: false, message: "Failed to update blog post" });
      setMessage("Failed to update blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functions
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType ? blog.type === filterType : true;

    return matchesSearch && matchesFilter;
  });

  // Get unique blog types for filter
  const blogTypes = [
    ...new Set(blogs.map((blog) => blog.type).filter(Boolean)),
  ];

  // Back to list view
  const handleBackToList = () => {
    setSelectedBlog(null);
    setMessage("");
  };

  // Handle delete blog
  const handleDeleteClick = async (blogId) => {
    if (
      !confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await axios.post(
        "/api/blog/delete",
        { blogId },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        customToast({ success: true, message: "Blog deleted successfully!" });
        fetchBlogs(); // Refresh the blog list
      } else {
        customToast({
          success: false,
          message: response.data.message || "Failed to delete blog",
        });
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      customToast({
        success: false,
        message: error.response?.data?.message || "Failed to delete blog",
      });
    }
  };

  // Render blog list if no blog is selected for editing
  if (!selectedBlog) {
    return (
      <div className="w-full mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
          <Link
            href="/admin/website/blog/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>New Blog</span>
          </Link>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              className="pl-10 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Types</option>
              {blogTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog list */}
        {listLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {blog.type || "Uncategorized"}
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(blog._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                        onClick={() => handleDeleteClick(blog._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-gray-500 text-xl mb-2">No blogs found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    );
  }

  // Render edit form if a blog is selected
  return (
    <div className="w-full mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackToList}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Blog Post</h1>
        </div>
        <span className="text-sm text-gray-500">ID: {selectedBlog._id}</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
      >
        {/* Image Upload Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 border-2 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center min-h-[300px] relative">
            {imagePreview ? (
              <div className="relative w-full h-full flex justify-center">
                <img
                  src={imagePreview}
                  alt="Blog preview"
                  className="object-contain max-h-[250px] rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud size={50} className="text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2 text-center">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-gray-400 text-sm mb-4 text-center">
                  Recommended size: 16:7 aspect ratio (required)
                </p>
                <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-4">Blog Details</h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Blog Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {blogTypes.map((type, index) => (
                  <option key={index} value={type} className="cursor-pointer">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Related Service
                </label>
                <select
                  name="relatedService"
                  value={formData.relatedService}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.Title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Related Industry
                </label>
                <select
                  name="relatedIndustries"
                  value={formData.relatedIndustries}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">None</option>
                  {industries.map((industry) => (
                    <option key={industry._id} value={industry._id}>
                      {industry.Title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter blog description"
              rows="5"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 text-lg font-medium">
                Key Points
              </label>
              <button
                type="button"
                onClick={addPoint}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md"
              >
                <PlusCircle size={18} className="mr-1" /> Add Point
              </button>
            </div>

            <div className="space-y-6">
              {formData.points.map((point, pointIndex) => (
                <div
                  key={pointIndex}
                  className="border rounded-md p-6 bg-gray-50 relative"
                >
                  <button
                    type="button"
                    onClick={() => removePoint(pointIndex)}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Point Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={point.title}
                      onChange={(e) =>
                        handlePointChange(pointIndex, "title", e.target.value)
                      }
                      placeholder="Point title"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Explanation Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={point.explanationType}
                      onChange={(e) =>
                        handlePointChange(
                          pointIndex,
                          "explanationType",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="article">Article</option>
                      <option value="bullets">Bullet Points</option>
                    </select>
                  </div>

                  {point.explanationType === "article" ? (
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Article Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={point.article}
                        onChange={(e) =>
                          handlePointChange(
                            pointIndex,
                            "article",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="6"
                        placeholder="Enter article content (preserves spaces and new lines)"
                        required
                      ></textarea>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-gray-700 font-medium">
                          Bullet Points <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddBullet(pointIndex)}
                          className="flex items-center text-blue-500 hover:text-blue-600"
                        >
                          <PlusCircle size={16} className="mr-1" /> Add Bullet
                        </button>
                      </div>

                      {(!point.bullets || point.bullets.length === 0) && (
                        <div className="text-center py-4 bg-white border border-dashed rounded-lg mb-3">
                          <p className="text-gray-500 text-sm">
                            No bullets added yet. Click "Add Bullet" to begin.
                          </p>
                        </div>
                      )}

                      {point.bullets &&
                        point.bullets.map((bullet, bulletIndex) => (
                          <div
                            key={bulletIndex}
                            className="flex gap-3 mb-3 items-start"
                          >
                            <div className="w-28">
                              <select
                                value={bullet.style}
                                onChange={(e) =>
                                  handleBulletChange(
                                    pointIndex,
                                    bulletIndex,
                                    "style",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                              >
                                <option value="dot">Dot</option>
                                <option value="number">Number</option>
                                <option value="roman">Roman</option>
                              </select>
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={bullet.content}
                                onChange={(e) =>
                                  handleBulletChange(
                                    pointIndex,
                                    bulletIndex,
                                    "content",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Bullet content"
                                required
                              />
                            </div>
                            {point.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveBullet(pointIndex, bulletIndex)
                                }
                                className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Point Image (Optional)
                    </label>
                    <div className="space-y-4">
                      {pointImagePreviews[pointIndex] ? (
                        <div className="relative">
                          <img
                            src={pointImagePreviews[pointIndex]}
                            alt={`Preview for point ${pointIndex + 1}`}
                            className="w-full max-h-40 object-contain rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePointImage(pointIndex)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handlePointImageChange(pointIndex, e)
                          }
                          className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700"
                        />
                      )}
                    </div>
                    {point.image &&
                      typeof point.image === "string" &&
                      !pointImagePreviews[pointIndex] && (
                        <div className="mt-2 text-sm text-green-600">
                          <span>
                            Current image: {point.image.split("/").pop()}
                          </span>
                        </div>
                      )}
                    {point.imageFile && !pointImagePreviews[pointIndex] && (
                      <div className="mt-2 text-sm text-green-600">
                        <span>Image selected: {point.imageFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {formData.points.length === 0 && (
                <div className="text-center py-8 bg-gray-50 border border-dashed rounded-lg">
                  <p className="text-gray-500">
                    No points added yet. Click "Add Point" to begin.
                  </p>
                </div>
              )}
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md mb-4 ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleBackToList}
              className="px-6 py-3 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 transition-colors"
              disabled={loading || uploadingPointImages}
            >
              {loading || uploadingPointImages ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>
                    {uploadingPointImages
                      ? "Uploading Images..."
                      : "Updating..."}
                  </span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Loading Overlay */}
      {(loading || uploadingPointImages) && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex flex-col items-center">
              <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {uploadingPointImages
                  ? "Uploading Images..."
                  : "Updating Blog..."}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{
                    width: uploadingPointImages ? "100%" : `${progress}%`,
                  }}
                ></div>
              </div>
              <p className="text-gray-500">
                {uploadingPointImages
                  ? "Please wait while we upload your images."
                  : "Please wait while we update your blog post."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
