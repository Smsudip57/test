"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Loader2,
  Plus,
  Trash2,
  Save,
  Tag,
  Book,
  Layout,
  FileText,
} from "lucide-react";
import { MyContext } from "@/context/context";

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
    relatedService: "",
    status: "draft",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const { customToast } = useContext(MyContext);
  const [tagError, setTagError] = useState("");
  // Fetch related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, industriesRes] = await Promise.all([
          axios.get("/api/service/getservice"),
          axios.get("/api/industry/get"),
        ]);
        setServices(servicesRes.data.services || []);
        setIndustries(industriesRes.data.industries || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        customToast("Failed to load required data", "error");
      }
    };
    fetchData();
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      mainSections: [...prev.mainSections, { title: "", content: "" }],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/knowledgebase/create", formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        customToast(response.data);
        setFormData({
          title: "",
          introduction: "",
          mainSections: [{ title: "", content: "" }],
          conclusion: "",
          tags: [],
          relatedService: "",
          relatedIndustries: "",
          status: "draft",
        });
        setTagInput("");
        setTagError("");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      customToast(
        error.response?.data?.message || "Failed to create article",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto mb-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Knowledge Base Article
        </h1>
        <p className="text-gray-600">
          Share your expertise with comprehensive documentation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
              className="inline-flex items-center text-primary hover:text-primary/80"
            >
              <Plus size={18} className="mr-1" /> Add Section
            </button>
          </div>

          <div className="space-y-6">
            {formData.mainSections.map((section, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                {formData.mainSections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Section Title
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
                  <label className="block text-gray-700 mb-2">
                    Section Content
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
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-gray-700 font-medium">
                      Section Points
                    </label>
                    <button
                      type="button"
                      onClick={() => addPoint(index)}
                      className="inline-flex items-center text-primary hover:text-primary/80"
                    >
                      <Plus size={16} className="mr-1" /> Add Point
                    </button>
                  </div>

                  <div className="space-y-4">
                    {section.points?.map((point, pointIndex) => (
                      <div
                        key={pointIndex}
                        className="p-4 bg-white rounded-md border relative"
                      >
                        <button
                          type="button"
                          onClick={() => removePoint(index, pointIndex)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm mb-2">
                            Point Title
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
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 text-sm mb-2">
                            Point Description
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
                          />
                        </div>
                      </div>
                    ))}

                    {(!section.points || section.points.length === 0) && (
                      <p className="text-center text-gray-500 py-4 bg-white rounded-md border border-dashed">
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
                className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
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
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
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
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Related Service
            </label>
            <select
              name="relatedService"
              value={formData.relatedService}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  relatedService: e.target.value,
                }));
              }}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.Title}
                </option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="block text-gray-700 font-medium mb-2">
              Related Industry
            </label>
            <select
              name="relatedIndustries"
              value={formData.relatedIndustries}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  relatedIndustries: e.target.value,
                }));
              }}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an industry</option>
              {industries.map((industry) => (
                <option key={industry._id} value={industry._id}>
                  {industry.title}
                </option>
              ))}
            </select>
          </div> */}
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
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
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
