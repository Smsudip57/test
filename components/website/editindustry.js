"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Search,
  Edit,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { MyContext } from "@/context/context";

const EditIndustry = () => {
  const [industries, setIndustries] = useState([]);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    Title: "",
    Heading: "",
    detail: "",
    Efficiency: 0,
    costSaving: 0,
    customerSatisfaction: 0,
    relatedProduct: [],
  });

  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  const { customToast } = useContext(MyContext) || {
    customToast: (msg) => console.log(msg),
  };

  const imageInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // Fetch industries and products on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [industriesRes, productsRes] = await Promise.all([
          axios.get("/api/industry/get"),
          axios.get("/api/product/get"),
        ]);

        setIndustries(industriesRes.data.industries || []);
        setFilteredIndustries(industriesRes.data.industries || []);
        setProducts(productsRes.data.products || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(
          "Failed to load industries and products. Please refresh the page."
        );
        customToast({
          success: false,
          message: "Failed to load data",
        });
      }
    };

    fetchData();
  }, [customToast]);

  // Filter industries based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredIndustries(industries);
      return;
    }

    const filtered = industries.filter(
      (industry) =>
        industry.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        industry.detail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredIndustries(filtered);
  }, [searchTerm, industries]);

  // Handle selection of an industry to edit
  const handleEdit = (industry) => {
    setSelectedIndustry(industry);
    setFormData({
      Title: industry.Title || "",
      Heading: industry.Heading || "",
      detail: industry.detail || "",
      Efficiency: industry.Efficiency || 0,
      costSaving: industry.costSaving || 0,
      customerSatisfaction: industry.customerSatisfaction || 0,
      relatedProduct: Array.isArray(industry.relatedProduct)
        ? industry.relatedProduct.map((product) =>
            typeof product === "object" ? product._id : product
          )
        : industry.relatedProduct
        ? [
            typeof industry.relatedProduct === "object"
              ? industry.relatedProduct._id
              : industry.relatedProduct,
          ]
        : [],
    });

    // Set image and logo previews
    setImagePreview(industry.image);
    setLogoPreview(industry.logo);
    setImage(null);
    setLogo(null);
    setError("");
    setSuccess(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (
      name === "Efficiency" ||
      name === "costSaving" ||
      name === "customerSatisfaction"
    ) {
      // Ensure value is between 0 and 100
      const numValue = Math.min(Math.max(0, Number(value)), 100);
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle product selection (multi-select)
  const handleProductSelection = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      relatedProduct: selectedOptions,
    }));
  };

  // Handle image changes with preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      setError("Please select a valid image file");
      customToast({
        success: false,
        message: "Only image files are allowed!",
      });
      return;
    }

    // Revoke previous objectURL to prevent memory leaks
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  // Handle logo changes with preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      setError("Please select a valid image file for the logo");
      customToast({
        success: false,
        message: "Only image files are allowed!",
      });
      return;
    }

    // Revoke previous objectURL to prevent memory leaks
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
    setError("");
  };

  // Clear image or logo
  const clearImage = (type) => {
    if (type === "image") {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImage(null);
      setImagePreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
    } else if (type === "logo") {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogo(null);
      setLogoPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // Form validation
  const validateForm = () => {
    if (!formData.Title.trim()) {
      setError("Title is required");
      return false;
    }

    if (!formData.Heading.trim()) {
      setError("Heading is required");
      return false;
    }

    if (!formData.detail.trim()) {
      setError("Detail is required");
      return false;
    }

    return true;
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      customToast({
        success: false,
        message: error,
      });
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const data = new FormData();

    // Append all form fields
    data.append("id", selectedIndustry._id);
    data.append("Title", formData.Title);
    data.append("Heading", formData.Heading);
    data.append("detail", formData.detail);
    data.append("Efficiency", formData.Efficiency || 0);
    data.append("costSaving", formData.costSaving || 0);
    data.append("customerSatisfaction", formData.customerSatisfaction || 0);

    // Append related products (can be multiple)
    if (formData.relatedProduct && formData.relatedProduct.length > 0) {
      formData.relatedProduct.forEach((productId) => {
        data.append("relatedProduct", productId);
      });
    }

    // Append files if they exist
    if (image) data.append("image", image);
    if (logo) data.append("logo", logo);

    try {
      const response = await axios.post("/api/industry/edit", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.status === 200) {
        setSuccess(true);
        customToast({
          success: true,
          message: "Industry updated successfully!",
        });

        // Update the local industries list
        setIndustries((prev) =>
          prev.map((item) =>
            item._id === selectedIndustry._id
              ? response.data.updatedIndustry
              : item
          )
        );

        // Clear form after 2 seconds
        setTimeout(() => {
          setSelectedIndustry(null);
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to update industry:", error);
      setError("Failed to update industry. Please try again.");
      customToast({
        success: false,
        message: error.response?.data?.message || "Failed to update industry",
      });
    } finally {
      setLoading(false);
    }
  };

  // Return to the list view
  const handleCancel = () => {
    // Clean up any blob URLs
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }

    setSelectedIndustry(null);
    setImage(null);
    setLogo(null);
    setError("");
    setSuccess(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {selectedIndustry ? (
        /* Edit Form */
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-[#446E6D] transition-colors"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span>Back to Industries</span>
            </button>
            <h2 className="text-2xl font-bold text-center text-[#446E6D]">
              Edit Industry: {selectedIndustry.Title}
            </h2>
            <div className="w-28"></div> {/* Spacer for centering the title */}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start">
              <CheckCircle2 className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-green-700">Industry updated successfully!</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left Column - Text Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                  placeholder="Enter industry title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading *
                </label>
                <input
                  type="text"
                  name="Heading"
                  value={formData.Heading}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                  placeholder="Enter industry heading"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detail *
                </label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                  rows="5"
                  placeholder="Enter industry details"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Child Services
                </label>
                <div className="mb-3">
                  {formData.relatedProduct.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.relatedProduct.map((productId) => {
                        const product = products.find(
                          (p) => p._id === productId
                        );
                        return (
                          <span
                            key={productId}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {product?.Title || "Product"}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  relatedProduct: prev.relatedProduct.filter(
                                    (id) => id !== productId
                                  ),
                                }));
                              }}
                              className="ml-2 inline-flex text-blue-500 hover:text-blue-700"
                            >
                              <X size={16} />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto bg-white">
                    <div className="mb-2">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          // You can implement product filtering here if needed
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      {products.map((product) => (
                        <div key={product._id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`product-${product._id}`}
                            checked={formData.relatedProduct.includes(
                              product._id
                            )}
                            onChange={() => {
                              setFormData((prev) => {
                                if (prev.relatedProduct.includes(product._id)) {
                                  return {
                                    ...prev,
                                    relatedProduct: prev.relatedProduct.filter(
                                      (id) => id !== product._id
                                    ),
                                  };
                                } else {
                                  return {
                                    ...prev,
                                    relatedProduct: [
                                      ...prev.relatedProduct,
                                      product._id,
                                    ],
                                  };
                                }
                              });
                            }}
                            className="h-4 w-4 text-[#446E6D] border-gray-300 rounded focus:ring-[#446E6D]"
                          />
                          <label
                            htmlFor={`product-${product._id}`}
                            className="ml-2 block text-sm text-gray-700 cursor-pointer hover:text-[#446E6D]"
                          >
                            {product.Title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.relatedProduct.length === 0
                    ? "No products selected"
                    : `${formData.relatedProduct.length} product${
                        formData.relatedProduct.length > 1 ? "s" : ""
                      } selected`}
                </p>
              </div>
            </div>

            {/* Right Column - Images and Metrics */}
            <div className="space-y-6">
              {/* Image Upload with Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Image
                </label>
                <div className="relative border-2 border-dashed border-[#446E6D]/30 rounded-lg p-4 text-center hover:bg-[#446E6D]/5 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="bg-white rounded-full p-2 m-1 shadow-md"
                        >
                          <Upload size={16} className="text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={() => clearImage("image")}
                          className="bg-white rounded-full p-2 m-1 shadow-md text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                      <ImageIcon className="h-12 w-12 text-[#446E6D]" />
                      <p className="mt-2 text-sm font-medium text-[#446E6D]">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Logo Upload with Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Logo
                </label>
                <div className="relative border-2 border-dashed border-[#446E6D]/30 rounded-lg p-4 text-center hover:bg-[#446E6D]/5 transition-colors">
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-full h-40 object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="bg-white rounded-full p-2 m-1 shadow-md"
                        >
                          <Upload size={16} className="text-gray-700" />
                        </button>
                        <button
                          type="button"
                          onClick={() => clearImage("logo")}
                          className="bg-white rounded-full p-2 m-1 shadow-md text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                      <ImageIcon className="h-12 w-12 text-[#446E6D]" />
                      <p className="mt-2 text-sm font-medium text-[#446E6D]">
                        Click to upload a logo
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Metrics Inputs */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Efficiency ({formData.Efficiency}%)
                  </label>
                  <input
                    type="range"
                    name="Efficiency"
                    min="0"
                    max="100"
                    value={formData.Efficiency}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#446E6D]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Saving ({formData.costSaving}%)
                  </label>
                  <input
                    type="range"
                    name="costSaving"
                    min="0"
                    max="100"
                    value={formData.costSaving}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#446E6D]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Satisfaction ({formData.customerSatisfaction}%)
                  </label>
                  <input
                    type="range"
                    name="customerSatisfaction"
                    min="0"
                    max="100"
                    value={formData.customerSatisfaction}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#446E6D]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button - Full Width */}
            <div className="col-span-1 md:col-span-2 mt-6">
              <motion.button
                type="submit"
                disabled={loading || success}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                  loading || success
                    ? "bg-[#446E6D]/70 cursor-not-allowed"
                    : "bg-[#446E6D] hover:bg-[#375857] transition-colors"
                } shadow-md flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Updating Industry...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="mr-2" size={20} />
                    Updated Successfully
                  </>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      ) : (
        /* Industry List */
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center text-[#446E6D]">
            Industry Manager
          </h2>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          {/* Industries List */}
          {filteredIndustries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIndustries.map((industry) => (
                <motion.div
                  key={industry._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    <img
                      src={industry.image || "/placeholder.jpg"}
                      alt={industry.Title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <img
                        src={industry.logo || "/placeholder-logo.png"}
                        alt={`${industry.Title} logo`}
                        className="w-12 h-12 object-contain bg-white rounded-md shadow-md"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                      {industry.Title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {industry.detail}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {industry.relatedProduct &&
                        Array.isArray(industry.relatedProduct) &&
                        industry.relatedProduct.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {industry.relatedProduct
                              .slice(0, 2)
                              .map((product, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {typeof product === "object" && product.Title
                                    ? product.Title
                                    : "Product"}
                                </span>
                              ))}
                            {industry.relatedProduct.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{industry.relatedProduct.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="flex space-x-3 mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Efficiency</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${industry.Efficiency || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                          Cost Saving
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${industry.costSaving || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEdit(industry)}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 bg-[#446E6D] text-white rounded-md hover:bg-[#375857] transition-colors"
                    >
                      <Edit size={16} />
                      Edit Industry
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-2">No industries found.</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your search or add a new industry.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditIndustry;
