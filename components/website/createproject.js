"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, PlusCircle, X, Film, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RelatedItemsSelector from "@/components/website/components/RelatedItemsSelector";
import ImageUploader from "@/components/website/components/ImageUploader";

export default function CreateProject() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    Title: "",
    detail: "",
    slug: "",
    mediaType: "image", // Default to image
    mediaUrl: null, // Junk URL instead of File object
    relatedServices: [], // Changed to array
    relatedIndustries: [], // Added
    relatedProducts: [], // Added
    relatedChikfdServices: [], // Added
    sections: [
      {
        title: "",
        imageUrl: null, // Junk URL for section image
        points: [{ title: "", detail: "" }],
      },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);

  // Arrays for section image URLs and previews
  const [sectionImageUrls, setSectionImageUrls] = useState([null]);
  const [sectionPreviews, setSectionPreviews] = useState([null]);

  const handleRelatedItemsChange = (relatedItems) => {
    setFormValues((prev) => ({
      ...prev,
      relatedServices: relatedItems.relatedServices || [],
      relatedIndustries: relatedItems.relatedIndustries || [],
      relatedProducts: relatedItems.relatedProducts || [],
      relatedChikfdServices: relatedItems.relatedChikfdServices || [],
    }));
  };

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
  };

  // Handle main media upload
  const handleMediaUpload = (file, preview, junkUrl) => {
    setFormValues((prev) => ({ ...prev, mediaUrl: junkUrl }));
    setMediaPreview(preview);
    setError("");
  };

  // Handle main media removal
  const handleMediaRemove = () => {
    setFormValues((prev) => ({ ...prev, mediaUrl: null }));
    setMediaPreview(null);
  };

  // Handle section image upload
  const handleSectionImageUpload = (sectionIndex, file, preview, junkUrl) => {
    const updatedUrls = [...sectionImageUrls];
    updatedUrls[sectionIndex] = junkUrl;
    setSectionImageUrls(updatedUrls);

    const updatedPreviews = [...sectionPreviews];
    updatedPreviews[sectionIndex] = preview;
    setSectionPreviews(updatedPreviews);

    setError("");
  };

  // Handle section image removal
  const handleSectionImageRemove = (sectionIndex) => {
    const updatedUrls = [...sectionImageUrls];
    updatedUrls[sectionIndex] = null;
    setSectionImageUrls(updatedUrls);

    const updatedPreviews = [...sectionPreviews];
    updatedPreviews[sectionIndex] = null;
    setSectionPreviews(updatedPreviews);
  };
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
          `Image must have a 16:9 aspect ratio. Current ratio is ${dimensionError.dimensions?.width
          }x${dimensionError.dimensions?.height
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
        imageUrl: null,
        points: [{ title: "", detail: "" }],
      },
    ],
  }));

  // Add null entry for section image URL and preview
  setSectionImageUrls([...sectionImageUrls, null]);
  setSectionPreviews([...sectionPreviews, null]);
};

// Remove a section
const removeSection = (index) => {
  // Remove section from all state
  setFormValues({
    ...formValues,
    sections: formValues.sections.filter((_, i) => i !== index),
  });

  setSectionImageUrls([
    ...sectionImageUrls.slice(0, index),
    ...sectionImageUrls.slice(index + 1),
  ]);

  setSectionPreviews([
    ...sectionPreviews.slice(0, index),
    ...sectionPreviews.slice(index + 1),
  ]);
};

// Handle section title changes
const handleSectionTitleChange = (index, value) => {
  const updatedSections = [...formValues.sections];
  updatedSections[index].title = value;
  setFormValues({ ...formValues, sections: updatedSections });
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

// Form validation
const validateForm = () => {
  if (
    !formValues.Title ||
    !formValues.detail ||
    !formValues.slug ||
    !formValues.mediaUrl
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
    formValues.relatedIndustries.length === 0 &&
    formValues.relatedProducts.length === 0 &&
    formValues.relatedChikfdServices.length === 0
  ) {
    setError(
      "Please select at least one related service, industry, product, or child service"
    );
    return false;
  }

  // Validate sections
  for (const [sectionIndex, section] of formValues.sections.entries()) {
    // Check if section has image
    const hasSectionImage = sectionImageUrls[sectionIndex];

    if (!section.title || !hasSectionImage || section.points.length === 0) {
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

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!validateForm()) return;

  setSaving(true);

  try {
    // Prepare sections with image URLs
    const sections = formValues.sections.map((section, index) => ({
      title: section.title,
      image: sectionImageUrls[index], // Junk URL from ImageUploader
      points: section.points,
    }));

    // Prepare payload with junk URLs instead of File objects
    const payload = {
      Title: formValues.Title,
      detail: formValues.detail,
      slug: formValues.slug,
      mediaType: formValues.mediaType,
      mediaUrl: formValues.mediaUrl, // Junk URL from ImageUploader
      relatedServices: formValues.relatedServices,
      relatedIndustries: formValues.relatedIndustries,
      relatedProducts: formValues.relatedProducts,
      relatedChikfdServices: formValues.relatedChikfdServices,
      sections: sections,
    };

    const response = await axios.post("/api/project/create", payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      timeout: 60000,
    });

    if (response.status === 201) {
      setSuccess("Project created successfully!");
      toast.success("Project created successfully!");

      // Reset form after successful submission
      setFormValues({
        Title: "",
        detail: "",
        slug: "",
        mediaType: "image",
        mediaUrl: null,
        relatedServices: [],
        relatedIndustries: [],
        relatedProducts: [],
        relatedChikfdServices: [],
        sections: [
          {
            title: "",
            imageUrl: null,
            points: [{ title: "", detail: "" }],
          },
        ],
      });
      setMediaPreview(null);
      setSectionImageUrls([null]);
      setSectionPreviews([null]);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin/projects");
      }, 2000);
    }
  } catch (err) {
    console.error("Error creating project:", err);
    setError(err.response?.data?.message || "Error creating project");
    toast.error(err.response?.data?.message || "Error creating project");
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

          {/* Related Items Selector */}
          <RelatedItemsSelector
            relations={[
              "services",
              "industries",
              "products",
              "childServices",
            ]}
            value={{
              relatedServices: formValues.relatedServices,
              relatedIndustries: formValues.relatedIndustries,
              relatedProducts: formValues.relatedProducts,
              relatedChikfdServices: formValues.relatedChikfdServices,
            }}
            onChange={handleRelatedItemsChange}
            disabled={false}
            isMultiple={true}
          />

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
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${formValues.mediaType === "image"
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
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${formValues.mediaType === "video"
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
            <ImageUploader
              method="url"
              mediaType={formValues.mediaType === "image" ? "image" : "video"}
              aspectRatio={formValues.mediaType === "image" ? "16:9" : null}
              label={`Project ${formValues.mediaType === "image" ? "Image" : "Video"}`}
              preview={mediaPreview}
              onImageChange={handleMediaUpload}
              onImageRemove={handleMediaRemove}
              maxSize={formValues.mediaType === "image" ? 10 : 50}
              disabled={saving}
            />
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
                  <ImageUploader
                    method="url"
                    mediaType="image"
                    aspectRatio="16:9"
                    label="Section Image"
                    preview={sectionPreviews[sectionIndex]}
                    onImageChange={(file, preview, junkUrl) =>
                      handleSectionImageUpload(sectionIndex, file, preview, junkUrl)
                    }
                    onImageRemove={() => handleSectionImageRemove(sectionIndex)}
                    maxSize={10}
                    disabled={saving}
                  />
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
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${saving ? "opacity-75 cursor-not-allowed" : ""
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
