"use client";
import Image from "next/image";
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
import RelatedItemsSelector from "./components/RelatedItemsSelector";
import ImageUploader from "@/components/website/components/ImageUploader";

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
  });

  const [relatedItems, setRelatedItems] = useState({
    relatedServices: [],
    relatedSuccessStory: [],
    relatedProducts: [],
    relatedChikfdServices: [],
    relatedProjects: [],
  });

  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { customToast } = useContext(MyContext) || {
    customToast: (msg) => console.log(msg),
  };

  // Fetch industries on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const industriesRes = await axios.get("/api/industry/get");
        setIndustries(industriesRes.data.industries || []);
        setFilteredIndustries(industriesRes.data.industries || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load industries. Please refresh the page.");
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
    });    // Set related items from the industry data
    setRelatedItems({
      relatedServices: Array.isArray(industry.relatedServices)
        ? industry.relatedServices.map((service) =>
          typeof service === "object" ? service._id : service
        )
        : [],
      relatedSuccessStory: Array.isArray(industry.relatedSuccessStory)
        ? industry.relatedSuccessStory.map((story) =>
          typeof story === "object" ? story._id : story
        )
        : [],
      relatedProducts: Array.isArray(industry.relatedProducts)
        ? industry.relatedProducts.map((product) =>
          typeof product === "object" ? product._id : product
        )
        : [],
      relatedChikfdServices: Array.isArray(industry.relatedChikfdServices)
        ? industry.relatedChikfdServices.map((service) =>
          typeof service === "object" ? service._id : service
        )
        : [],
      relatedProjects: Array.isArray(industry.relatedProjects)
        ? industry.relatedProjects.map((project) =>
          typeof project === "object" ? project._id : project
        )
        : [],
    });

    // Set image and logo previews
    setImagePreview(industry.image);
    setLogoPreview(industry.logo);
    setImage(null);
    setLogo(null);
    setImageUrl(null);
    setLogoUrl(null);
    setError("");
    setSuccess(false);
  };

  // Handle related items changes
  const handleRelatedItemsChange = (newRelatedItems) => {
    setRelatedItems(newRelatedItems);
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

  // Handle image upload via ImageUploader
  const handleImageUpload = (url, preview) => {
    setImageUrl(url);
    setImagePreview(preview);
    setError("");
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

  // Handle logo upload via ImageUploader
  const handleLogoUpload = (url, preview) => {
    setLogoUrl(url);
    setLogoPreview(preview);
    setError("");
  };

  const handleLogoRemove = () => {
    setLogoUrl(null);
    setLogoPreview(null);
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

    // Prepare JSON payload
    const payload = {
      id: selectedIndustry._id,
      Title: formData.Title,
      Heading: formData.Heading,
      detail: formData.detail,
      Efficiency: formData.Efficiency || 0,
      costSaving: formData.costSaving || 0,
      customerSatisfaction: formData.customerSatisfaction || 0,
    };

    // Include new image URL if changed
    if (imageUrl) {
      payload.image = imageUrl;
    }

    // Include new logo URL if changed
    if (logoUrl) {
      payload.logo = logoUrl;
    }

    // Add related items if any exist
    Object.keys(relatedItems).forEach((key) => {
      if (relatedItems[key] && relatedItems[key].length > 0) {
        payload[key] = relatedItems[key];
      }
    });

    try {
      const response = await axios.post("/api/industry/edit", payload, {
        headers: { "Content-Type": "application/json" },
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
    setSelectedIndustry(null);
    setImageUrl(null);
    setLogoUrl(null);
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

              {/* Related Items Selector */}
              <RelatedItemsSelector
                relations={['services', 'testimonials', 'products', 'childServices', 'projects']}
                value={relatedItems}
                onChange={handleRelatedItemsChange}
                disabled={loading}
                isMultiple={true}
              />
            </div>

            {/* Right Column - Images and Metrics */}
            <div className="space-y-6">
              {/* Image Upload Component */}
              <ImageUploader
                method="url"
                mediaType="image"
                onImageChange={handleImageUpload}
                onImageRemove={handleImageRemove}
                preview={imagePreview}
                label="Industry Image"
                maxSize={10}
                aspectRatio={null}
              />

              {/* Logo Upload Component */}
              <ImageUploader
                method="url"
                mediaType="image"
                onImageChange={handleLogoUpload}
                onImageRemove={handleLogoRemove}
                preview={logoPreview}
                label="Industry Logo"
                maxSize={10}
                aspectRatio={null}
              />

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
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${loading || success
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
                    <Image
                      src={industry.image || "/placeholder.jpg"}
                      alt={industry.Title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="relative w-12 h-12">
                        <Image
                          src={industry.logo || "/placeholder-logo.png"}
                          alt={`${industry.Title} logo`}
                          fill
                          sizes="48px"
                          className="object-contain bg-white rounded-md shadow-md"
                        />
                      </div>
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
                      {industry.relatedService &&
                        Array.isArray(industry.relatedService) &&
                        industry.relatedService.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {industry.relatedService
                              .slice(0, 2)
                              .map((service, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {typeof service === "object" && service.Title
                                    ? service.Title
                                    : "Service"}
                                </span>
                              ))}
                            {industry.relatedService.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{industry.relatedService.length - 2} more
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