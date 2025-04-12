"use client";
import React, { useState, useEffect, useContext } from "react";
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
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  
  const { customToast } = useContext(MyContext);

  // Fetch articles and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, servicesRes, industriesRes] = await Promise.all([
          axios.get("/api/knowledgebase/get"),
          axios.get("/api/service/getservice"),
          axios.get("/api/industry/get"),
        ]);
        
        setArticles(articlesRes.data.knowledgebases || []);
        setServices(servicesRes.data.services || []);
        setIndustries(industriesRes.data.industries || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        customToast("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setFormData({
      articleId: article._id,
      title: article.title,
      introduction: article.introduction,
      mainSections: article.mainSections.map(section => ({
        ...section,
        points: section.points || [] // Ensure points array exists
      })),
      conclusion: article.conclusion,
      tags: article.tags || [],
      relatedServices: article.relatedServices || "",
      relatedIndustries: article.relatedIndustries || "",
      status: article.status,
    });
  };

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
  
    setFormData(prev => ({
      ...prev,
      mainSections: updatedSections
    }));
  };

  const addPoint = (sectionIndex) => {
    const updatedSections = [...formData.mainSections];
    const section = updatedSections[sectionIndex];
  
    if (!section.points) {
      section.points = [];
    }
  
    section.points.push({ title: "", description: "" });
  
    setFormData(prev => ({
      ...prev,
      mainSections: updatedSections
    }));
  };
  
  const removePoint = (sectionIndex, pointIndex) => {
    const updatedSections = [...formData.mainSections];
    updatedSections[sectionIndex].points = updatedSections[sectionIndex].points.filter((_, i) => i !== pointIndex);
  
    setFormData(prev => ({
      ...prev,
      mainSections: updatedSections
    }));
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      mainSections: [...prev.mainSections, { title: "", content: "" }],
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
        setTimeout(() => setTagError(""), 3000);
      } else {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, trimmedTag],
        }));
        setTagInput("");
        setTagError("");
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
      const response = await axios.post("/api/knowledgebase/edit", formData);

      if (response.data.success) {
        customToast("Article updated successfully!", "success");
        // Update the article in the list
        setArticles(prev =>
          prev.map(article =>
            article._id === formData.articleId ? response.data.article : article
          )
        );
        // Return to list view
        setSelectedArticle(null);
        setFormData(null);
      }
    } catch (error) {
      console.error("Error updating article:", error);
      customToast(
        error.response?.data?.message || "Failed to update article",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter articles based on search and status
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? article.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Render list view if no article is selected
  if (!selectedArticle) {
    return (
      <div className=" mx-auto mb-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Knowledge Base Management
          </h1>
          <p className="text-gray-600">Edit and manage your knowledge base articles</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="pl-10 w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-12 h-12 text-primary" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article._id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                      {article.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      article.status === 'published' ? 'bg-green-100 text-green-800' :
                      article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.introduction}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleEdit(article)}
                      className="flex items-center gap-1 px-3 py-1 text-primary hover:bg-primary/10 rounded-md transition-colors"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-gray-500 text-xl mb-2">No articles found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    );
  }

  // Render edit form if an article is selected
  return (
    <div className=" mx-auto mb-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedArticle(null);
              setFormData(null);
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Knowledge Base</h1>
        </div>
        <span className="text-sm text-gray-500">ID: {selectedArticle._id}</span>
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
                  <label className="block text-gray-700 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Section Content</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                    rows="4"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
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
      <div key={pointIndex} className="p-4 bg-white rounded-md border relative">
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
            onChange={(e) => handlePointChange(index, pointIndex, "title", e.target.value)}
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
            onChange={(e) => handlePointChange(index, pointIndex, "description", e.target.value)}
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
              name="relatedServices"
              value={formData.relatedServices}
              onChange={handleChange}
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

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Related Industry
            </label>
            <select
              name="relatedIndustries"
              value={formData.relatedIndustries}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an industry</option>
              {industries.map((industry) => (
                <option key={industry._id} value={industry._id}>
                  {industry.title}
                </option>
              ))}
            </select>
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
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedArticle(null);
              setFormData(null);
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}