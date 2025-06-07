"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import {
  Loader2,
  Search,
  Filter,
  Edit2,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Tag,
  Calendar,
  BookOpen,
  FileText,
  Upload,
  Image as ImageIcon,
  X,
  ChevronDown,
  Check,
  Type,
  ListOrdered,
} from "lucide-react";
import { MyContext } from "@/context/context";

export default function EditKnowledgeBase() {
  // States for list view
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // States for edit view
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formData, setFormData] = useState(null);
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [products, setProducts] = useState([]);
  const [childServices, setChildServices] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPointImages, setUploadingPointImages] = useState(false);
  const [sectionImagePreviews, setSectionImagePreviews] = useState({});

  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState({
    services: false,
    industries: false,
    products: false,
    childServices: false,
  });

  const { customToast } = useContext(MyContext);

  // Fetch articles and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          articlesRes,
          servicesRes,
          industriesRes,
          productsRes,
          childServicesRes,
        ] = await Promise.all([
          axios.get("/api/knowledgebase/get"),
          axios.get("/api/service/getservice"),
          axios.get("/api/industry/get"),
          axios.get("/api/product/get"),
          axios.get("/api/child/get"),
        ]);

        setArticles(articlesRes.data.knowledgebases || []);
        setServices(servicesRes.data.services || []);
        setIndustries(industriesRes.data.industries || []);
        setProducts(productsRes.data.products || []);
        setChildServices(childServicesRes.data.products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        customToast({
          success: false,
          message: "Failed to load data",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownContainers = document.querySelectorAll(
        ".dropdown-container"
      );
      let clickedOutside = true;

      dropdownContainers.forEach((container) => {
        if (container.contains(event.target)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        setDropdownOpen({
          services: false,
          industries: false,
          products: false,
          childServices: false,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Validate image aspect ratio (16:7)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const targetAspectRatio = 16 / 7;
      const tolerance = 0.1;

      img.onload = () => {
        const aspectRatio = img.width / img.height;
        URL.revokeObjectURL(img.src);

        if (Math.abs(aspectRatio - targetAspectRatio) > tolerance) {
          reject({
            message: `Image should have a 16:7 aspect ratio. Current ratio is ${
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

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      customToast({
        success: false,
        message: "Please select only image files",
      });
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      customToast({
        success: false,
        message: `File ${file.name} is too large. Maximum size is 10MB.`,
      });
      e.target.value = "";
      return;
    }

    try {
      await validateImageDimensions(file);
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (dimensionError) {
      console.error(`Dimension validation failed:`, dimensionError);
      customToast({
        success: false,
        message: `Image must have a 16:7 aspect ratio. Current ratio is ${
          dimensionError.dimensions?.width
        }x${
          dimensionError.dimensions?.height
        } (${dimensionError.dimensions?.aspectRatio.toFixed(2)}:1)`,
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

  // Handle section image upload
  const handleSectionImageChange = (sectionIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      customToast({
        success: false,
        message: "Please select only image files",
      });
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      customToast({
        success: false,
        message: `File ${file.name} is too large. Maximum size is 10MB.`,
      });
      e.target.value = "";
      return;
    }

    const updatedSections = [...formData.mainSections];
    updatedSections[sectionIndex].imageFile = file;

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setSectionImagePreviews((prev) => ({
        ...prev,
        [sectionIndex]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove section image
  const removeSectionImage = (sectionIndex) => {
    const updatedSections = [...formData.mainSections];
    updatedSections[sectionIndex].image = null;
    updatedSections[sectionIndex].imageFile = null;

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));

    setSectionImagePreviews((prev) => {
      const updated = { ...prev };
      delete updated[sectionIndex];
      return updated;
    });
  };

  // Upload section image
  const uploadSectionImage = async (file) => {
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
      console.error("Error uploading section image:", error);
      throw error;
    }
  };

  // Upload all section images
  const uploadAllSectionImages = async () => {
    const updatedSections = [...formData.mainSections];
    let hasImagesToUpload = false;

    for (const section of updatedSections) {
      if (section.imageFile) {
        hasImagesToUpload = true;
        break;
      }
    }

    if (!hasImagesToUpload) {
      return updatedSections;
    }

    setUploadingPointImages(true);

    try {
      for (let i = 0; i < updatedSections.length; i++) {
        const section = updatedSections[i];

        if (section.imageFile) {
          const imageUrl = await uploadSectionImage(section.imageFile);
          updatedSections[i] = {
            ...section,
            image: imageUrl,
            imageFile: null,
          };
        }
      }

      return updatedSections;
    } catch (error) {
      console.error("Error uploading section images:", error);
      customToast({
        success: false,
        message: "Failed to upload one or more section images",
      });
      throw error;
    } finally {
      setUploadingPointImages(false);
    }
  };

  // Ensure data is properly formatted
  const ensureArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);

    // Format mainSections to match the new schema
    const formattedSections = (article.mainSections || []).map((section) => ({
      title: section.title || "",
      explanationType: section.explanationType || "article",
      article: section.article || "",
      bullets: ensureArray(section.bullets),
      image: section.image || null,
      imageFile: null,
    }));

    setFormData({
      articleId: article._id,
      title: article.title || "",
      introduction: article.introduction || "",
      mainSections: formattedSections,
      conclusion: article.conclusion || "",
      tags: ensureArray(article.tags),
      relatedServices: ensureArray(article.relatedServices),
      relatedIndustries: ensureArray(article.relatedIndustries),
      relatedProducts: ensureArray(article.relatedProducts),
      relatedChikfdServices: ensureArray(article.relatedChikfdServices),
      status: article.status || "draft",
    });

    // Set image preview and section image previews
    if (article.Image) {
      setImagePreview(article.Image);
    }

    // Set section image previews
    const sectionPreviews = {};
    formattedSections.forEach((section, index) => {
      if (section.image) {
        sectionPreviews[index] = section.image;
      }
    });
    setSectionImagePreviews(sectionPreviews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle item selection for related content
  const toggleItemSelection = (itemId, listName) => {
    setFormData((prev) => {
      const currentList = ensureArray(prev[listName]);

      if (currentList.includes(itemId)) {
        return {
          ...prev,
          [listName]: currentList.filter((id) => id !== itemId),
        };
      } else {
        return {
          ...prev,
          [listName]: [...currentList, itemId],
        };
      }
    });
  };

  // Remove related item
  const removeRelatedItem = (itemId, listName) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: ensureArray(prev[listName]).filter((id) => id !== itemId),
    }));
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...formData.mainSections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };

    // If changing explanationType, set up the appropriate structure
    if (field === "explanationType") {
      if (value === "article") {
        updatedSections[index] = {
          ...updatedSections[index],
          article: updatedSections[index].article || "",
          bullets: [],
        };
      } else if (value === "bullets") {
        updatedSections[index] = {
          ...updatedSections[index],
          bullets: updatedSections[index].bullets?.length
            ? updatedSections[index].bullets
            : [{ style: "dot", content: "" }],
          article: updatedSections[index].article || "",
        };
      }
    }

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));
  };

  // Bullet points management
  const handleAddBullet = (sectionIndex) => {
    const updatedSections = [...formData.mainSections];

    if (!updatedSections[sectionIndex].bullets) {
      updatedSections[sectionIndex].bullets = [];
    }

    updatedSections[sectionIndex].bullets.push({
      style: "dot",
      content: "",
    });

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));
  };

  const handleBulletChange = (sectionIndex, bulletIndex, field, value) => {
    const updatedSections = [...formData.mainSections];

    if (!updatedSections[sectionIndex].bullets) {
      updatedSections[sectionIndex].bullets = [];
    }

    if (!updatedSections[sectionIndex].bullets[bulletIndex]) {
      updatedSections[sectionIndex].bullets[bulletIndex] = {
        style: "dot",
        content: "",
      };
    }

    updatedSections[sectionIndex].bullets[bulletIndex][field] = value;

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));
  };

  const handleRemoveBullet = (sectionIndex, bulletIndex) => {
    const updatedSections = [...formData.mainSections];

    if (!updatedSections[sectionIndex].bullets) {
      return;
    }

    updatedSections[sectionIndex].bullets = updatedSections[
      sectionIndex
    ].bullets.filter((_, idx) => idx !== bulletIndex);

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      mainSections: [
        ...prev.mainSections,
        {
          title: "",
          explanationType: "article",
          article: "",
          bullets: [],
          image: null,
          imageFile: null,
        },
      ],
    }));
  };

  const removeSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      mainSections: prev.mainSections.filter((_, i) => i !== index),
    }));

    setSectionImagePreviews((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim();

    if (trimmedTag) {
      const currentTags = ensureArray(formData.tags);
      if (currentTags.includes(trimmedTag)) {
        setTagError("This tag already exists!");
        setTimeout(() => setTagError(""), 3000);
      } else {
        setFormData((prev) => ({
          ...prev,
          tags: [...currentTags, trimmedTag],
        }));
        setTagInput("");
        setTagError("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: ensureArray(prev.tags).filter((tag) => tag !== tagToRemove),
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.title.trim()) {
      customToast({
        success: false,
        message: "Title is required",
      });
      return false;
    }

    if (!formData.introduction.trim()) {
      customToast({
        success: false,
        message: "Introduction is required",
      });
      return false;
    }

    if (!formData.conclusion.trim()) {
      customToast({
        success: false,
        message: "Conclusion is required",
      });
      return false;
    }

    if (formData.mainSections.length === 0) {
      customToast({
        success: false,
        message: "At least one section is required",
      });
      return false;
    }

    for (const [i, section] of formData.mainSections.entries()) {
      if (!section.title.trim()) {
        customToast({
          success: false,
          message: `Title for section ${i + 1} is required`,
        });
        return false;
      }

      if (section.explanationType === "article" && !section.article.trim()) {
        customToast({
          success: false,
          message: `Article content for section ${i + 1} is required`,
        });
        return false;
      }

      if (section.explanationType === "bullets") {
        if (!section.bullets || section.bullets.length === 0) {
          customToast({
            success: false,
            message: `At least one bullet point is required for section ${
              i + 1
            }`,
          });
          return false;
        }

        for (const [j, bullet] of section.bullets.entries()) {
          if (!bullet.content.trim()) {
            customToast({
              success: false,
              message: `Content for bullet ${j + 1} in section ${
                i + 1
              } is required`,
            });
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Upload any section images first
      let updatedSections;
      try {
        updatedSections = await uploadAllSectionImages();

        setFormData((prev) => ({
          ...prev,
          mainSections: updatedSections,
        }));
      } catch (error) {
        setSubmitting(false);
        return;
      }

      // Create FormData object to handle file upload
      const formDataToSubmit = new FormData();

      // Append article ID
      formDataToSubmit.append("articleId", formData.articleId);

      // Append image file if a new one was selected
      if (imageFile) {
        formDataToSubmit.append("Image", imageFile);
      }

      // Prepare sections for submission - remove any imageFile properties
      const sectionsForSubmission = updatedSections.map((section) => {
        const { imageFile, ...sectionWithoutImageFile } = section;
        return sectionWithoutImageFile;
      });

      // Append other form fields
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("introduction", formData.introduction);
      formDataToSubmit.append("conclusion", formData.conclusion);
      formDataToSubmit.append(
        "mainSections",
        JSON.stringify(sectionsForSubmission)
      );
      formDataToSubmit.append(
        "tags",
        JSON.stringify(ensureArray(formData.tags))
      );
      formDataToSubmit.append(
        "relatedServices",
        JSON.stringify(ensureArray(formData.relatedServices))
      );
      formDataToSubmit.append(
        "relatedIndustries",
        JSON.stringify(ensureArray(formData.relatedIndustries))
      );
      formDataToSubmit.append(
        "relatedProducts",
        JSON.stringify(ensureArray(formData.relatedProducts))
      );
      formDataToSubmit.append(
        "relatedChikfdServices",
        JSON.stringify(ensureArray(formData.relatedChikfdServices))
      );
      formDataToSubmit.append("status", formData.status);

      const response = await axios.post(
        "/api/knowledgebase/edit",
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
          message: "Knowledge base article updated successfully",
        });

        // Update the article in the list
        setArticles((prev) =>
          prev.map((article) =>
            article._id === formData.articleId ? response.data.article : article
          )
        );

        // Return to list view
        setSelectedArticle(null);
        setFormData(null);
        setImageFile(null);
        setImagePreview(null);
        setSectionImagePreviews({});
      }
    } catch (error) {
      console.error("Error updating article:", error);
      customToast({
        success: false,
        message: error.response?.data?.message || "Failed to update article",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter articles based on search and status
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? article.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Add this function to the component
  const handleDeleteArticle = async (articleId) => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/knowledgebase/delete", {
        articleId,
      });

      if (response.data.success) {
        customToast({
          success: true,
          message: "Knowledge base article deleted successfully",
        });

        // Remove the article from the list
        setArticles((prev) =>
          prev.filter((article) => article._id !== articleId)
        );
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      customToast({
        success: false,
        message: error.response?.data?.message || "Failed to delete article",
      });
    } finally {
      setLoading(false);
    }
  };

  // If editing an article, show the edit form
  if (selectedArticle && formData) {
    return (
      <div className="mx-auto mb-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => {
              setSelectedArticle(null);
              setFormData(null);
              setImageFile(null);
              setImagePreview(null);
              setSectionImagePreviews({});
              setTagInput("");
              setTagError("");
            }}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Edit Knowledge Base Article
            </h1>
            <p className="text-gray-600">
              Update your article content and settings
            </p>
          </div>
        </div>

        {(submitting || uploadingPointImages) && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
            <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
            <p className="text-white font-medium">
              {uploadingPointImages
                ? "Uploading images..."
                : "Updating article..."}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Featured Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Featured Image <span className="text-red-500">*</span>
              <span className="text-sm font-normal text-gray-500 ml-2">
                (16:7 aspect ratio required)
              </span>
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
                <p className="text-sm text-gray-500 mb-1">
                  Click to upload an image
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WebP up to 10MB (16:7 aspect ratio required)
                </p>
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
          </div>

          {/* Main Sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 font-medium">
                Main Sections <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              >
                <Plus size={18} className="mr-1" /> Add Section
              </button>
            </div>

            <div className="space-y-6">
              {formData.mainSections.map((section, index) => (
                <div
                  key={index}
                  className="p-5 bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm"
                >
                  {formData.mainSections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Section Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) =>
                        handleSectionChange(index, "title", e.target.value)
                      }
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Section title"
                      required
                    />
                  </div>

                  {/* Section Image (Optional) */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Section Image (Optional)
                    </label>

                    {sectionImagePreviews[index] ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 mb-4">
                        <img
                          src={sectionImagePreviews[index]}
                          alt={`Section ${index + 1} image preview`}
                          className="w-full h-auto object-cover max-h-[200px]"
                        />
                        <button
                          type="button"
                          onClick={() => removeSectionImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              Click to upload an image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WebP up to 10MB
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleSectionImageChange(index, e)}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Explanation Type */}
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                      Explanation Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={section.explanationType === "article"}
                          onChange={() =>
                            handleSectionChange(
                              index,
                              "explanationType",
                              "article"
                            )
                          }
                        />
                        <span className="ml-2 flex items-center">
                          <Type size={16} className="mr-1" /> Article
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-4 w-4 text-blue-600"
                          checked={section.explanationType === "bullets"}
                          onChange={() =>
                            handleSectionChange(
                              index,
                              "explanationType",
                              "bullets"
                            )
                          }
                        />
                        <span className="ml-2 flex items-center">
                          <ListOrdered size={16} className="mr-1" /> Bullet
                          Points
                        </span>
                      </label>
                    </div>
                  </div>

                  {section.explanationType === "article" ? (
                    // Article Content
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">
                        Article Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={section.article}
                        onChange={(e) =>
                          handleSectionChange(index, "article", e.target.value)
                        }
                        rows="6"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent whitespace-pre-wrap"
                        placeholder="Write your article content here (preserves spaces and new lines)"
                        required
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        Use new lines and spaces for formatting. They will be
                        preserved when displayed.
                      </p>
                    </div>
                  ) : (
                    // Bullet Points
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-gray-700 font-medium">
                          Bullet Points <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddBullet(index)}
                          className="inline-flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"
                        >
                          <Plus size={16} className="mr-1" /> Add Bullet
                        </button>
                      </div>

                      {!section.bullets || section.bullets.length === 0 ? (
                        <div className="text-center py-4 bg-white border border-dashed rounded-md">
                          <p className="text-gray-500 text-sm">
                            No bullets added yet. Click "Add Bullet" to begin.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {section.bullets.map((bullet, bulletIndex) => (
                            <div
                              key={bulletIndex}
                              className="flex gap-2 items-start"
                            >
                              <div className="w-24 flex-shrink-0">
                                <select
                                  value={bullet.style}
                                  onChange={(e) =>
                                    handleBulletChange(
                                      index,
                                      bulletIndex,
                                      "style",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border rounded-md text-sm"
                                >
                                  <option value="dot">Dot</option>
                                  <option value="number">Number</option>
                                  <option value="roman">Roman</option>
                                </select>
                              </div>
                              <div className="flex-grow">
                                <input
                                  type="text"
                                  value={bullet.content}
                                  onChange={(e) =>
                                    handleBulletChange(
                                      index,
                                      bulletIndex,
                                      "content",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border rounded-md"
                                  placeholder="Bullet content"
                                  required
                                />
                              </div>
                              {section.bullets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveBullet(index, bulletIndex)
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Conclusion <span className="text-red-500">*</span>
            </label>
            <textarea
              name="conclusion"
              value={formData.conclusion}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Write a conclusion for your article"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {ensureArray(formData.tags).map((tag, index) => (
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
              {ensureArray(formData.tags).length === 0 && (
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
                <p className="text-red-500 text-sm animate-fade-in">
                  {tagError}
                </p>
              )}
            </div>
          </div>

          {/* Related Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Related Services */}
            <div className="dropdown-container">
              <label className="block text-gray-700 font-medium mb-2">
                Related Services
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-3 border rounded-md bg-white flex justify-between items-center focus:ring-2 focus:ring-primary focus:border-transparent"
                  onClick={() =>
                    setDropdownOpen((prev) => ({
                      ...prev,
                      services: !prev.services,
                    }))
                  }
                >
                  <span className="text-gray-500">
                    {ensureArray(formData.relatedServices).length
                      ? `${
                          ensureArray(formData.relatedServices).length
                        } service(s) selected`
                      : "Select services..."}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      dropdownOpen.services ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen.services && (
                  <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {services.length > 0 ? (
                      <div className="py-1">
                        {services.map((service) => (
                          <div
                            key={service._id}
                            className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                              ensureArray(formData.relatedServices).includes(
                                service._id
                              )
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() =>
                              toggleItemSelection(
                                service._id,
                                "relatedServices"
                              )
                            }
                          >
                            <span>{service.Title}</span>
                            {ensureArray(formData.relatedServices).includes(
                              service._id
                            ) && <Check size={16} className="text-blue-600" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No services available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Services Tags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {ensureArray(formData.relatedServices).length > 0 ? (
                  ensureArray(formData.relatedServices).map((id) => {
                    const service = services.find((s) => s._id === id);
                    return service ? (
                      <span
                        key={id}
                        className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {service.Title}
                        <button
                          type="button"
                          onClick={() =>
                            removeRelatedItem(id, "relatedServices")
                          }
                          className="ml-2 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-gray-400 text-sm">
                    No services selected
                  </span>
                )}
              </div>
            </div>

            {/* Related Industries */}
            <div className="dropdown-container">
              <label className="block text-gray-700 font-medium mb-2">
                Related Industries
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-3 border rounded-md bg-white flex justify-between items-center focus:ring-2 focus:ring-primary focus:border-transparent"
                  onClick={() =>
                    setDropdownOpen((prev) => ({
                      ...prev,
                      industries: !prev.industries,
                    }))
                  }
                >
                  <span className="text-gray-500">
                    {ensureArray(formData.relatedIndustries).length
                      ? `${
                          ensureArray(formData.relatedIndustries).length
                        } industry/industries selected`
                      : "Select industries..."}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      dropdownOpen.industries ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen.industries && (
                  <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {industries.length > 0 ? (
                      <div className="py-1">
                        {industries.map((industry) => (
                          <div
                            key={industry._id}
                            className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                              ensureArray(formData.relatedIndustries).includes(
                                industry._id
                              )
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() =>
                              toggleItemSelection(
                                industry._id,
                                "relatedIndustries"
                              )
                            }
                          >
                            <span>{industry.Title || industry.title}</span>
                            {ensureArray(formData.relatedIndustries).includes(
                              industry._id
                            ) && <Check size={16} className="text-blue-600" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No industries available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Industries Tags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {ensureArray(formData.relatedIndustries).length > 0 ? (
                  ensureArray(formData.relatedIndustries).map((id) => {
                    const industry = industries.find((i) => i._id === id);
                    return industry ? (
                      <span
                        key={id}
                        className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {industry.Title || industry.title}
                        <button
                          type="button"
                          onClick={() =>
                            removeRelatedItem(id, "relatedIndustries")
                          }
                          className="ml-2 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-gray-400 text-sm">
                    No industries selected
                  </span>
                )}
              </div>
            </div>

            {/* Related Child Services */}
            <div className="dropdown-container">
              <label className="block text-gray-700 font-medium mb-2">
                Related Child Services
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-3 border rounded-md bg-white flex justify-between items-center focus:ring-2 focus:ring-primary focus:border-transparent"
                  onClick={() =>
                    setDropdownOpen((prev) => ({
                      ...prev,
                      childServices: !prev.childServices,
                    }))
                  }
                >
                  <span className="text-gray-500">
                    {ensureArray(formData.relatedChikfdServices).length
                      ? `${
                          ensureArray(formData.relatedChikfdServices).length
                        } Child Services selected`
                      : "Select Child Services..."}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      dropdownOpen.childServices ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen.childServices && (
                  <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {childServices.length > 0 ? (
                      <div className="py-1">
                        {childServices.map((childService) => (
                          <div
                            key={childService._id}
                            className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                              ensureArray(
                                formData.relatedChikfdServices
                              ).includes(childService._id)
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() =>
                              toggleItemSelection(
                                childService._id,
                                "relatedChikfdServices"
                              )
                            }
                          >
                            <span>{childService.Title}</span>
                            {ensureArray(
                              formData.relatedChikfdServices
                            ).includes(childService._id) && (
                              <Check size={16} className="text-blue-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No child services available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Child Services Tags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {ensureArray(formData.relatedChikfdServices).length > 0 ? (
                  ensureArray(formData.relatedChikfdServices).map((id) => {
                    const childService = childServices.find(
                      (cs) => cs._id === id
                    );
                    return childService ? (
                      <span
                        key={id}
                        className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {childService.Title}
                        <button
                          type="button"
                          onClick={() =>
                            removeRelatedItem(id, "relatedChikfdServices")
                          }
                          className="ml-2 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-gray-400 text-sm">
                    No child services selected
                  </span>
                )}
              </div>
            </div>

            {/* Related Products */}
            <div className="dropdown-container">
              <label className="block text-gray-700 font-medium mb-2">
                Related Products
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full p-3 border rounded-md bg-white flex justify-between items-center focus:ring-2 focus:ring-primary focus:border-transparent"
                  onClick={() =>
                    setDropdownOpen((prev) => ({
                      ...prev,
                      products: !prev.products,
                    }))
                  }
                >
                  <span className="text-gray-500">
                    {ensureArray(formData.relatedProducts).length
                      ? `${
                          ensureArray(formData.relatedProducts).length
                        } Product(s) selected`
                      : "Select Products..."}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      dropdownOpen.products ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen.products && (
                  <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {products.length > 0 ? (
                      <div className="py-1">
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                              ensureArray(formData.relatedProducts).includes(
                                product._id
                              )
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() =>
                              toggleItemSelection(
                                product._id,
                                "relatedProducts"
                              )
                            }
                          >
                            <span>{product.Title}</span>
                            {ensureArray(formData.relatedProducts).includes(
                              product._id
                            ) && <Check size={16} className="text-blue-600" />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-gray-500">
                        No products available
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Products Tags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {ensureArray(formData.relatedProducts).length > 0 ? (
                  ensureArray(formData.relatedProducts).map((id) => {
                    const product = products.find((p) => p._id === id);
                    return product ? (
                      <span
                        key={id}
                        className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {product.Title}
                        <button
                          type="button"
                          onClick={() =>
                            removeRelatedItem(id, "relatedProducts")
                          }
                          className="ml-2 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-gray-400 text-sm">
                    No products selected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Status
            </label>
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setSelectedArticle(null);
                setFormData(null);
                setImageFile(null);
                setImagePreview(null);
                setSectionImagePreviews({});
                setTagInput("");
                setTagError("");
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingPointImages}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting || uploadingPointImages ? (
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
                  <span>Update Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default view - show list of articles
  return (
    <div className="mx-auto mb-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Knowledge Base Articles
        </h1>
        <p className="text-gray-600">Manage your knowledge base articles</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Articles List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading articles...</span>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus
              ? "Try adjusting your search or filter criteria."
              : "Create your first knowledge base article to get started."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Article Image */}
              {article.Image && (
                <div className="aspect-[16/7] w-full">
                  <img
                    src={article.Image}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {article.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      article.status
                    )}`}
                  >
                    {article.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {article.introduction}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    {article.mainSections?.length || 0} sections
                  </div>
                </div>

                {/* Tags */}
                {ensureArray(article.tags).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {ensureArray(article.tags)
                      .slice(0, 3)
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded"
                        >
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    {ensureArray(article.tags).length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        +{ensureArray(article.tags).length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => handleEdit(article)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 size={16} className="mr-2" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteArticle(article._id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
