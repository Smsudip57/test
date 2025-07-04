"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/context";
import { motion, AnimatePresence } from "framer-motion";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Icons
import {
  Upload,
  X,
  Plus,
  ArrowLeft,
  GripVertical,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Trash2,
  Info,
  Tag,
} from "lucide-react";

export default function CreateProduct() {
  const router = useRouter();
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([
    "Branding",
    "Workfrom Anywhere",
    "Modern Workplace",
    "Digital",
    "Endless Support",
  ]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [noServicesMessage, setNoServicesMessage] = useState("");
  const mainImageRef = useRef(null);
  const { setShowConfirm, setConfirmFunction, customToast } =
    useContext(MyContext);

  // Updated state with slug and itemsTag fields
  const [productData, setProductData] = useState({
    Title: "",
    detail: "",
    moreDetail: "",
    slug: "",
    itemsTag: "", // Simple string field as per schema
    category: "",
    image: null,
    sections: [
      {
        title: "",
        image: null,
        imagePreview: null,
        points: [{ title: "", detail: "" }],
      },
    ],
  });

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/product/get");
        if (response.data.success) {
          setServices(response.data.products);
        } else {
          setError("Failed to load services.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch services.");
      }
    };

    fetchServices();
  }, []);

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Handle main form input changes
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setProductData((prev) => ({ ...prev, [name]: value }));

      // Auto-generate slug when title changes
      if (name === "Title") {
        setProductData((prev) => ({ ...prev, slug: generateSlug(value) }));
      }

      if (name === "category") {
        const filtered = services.filter(
          (service) => service.category === value
        );
        setFilteredServices(filtered);

        if (filtered.length === 0) {
          setNoServicesMessage("No services available for this category.");
        } else {
          setNoServicesMessage("");
        }
      }
    },
    [services]
  );

  // Validate image dimensions (16:9 aspect ratio with 0.5% tolerance)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          const width = this.width;
          const height = this.height;
          const aspectRatio = width / height;
          const targetRatio = 16 / 9;
          const tolerance = 0.005; // 0.5% tolerance

          if (Math.abs(aspectRatio - targetRatio) <= tolerance) {
            resolve({ width, height, aspectRatio });
          } else {
            reject({
              message: `Image must have a 16:9 aspect ratio. Current ratio is ${aspectRatio.toFixed(
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

  // Handle main image upload with dimension validation
  const handleMainImageChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
        setError("Only image files are allowed!");
        return;
      }

      try {
        // Validate image dimensions (16:9)
        await validateImageDimensions(file);

        setProductData((prev) => ({ ...prev, image: file }));

        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setMainImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(err.message);
        customToast({
          success: false,
          message: "Image must have a 16:9 aspect ratio",
        });
        e.target.value = "";
      }
    },
    [customToast]
  );

  // Section management
  const addSection = useCallback(() => {
    setProductData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          image: null,
          imagePreview: null,
          points: [{ title: "", detail: "" }],
        },
      ],
    }));
  }, []);

  const removeSection = useCallback((index) => {
    setProductData((prev) => {
      if (prev.sections.length <= 1) {
        setError("At least one section is required");
        return prev;
      }

      const updatedSections = prev.sections.filter((_, i) => i !== index);
      return { ...prev, sections: updatedSections };
    });
  }, []);

  const handleSectionChange = useCallback((sectionIndex, field, value) => {
    setProductData((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        [field]: value,
      };
      return { ...prev, sections: updatedSections };
    });
  }, []);

  // Handle section image change with dimension validation
  const handleSectionImageChange = useCallback(
    async (sectionIndex, e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
        setError("Only image files are allowed!");
        return;
      }

      try {
        // Validate image dimensions (16:9)
        await validateImageDimensions(file);

        // Create preview and update state
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductData((prev) => {
            const updatedSections = [...prev.sections];
            updatedSections[sectionIndex] = {
              ...updatedSections[sectionIndex],
              image: file,
              imagePreview: reader.result,
            };
            return { ...prev, sections: updatedSections };
          });
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(err.message);
        customToast({
          success: false,
          message: "Image must have a 16:9 aspect ratio",
        });
        e.target.value = "";
      }
    },
    [customToast]
  );

  const moveSection = useCallback((fromIndex, toIndex) => {
    setProductData((prev) => {
      const updatedSections = [...prev.sections];
      const [movedItem] = updatedSections.splice(fromIndex, 1);
      updatedSections.splice(toIndex, 0, movedItem);
      return { ...prev, sections: updatedSections };
    });
  }, []);

  // Point management
  const addPoint = useCallback((sectionIndex) => {
    setProductData((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        points: [
          ...updatedSections[sectionIndex].points,
          { title: "", detail: "" },
        ],
      };
      return { ...prev, sections: updatedSections };
    });
  }, []);

  const removePoint = useCallback((sectionIndex, pointIndex) => {
    setProductData((prev) => {
      const section = prev.sections[sectionIndex];

      if (section.points.length <= 1) {
        setError("At least one point is required in a section");
        return prev;
      }

      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...section,
        points: section.points.filter((_, i) => i !== pointIndex),
      };

      return { ...prev, sections: updatedSections };
    });
  }, []);

  const handlePointChange = useCallback(
    (sectionIndex, pointIndex, field, value) => {
      setProductData((prev) => {
        const updatedSections = [...prev.sections];
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          points: updatedSections[sectionIndex].points.map((point, idx) =>
            idx === pointIndex ? { ...point, [field]: value } : point
          ),
        };
        return { ...prev, sections: updatedSections };
      });
    },
    []
  );

  // Updated form validation including slug and itemsTag check
  const validateForm = useCallback(() => {
    // Check main Product fields
    if (!productData.Title || !productData.Title.trim()) {
      setError("Product title is required");
      return false;
    }

    if (!productData.detail || !productData.detail.trim()) {
      setError("Product detail is required");
      return false;
    }

    if (!productData.moreDetail || !productData.moreDetail.trim()) {
      setError("Product more detail is required");
      return false;
    }

    if (!productData.slug || !productData.slug.trim()) {
      setError("Slug is required");
      return false;
    }

    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productData.slug)) {
      setError(
        "Slug must be lowercase, containing only letters, numbers, and hyphens"
      );
      return false;
    }

    // Validate itemsTag (simple string validation)
    if (!productData.itemsTag || !productData.itemsTag.trim()) {
      setError("Item tag is required");
      return false;
    }

    if (!productData.category) {
      setError("Please select a category");
      return false;
    }

    if (!productData.image) {
      setError("Main Product image is required");
      return false;
    }

    // Validate sections
    for (const [i, section] of productData.sections.entries()) {
      if (!section.title || !section.title.trim()) {
        setError(`Section ${i + 1} title is required`);
        return false;
      }

      if (!section.image && !section.imagePreview) {
        setError(`Image is required for section ${i + 1}`);
        return false;
      }

      // Validate points
      for (const [j, point] of section.points.entries()) {
        if (!point.title || !point.title.trim()) {
          setError(`Title is required for point ${j + 1} in section ${i + 1}`);
          return false;
        }

        if (!point.detail || !point.detail.trim()) {
          setError(`Detail is required for point ${j + 1} in section ${i + 1}`);
          return false;
        }
      }
    }

    setError("");
    return true;
  }, [productData]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const createProduct = async () => {
      if (!validateForm()) {
        return;
      }

      setLoading(true);

      try {
        // Prepare form data for submission
        const submitFormData = new FormData();

        // Add basic Product fields
        submitFormData.append("Title", productData.Title);
        submitFormData.append("detail", productData.detail);
        submitFormData.append("moreDetail", productData.moreDetail);
        submitFormData.append("slug", productData.slug);
        submitFormData.append("itemsTag", productData.itemsTag); // Simple string field
        submitFormData.append("category", productData.category);

        // Add main image
        submitFormData.append("mainImage", productData.image);

        // Prepare sections data without images
        const sectionsData = productData.sections.map((section) => ({
          title: section.title,
          image: section.imagePreview || "", // Temporary placeholder
          useUploadedImage: !!section.image, // Flag to tell backend this section has an uploaded image
          points: section.points,
        }));

        submitFormData.append("sections", JSON.stringify(sectionsData));

        // Append all section images
        productData.sections.forEach((section, index) => {
          if (section.image) {
            submitFormData.append("sectionImages", section.image);
          }
        });

        // Submit the form
        const response = await axios.post("/api/child/create", submitFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        customToast({
          success: true,
          message: "Product created successfully!",
        });

        // Reset form or redirect
        setTimeout(() => {
          router.push("/admin/products");
        }, 2000);
      } catch (error) {
        console.error("Error creating Product:", error);
        customToast({
          success: false,
          message: error.response?.data?.message || "Failed to create Product",
        });
      } finally {
        setLoading(false);
      }
    };

    setShowConfirm("Are you sure you want to create this Product?");
    setConfirmFunction(() => createProduct);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-full bg-[#446E6D]/10 hover:bg-[#446E6D]/20 text-[#446E6D] transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-bold text-[#446E6D]">
                Create New Product
              </h1>
            </div>

            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center px-6 py-3 rounded-lg text-white font-medium ${
                loading
                  ? "bg-[#446E6D]/70"
                  : "bg-[#446E6D] hover:bg-[#446E6D]/90"
              } transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              {loading ? (
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
                <>
                  <CheckCircle className="mr-2" size={20} />
                  Create Product
                </>
              )}
            </motion.button>
          </header>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <form className="space-y-8">
              {/* Product Main Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image Upload */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Product Image
                  </h2>
                  <div className="mb-6">
                    <input
                      id="mainImage"
                      name="mainImage"
                      type="file"
                      onChange={handleMainImageChange}
                      className="hidden"
                      accept="image/*"
                      ref={mainImageRef}
                    />

                    {!mainImagePreview ? (
                      <div
                        onClick={() => mainImageRef.current?.click()}
                        className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-[#446E6D]/30 rounded-xl cursor-pointer bg-[#446E6D]/5 hover:bg-[#446E6D]/10 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center py-8">
                          <Upload className="text-[#446E6D] mb-3" size={48} />
                          <p className="text-base font-medium text-[#446E6D] mb-1">
                            Click to upload Product image (16:9)
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG or GIF (Max 10MB)
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                        <img
                          src={mainImagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProductData((prev) => ({
                              ...prev,
                              image: null,
                            }));
                            setMainImagePreview(null);
                            if (mainImageRef.current)
                              mainImageRef.current.value = "";
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 shadow-md transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        htmlFor="category"
                      >
                        Service*
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] bg-white shadow-sm"
                      >
                        <option value="">Select a service</option>
                        {services?.map((service) => (
                          <option key={service?._id} value={service?._id}>
                            {service?.Title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Product Details
                  </h2>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="Title"
                    >
                      Product Title*
                    </label>
                    <input
                      id="Title"
                      name="Title"
                      type="text"
                      value={productData.Title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] shadow-sm"
                      placeholder="Enter Product title"
                    />
                  </div>

                  {/* Slug field */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="slug"
                    >
                      Slug*{" "}
                      <span className="text-xs text-gray-500">
                        (URL-friendly name, auto-generated but editable)
                      </span>
                    </label>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      value={productData.slug}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] shadow-sm"
                      placeholder="product-name-example"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Only lowercase letters, numbers, and hyphens. Used in
                      URLs: /product/{productData.slug || "example-slug"}
                    </p>
                  </div>

                  {/* Item Tag field - Simple string input */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="itemsTag"
                    >
                      Item Tag*
                    </label>
                    <input
                      id="itemsTag"
                      name="itemsTag"
                      type="text"
                      value={productData.itemsTag}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] shadow-sm"
                      placeholder="Enter item tag (e.g., web-design, mobile-app, branding)"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter a single tag that describes this product
                    </p>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="detail"
                    >
                      Short Description*
                    </label>
                    <textarea
                      id="detail"
                      name="detail"
                      value={productData.detail}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] shadow-sm"
                      placeholder="Brief description of the Product"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor="moreDetail"
                    >
                      Full Description*
                    </label>
                    <textarea
                      id="moreDetail"
                      name="moreDetail"
                      value={productData.moreDetail}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] shadow-sm"
                      placeholder="Detailed description of the Product"
                    />
                  </div>
                </div>
              </div>

              {/* Product Sections */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="bg-[#446E6D]/10 text-[#446E6D] w-8 h-8 rounded-full inline-flex items-center justify-center mr-2">
                      <span>{productData.sections.length}</span>
                    </span>
                    Product Sections
                  </h2>
                  <motion.button
                    type="button"
                    onClick={addSection}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#446E6D] text-white hover:bg-[#446E6D]/90 transition-all duration-200 font-medium shadow-sm"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Section
                  </motion.button>
                </div>

                <div className="space-y-8">
                  <AnimatePresence>
                    {productData.sections.map((section, sectionIndex) => (
                      <SectionItem
                        key={sectionIndex}
                        section={section}
                        index={sectionIndex}
                        handleSectionChange={handleSectionChange}
                        handleSectionImageChange={handleSectionImageChange}
                        handlePointChange={handlePointChange}
                        addPoint={addPoint}
                        removePoint={removePoint}
                        removeSection={removeSection}
                        moveSection={moveSection}
                        totalSections={productData.sections.length}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

const SectionItem = React.memo(
  ({
    section,
    index,
    handleSectionChange,
    handleSectionImageChange,
    handlePointChange,
    addPoint,
    removePoint,
    removeSection,
    moveSection,
    totalSections,
  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "SECTION",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const [, drop] = useDrop(() => ({
      accept: "SECTION",
      hover: (item) => {
        if (item.index !== index) {
          moveSection(item.index, index);
          item.index = index;
        }
      },
    }));

    const sectionImageRef = useRef(null);

    return (
      <motion.div
        ref={(node) => drag(drop(node))}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`relative rounded-xl ${
          isDragging
            ? "border-2 border-[#446E6D] shadow-lg"
            : "border border-gray-200"
        } bg-white shadow-sm overflow-hidden`}
        style={{
          opacity: isDragging ? 0.7 : 1,
          transform: isDragging ? "scale(1.02)" : "scale(1)",
        }}
      >
        {/* Section Header */}
        <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="cursor-move mr-3 text-[#446E6D] hover:text-[#446E6D]/80 transition-colors">
            <GripVertical size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Section {index + 1}
            {section.title && (
              <span className="ml-2 text-sm text-gray-500">
                ({section.title})
              </span>
            )}
          </h3>
          <div className="ml-auto">
            {totalSections > 1 && (
              <motion.button
                type="button"
                onClick={() => removeSection(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
              >
                <Trash2 size={18} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Section Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <label
                htmlFor={`section-title-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Section Title*
              </label>
              <input
                id={`section-title-${index}`}
                type="text"
                value={section.title}
                onChange={(e) =>
                  handleSectionChange(index, "title", e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] shadow-sm"
                placeholder="Enter section title"
              />
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Image*{" "}
                <span className="text-xs text-gray-500">
                  (16:9 ratio required)
                </span>
              </label>
              <div className="relative">
                <input
                  id={`section-image-${index}`}
                  type="file"
                  onChange={(e) => handleSectionImageChange(index, e)}
                  className="hidden"
                  accept="image/*"
                  ref={sectionImageRef}
                />

                {!section.imagePreview ? (
                  <div
                    onClick={() => sectionImageRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#446E6D]/30 rounded-lg cursor-pointer bg-[#446E6D]/5 hover:bg-[#446E6D]/10 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center py-4">
                      <ImageIcon className="text-[#446E6D] mb-2" size={32} />
                      <p className="text-sm font-medium text-[#446E6D]">
                        Click to upload section image (16:9)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={section.imagePreview}
                      alt={`Section ${index + 1} preview`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleSectionChange(index, "image", null);
                        handleSectionChange(index, "imagePreview", null);
                        if (sectionImageRef.current)
                          sectionImageRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 shadow-md transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Points Section */}
          <div className="mt-8 border-t border-gray-100 pt-5">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-medium text-gray-700 flex items-center">
                <span className="bg-[#446E6D]/10 text-[#446E6D] w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs">
                  {section.points.length}
                </span>
                Key Points
              </h4>
              <motion.button
                type="button"
                onClick={() => addPoint(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#446E6D]/10 text-[#446E6D] hover:bg-[#446E6D]/20 transition-all duration-200"
              >
                <Plus size={16} className="mr-1" />
                Add Point
              </motion.button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {section.points.map((point, pointIndex) => (
                  <motion.div
                    key={pointIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#446E6D]/30 transition-colors"
                  >
                    <div>
                      <label
                        htmlFor={`point-title-${index}-${pointIndex}`}
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Point Title*
                      </label>
                      <input
                        id={`point-title-${index}-${pointIndex}`}
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
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                        placeholder="Enter point title"
                      />
                    </div>

                    <div className="relative">
                      <div className="flex justify-between items-center">
                        <label
                          htmlFor={`point-detail-${index}-${pointIndex}`}
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          Point Detail*
                        </label>
                        {section.points.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePoint(index, pointIndex)}
                            className="p-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <textarea
                        id={`point-detail-${index}-${pointIndex}`}
                        value={point.detail}
                        onChange={(e) =>
                          handlePointChange(
                            index,
                            pointIndex,
                            "detail",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                        rows={2}
                        placeholder="Enter point detail"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Section Footer */}
        <div className="bg-[#446E6D]/5 p-3 text-xs text-[#446E6D] flex items-start">
          <Info size={14} className="mr-1.5 flex-shrink-0 mt-0.5" />
          <span>
            Drag to reorder. Each section requires a title, image (16:9 ratio)
            and at least one point.
          </span>
        </div>
      </motion.div>
    );
  }
);

SectionItem.displayName = "SectionItem";
