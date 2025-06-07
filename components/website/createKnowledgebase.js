"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import {
  Loader2,
  Plus,
  Trash2,
  Save,
  Tag,
  Book,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  ChevronDown,
  Check,
  ListOrdered,
  List,
  Type,
} from "lucide-react";
import { MyContext } from "@/context/context";
import { toast } from "react-toastify";

export default function CreateKnowledgebase() {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    introduction: "",
    mainSections: [
      {
        title: "",
        explanationType: "article",
        article: "",
        bullets: [],
        image: null,
      },
    ],
    conclusion: "",
    tags: [],
    relatedServices: [],
    relatedIndustries: [],
    relatedProducts: [],
    relatedChikfdServices: [],
    status: "draft",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [products, setProducts] = useState([]);
  const [childServices, setChildServices] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const { customToast } = useContext(MyContext);
  const [tagError, setTagError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const [uploadingPointImages, setUploadingPointImages] = useState(false);
  const [sectionImagePreviews, setSectionImagePreviews] = useState({});
  
  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState({
    services: false,
    industries: false,
    products: false,
    childServices: false
  });

  // Fetch related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, industriesRes, productsRes, childServicesRes] = await Promise.all([
          axios.get("/api/service/getservice"),
          axios.get("/api/industry/get"),
          axios.get("/api/product/get"),
          axios.get("/api/child/get")
        ]);
        
        setServices(servicesRes.data.services || []);
        setIndustries(industriesRes.data.industries || []);
        setProducts(productsRes.data.products || []);
        setChildServices(childServicesRes.data.products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        customToast({
          success: false,
          message: "Failed to load required data"
        });
      }
    };
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownContainers = document.querySelectorAll('.dropdown-container');
      let clickedOutside = true;
      
      dropdownContainers.forEach(container => {
        if (container.contains(event.target)) {
          clickedOutside = false;
        }
      });
      
      if (clickedOutside) {
        setDropdownOpen({
          services: false,
          industries: false,
          products: false,
          childServices: false
        });
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        message: `Image must have a 16:7 aspect ratio. Current ratio is ${
          dimensionError.dimensions?.width
        }x${dimensionError.dimensions?.height} (${
          dimensionError.dimensions?.aspectRatio.toFixed(2)
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

  // Handle section image upload
  const handleSectionImageChange = (sectionIndex, e) => {
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

    const updatedSections = [...formData.mainSections];
    updatedSections[sectionIndex].imageFile = file;

    setFormData(prev => ({
      ...prev,
      mainSections: updatedSections
    }));
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSectionImagePreviews(prev => ({
        ...prev,
        [sectionIndex]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove section image
  const removeSectionImage = (sectionIndex) => {
    const updatedSections = [...formData.mainSections];
    updatedSections[sectionIndex].image = null;
    updatedSections[sectionIndex].imageFile = null;

    setFormData(prev => ({
      ...prev,
      mainSections: updatedSections
    }));

    setSectionImagePreviews(prev => {
      const updated = {...prev};
      delete updated[sectionIndex];
      return updated;
    });
  };

  // Upload a single section image and return the URL
  const uploadSectionImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        throw new Error(response.data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading section image:', error);
      throw error;
    }
  };

  // Upload all section images before form submission
  const uploadAllSectionImages = async () => {
    const updatedSections = [...formData.mainSections];
    let hasImagesToUpload = false;
    
    // Check if any sections have image files to upload
    for (const section of updatedSections) {
      if (section.imageFile) {
        hasImagesToUpload = true;
        break;
      }
    }
    
    if (!hasImagesToUpload) {
      return updatedSections; // No images to upload, return sections as is
    }
    
    setUploadingPointImages(true);
    
    try {
      // Upload each section image and update the sections with the returned URLs
      for (let i = 0; i < updatedSections.length; i++) {
        const section = updatedSections[i];
        
        if (section.imageFile) {
          // Upload the image and get the URL
          const imageUrl = await uploadSectionImage(section.imageFile);
          
          // Update the section with the image URL
          updatedSections[i] = {
            ...section,
            image: imageUrl,
            imageFile: null // Clear the file object
          };
        }
      }
      
      return updatedSections;
    } catch (error) {
      console.error('Error uploading section images:', error);
      customToast({
        success: false,
        message: 'Failed to upload one or more section images'
      });
      throw error;
    } finally {
      setUploadingPointImages(false);
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

  // Toggle item selection for related content
  const toggleItemSelection = (itemId, listName) => {
    setFormData(prev => {
      const currentList = [...prev[listName]];
      
      if (currentList.includes(itemId)) {
        return {
          ...prev,
          [listName]: currentList.filter(id => id !== itemId)
        };
      } else {
        return {
          ...prev,
          [listName]: [...currentList, itemId]
        };
      }
    });
  };

  // Remove related item
  const removeRelatedItem = (itemId, listName) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(id => id !== itemId)
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
          bullets: [], // Keep bullets array but it might not be used
        };
      } else if (value === "bullets") {
        updatedSections[index] = {
          ...updatedSections[index],
          bullets: updatedSections[index].bullets?.length
            ? updatedSections[index].bullets
            : [{ style: "dot", content: "" }], // Initialize with one empty bullet
          article: updatedSections[index].article || "", // Keep article field but it might not be used
        };
      }
    }

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
          imageFile: null
        }
      ],
    }));
  };

  const removeSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      mainSections: prev.mainSections.filter((_, i) => i !== index),
    }));

    // Also remove the image preview
    setSectionImagePreviews(prev => {
      const updated = {...prev};
      delete updated[index];
      return updated;
    });
  };

  // Bullet points management
  const handleAddBullet = (sectionIndex) => {
    const updatedSections = [...formData.mainSections];
    
    if (!updatedSections[sectionIndex].bullets) {
      updatedSections[sectionIndex].bullets = [];
    }
    
    updatedSections[sectionIndex].bullets.push({ 
      style: "dot", 
      content: "" 
    });
    
    setFormData(prev => ({
      ...prev,
      mainSections: updatedSections
    }));
  };
  
  const handleBulletChange = (sectionIndex, bulletIndex, field, value) => {
    const updatedSections = [...formData.mainSections];
    
    if (!updatedSections[sectionIndex].bullets) {
      updatedSections[sectionIndex].bullets = [];
    }
    
    if (!updatedSections[sectionIndex].bullets[bulletIndex]) {
      updatedSections[sectionIndex].bullets[bulletIndex] = { style: "dot", content: "" };
    }
    
    updatedSections[sectionIndex].bullets[bulletIndex][field] = value;
    
    setFormData(prev => ({
      ...prev,
      mainSections: updatedSections
    }));
  };
  
  const handleRemoveBullet = (sectionIndex, bulletIndex) => {
    const updatedSections = [...formData.mainSections];
    
    if (!updatedSections[sectionIndex].bullets) {
      return;
    }
    
    updatedSections[sectionIndex].bullets = updatedSections[sectionIndex].bullets.filter(
      (_, idx) => idx !== bulletIndex
    );
    
    setFormData(prev => ({
      ...prev,
      mainSections: updatedSections
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

    if (!formData.conclusion.trim()) {
      customToast({
        success: false,
        message: "Conclusion is required"
      });
      return false;
    }

    if (formData.mainSections.length === 0) {
      customToast({
        success: false,
        message: "At least one section is required"
      });
      return false;
    }

    for (const [i, section] of formData.mainSections.entries()) {
      if (!section.title.trim()) {
        customToast({
          success: false,
          message: `Title for section ${i + 1} is required`
        });
        return false;
      }

      if (section.explanationType === 'article' && !section.article.trim()) {
        customToast({
          success: false,
          message: `Article content for section ${i + 1} is required`
        });
        return false;
      }

      if (section.explanationType === 'bullets') {
        if (!section.bullets || section.bullets.length === 0) {
          customToast({
            success: false,
            message: `At least one bullet point is required for section ${i + 1}`
          });
          return false;
        }

        for (const [j, bullet] of section.bullets.entries()) {
          if (!bullet.content.trim()) {
            customToast({
              success: false,
              message: `Content for bullet ${j + 1} in section ${i + 1} is required`
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
    
    setLoading(true);
    
    try {
      // Step 1: Upload any section images first
      let updatedSections;
      try {
        updatedSections = await uploadAllSectionImages();
        
        // Update form data with the new sections that have image URLs
        setFormData(prev => ({
          ...prev,
          mainSections: updatedSections
        }));
      } catch (error) {
        setLoading(false);
        return; // Stop if image uploads fail
      }
      
      // Step 2: Create FormData object to handle file upload
      const formDataToSubmit = new FormData();
      
      // Append image file
      formDataToSubmit.append("Image", imageFile);
      
      // Append other form fields
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("introduction", formData.introduction);
      formDataToSubmit.append("conclusion", formData.conclusion);
      
      // Prepare sections for submission - remove any imageFile properties
      const sectionsForSubmission = updatedSections.map(section => {
        const { imageFile, ...sectionWithoutImageFile } = section;
        return sectionWithoutImageFile;
      });
      
      formDataToSubmit.append("mainSections", JSON.stringify(sectionsForSubmission));
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
          mainSections: [{ 
            title: "", 
            explanationType: "article", 
            article: "", 
            bullets: [],
            image: null 
          }],
          conclusion: "",
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
        setSectionImagePreviews({});
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

      {(loading || uploadingPointImages) && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
          <p className="text-white font-medium">
            {uploadingPointImages ? "Uploading images..." : "Creating article..."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
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
              <div key={index} className="p-5 bg-gray-50 rounded-lg relative border border-gray-200 shadow-sm">
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
                    onChange={(e) => handleSectionChange(index, "title", e.target.value)}
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
                      <label 
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">Click to upload an image</p>
                          <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
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
                        onChange={() => handleSectionChange(index, "explanationType", "article")}
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
                        onChange={() => handleSectionChange(index, "explanationType", "bullets")}
                      />
                      <span className="ml-2 flex items-center">
                        <ListOrdered size={16} className="mr-1" /> Bullet Points
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
                      onChange={(e) => handleSectionChange(index, "article", e.target.value)}
                      rows="6"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent whitespace-pre-wrap"
                      placeholder="Write your article content here (preserves spaces and new lines)"
                      required
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                      Use new lines and spaces for formatting. They will be preserved when displayed.
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
                    
                    {(!section.bullets || section.bullets.length === 0) ? (
                      <div className="text-center py-4 bg-white border border-dashed rounded-md">
                        <p className="text-gray-500 text-sm">No bullets added yet. Click &quot;Add Bullet&quot; to begin.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {section.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex gap-2 items-start">
                            <div className="w-24 flex-shrink-0">
                              <select
                                value={bullet.style}
                                onChange={(e) => handleBulletChange(index, bulletIndex, "style", e.target.value)}
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
                                onChange={(e) => handleBulletChange(index, bulletIndex, "content", e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Bullet content"
                                required
                              />
                            </div>
                            {section.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBullet(index, bulletIndex)}
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
                onClick={() => setDropdownOpen(prev => ({ ...prev, services: !prev.services }))}
              >
                <span className="text-gray-500">
                  {formData.relatedServices.length ? `${formData.relatedServices.length} service(s) selected` : 'Select services...'}
                </span>
                <ChevronDown size={18} className={`transition-transform ${dropdownOpen.services ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen.services && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                  {services.length > 0 ? (
                    <div className="py-1">
                      {services.map(service => (
                        <div
                          key={service._id}
                          className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                            formData.relatedServices.includes(service._id) ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => toggleItemSelection(service._id, 'relatedServices')}
                        >
                          <span>{service.Title}</span>
                          {formData.relatedServices.includes(service._id) && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No services available</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Selected Services Tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.relatedServices.length > 0 ? (
                formData.relatedServices.map(id => {
                  const service = services.find(s => s._id === id);
                  return service ? (
                    <span
                      key={id}
                      className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {service.Title}
                      <button
                        type="button"
                        onClick={() => removeRelatedItem(id, 'relatedServices')}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })
              ) : (
                <span className="text-gray-400 text-sm">No services selected</span>
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
                onClick={() => setDropdownOpen(prev => ({ ...prev, industries: !prev.industries }))}
              >
                <span className="text-gray-500">
                  {formData.relatedIndustries.length ? `${formData.relatedIndustries.length} industry/industries selected` : 'Select industries...'}
                </span>
                <ChevronDown size={18} className={`transition-transform ${dropdownOpen.industries ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen.industries && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                  {industries.length > 0 ? (
                    <div className="py-1">
                      {industries.map(industry => (
                        <div
                          key={industry._id}
                          className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                            formData.relatedIndustries.includes(industry._id) ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => toggleItemSelection(industry._id, 'relatedIndustries')}
                        >
                          <span>{industry.Title || industry.title}</span>
                          {formData.relatedIndustries.includes(industry._id) && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No industries available</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Selected Industries Tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.relatedIndustries.length > 0 ? (
                formData.relatedIndustries.map(id => {
                  const industry = industries.find(i => i._id === id);
                  return industry ? (
                    <span
                      key={id}
                      className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {industry.Title || industry.title}
                      <button
                        type="button"
                        onClick={() => removeRelatedItem(id, 'relatedIndustries')}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })
              ) : (
                <span className="text-gray-400 text-sm">No industries selected</span>
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
                onClick={() => setDropdownOpen(prev => ({ ...prev, childServices: !prev.childServices }))}
              >
                <span className="text-gray-500">
                  {formData.relatedChikfdServices.length ? `${formData.relatedChikfdServices.length} Child Services selected` : 'Select Child Services...'}
                </span>
                <ChevronDown size={18} className={`transition-transform ${dropdownOpen.childServices ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen.childServices && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                  {childServices.length > 0 ? (
                    <div className="py-1">
                      {childServices.map(childService => (
                        <div
                          key={childService._id}
                          className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                            formData.relatedChikfdServices.includes(childService._id) ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => toggleItemSelection(childService._id, 'relatedChikfdServices')}
                        >
                          <span>{childService.Title}</span>
                          {formData.relatedChikfdServices.includes(childService._id) && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No child services available</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Selected Child Services Tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.relatedChikfdServices.length > 0 ? (
                formData.relatedChikfdServices.map(id => {
                  const childService = childServices.find(cs => cs._id === id);
                  return childService ? (
                    <span
                      key={id}
                      className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {childService.Title}
                      <button
                        type="button"
                        onClick={() => removeRelatedItem(id, 'relatedChikfdServices')}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })
              ) : (
                <span className="text-gray-400 text-sm">No child services selected</span>
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
                onClick={() => setDropdownOpen(prev => ({ ...prev, products: !prev.products }))}
              >
                <span className="text-gray-500">
                  {formData.relatedProducts.length ? `${formData.relatedProducts.length} Product(s) selected` : 'Select Products...'}
                </span>
                <ChevronDown size={18} className={`transition-transform ${dropdownOpen.products ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen.products && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                  {products.length > 0 ? (
                    <div className="py-1">
                      {products.map(product => (
                        <div
                          key={product._id}
                          className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                            formData.relatedProducts.includes(product._id) ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => toggleItemSelection(product._id, 'relatedProducts')}
                        >
                          <span>{product.Title}</span>
                          {formData.relatedProducts.includes(product._id) && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No products available</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Selected Products Tags */}
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.relatedProducts.length > 0 ? (
                formData.relatedProducts.map(id => {
                  const product = products.find(p => p._id === id);
                  return product ? (
                    <span
                      key={id}
                      className="inline-flex items-center bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {product.Title}
                      <button
                        type="button"
                        onClick={() => removeRelatedItem(id, 'relatedProducts')}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })
              ) : (
                <span className="text-gray-400 text-sm">No products selected</span>
              )}
            </div>
          </div>
        </div>

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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || uploadingPointImages}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading || uploadingPointImages ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{uploadingPointImages ? "Uploading Images..." : "Creating..."}</span>
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