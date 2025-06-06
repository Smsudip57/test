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
        content: "",
        points: [], // Add points array to each section
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
        // FIX: Change from childServices to products to match the server response
        setChildServices(childServicesRes.data.products || []);
        
        console.log("Child Services:", childServicesRes.data); // Log to debug
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
        { title: "", content: "", points: [] }
      ],
    }));
  };

  const handlePointChange = (sectionIndex, pointIndex, field, value) => {
    const updatedSections = [...formData.mainSections];
    const section = updatedSections[sectionIndex];

    if (!section.points) {
      section.points = [];
    }

    if (!section.points[pointIndex]) {
      section.points[pointIndex] = { title: "", description: "" };
    }

    section.points[pointIndex][field] = value;

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));
  };

  const addPoint = (sectionIndex) => {
    const updatedSections = [...formData.mainSections];
    const section = updatedSections[sectionIndex];

    if (!section.points) {
      section.points = [];
    }

    section.points.push({ title: "", description: "" });

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));
  };

  const removePoint = (sectionIndex, pointIndex) => {
    const updatedSections = [...formData.mainSections];
    updatedSections[sectionIndex].points = updatedSections[
      sectionIndex
    ].points.filter((_, i) => i !== pointIndex);

    setFormData((prev) => ({
      ...prev,
      mainSections: updatedSections,
    }));
  };

  const removeSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      mainSections: prev.mainSections.filter((_, i) => i !== index),
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

      if (!section.content.trim()) {
        customToast({
          success: false,
          message: `Content for section ${i + 1} is required`
        });
        return false;
      }

      // Validate points if they exist
      if (section.points && section.points.length > 0) {
        for (const [j, point] of section.points.entries()) {
          if (!point.title.trim()) {
            customToast({
              success: false,
              message: `Title for point ${j + 1} in section ${i + 1} is required`
            });
            return false;
          }

          if (!point.description.trim()) {
            customToast({
              success: false,
              message: `Description for point ${j + 1} in section ${i + 1} is required`
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
      // Create FormData object to handle file upload
      const formDataToSubmit = new FormData();
      
      // Append image file
      formDataToSubmit.append("Image", imageFile);
      
      // Append other form fields
      formDataToSubmit.append("title", formData.title);
      formDataToSubmit.append("introduction", formData.introduction);
      formDataToSubmit.append("conclusion", formData.conclusion);
      formDataToSubmit.append("mainSections", JSON.stringify(formData.mainSections));
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
          mainSections: [{ title: "", content: "", points: [] }],
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
                    onChange={(e) =>
                      handleSectionChange(index, "title", e.target.value)
                    }
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Section title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Section Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={section.content}
                    onChange={(e) =>
                      handleSectionChange(index, "content", e.target.value)
                    }
                    rows="4"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Section content"
                    required
                  />
                </div>

                {/* Points Section */}
                <div className="mt-6 bg-white p-4 rounded-md border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-gray-700 font-medium">
                      Section Points
                    </label>
                    <button
                      type="button"
                      onClick={() => addPoint(index)}
                      className="inline-flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100"
                    >
                      <Plus size={16} className="mr-1" /> Add Point
                    </button>
                  </div>

                  <div className="space-y-4">
                    {section.points?.map((point, pointIndex) => (
                      <div
                        key={pointIndex}
                        className="p-4 bg-gray-50 rounded-md border border-gray-200 relative"
                      >
                        <button
                          type="button"
                          onClick={() => removePoint(index, pointIndex)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm mb-2 font-medium">
                            Point Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={point.title}
                            onChange={(e) =>
                              handlePointChange(
                                index,
                                pointIndex,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Point title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm mb-2 font-medium">
                            Point Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={point.description}
                            onChange={(e) =>
                              handlePointChange(
                                index,
                                pointIndex,
                                "description",
                                e.target.value
                              )
                            }
                            rows="2"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Point description"
                            required
                          />
                        </div>
                      </div>
                    ))}

                    {(!section.points || section.points.length === 0) && (
                      <p className="text-center text-gray-500 py-4 bg-gray-50 rounded-md border border-dashed">
                        No points added yet
                      </p>
                    )}
                  </div>
                </div>
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

          {/* Related Products */}
          <div className="dropdown-container">
            <label className="block text-gray-700 font-medium mb-2">
              Related Child Services
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full p-3 border rounded-md bg-white flex justify-between items-center focus:ring-2 focus:ring-primary focus:border-transparent"
                onClick={() => setDropdownOpen(prev => ({ ...prev, products: !prev.products }))}
              >
                <span className="text-gray-500">
                  {formData.relatedProducts.length ? `${formData.relatedProducts.length} Child Service(s) selected` : 'Select Child Services...'}
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

          {/* Related Child Services */}
          <div className="dropdown-container">
            <label className="block text-gray-700 font-medium mb-2">
              Related Products
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full p-3 border rounded-md bg-white flex justify-between items-center focus:ring-2 focus:ring-primary focus:border-transparent"
                onClick={() => setDropdownOpen(prev => ({ ...prev, childServices: !prev.childServices }))}
              >
                <span className="text-gray-500">
                  {formData.relatedChikfdServices.length ? `${formData.relatedChikfdServices.length} Product(s) selected` : 'Select Products...'}
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
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating...</span>
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