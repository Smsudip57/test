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
    Tag,
    Calendar,
    BookOpen,
    FileText,
    Upload,
    X,
    Trash2,
} from "lucide-react";
import { MyContext } from "@/context/context";
import RelatedItemsSelector from "./components/RelatedItemsSelector";
import dynamic from "next/dynamic";

// Dynamically import TextEditor to avoid SSR issues
const TextEditor = dynamic(() => import("../shaerd/TextEditor"), { ssr: false });

export default function EditKnowledgeBase() {
    // States for list view
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // States for edit view
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [formData, setFormData] = useState({
        articleId: "",
        title: "",
        introduction: "",
        contents: "",
        tags: [],
        relatedServices: [],
        relatedIndustries: [],
        relatedProducts: [],
        relatedChikfdServices: [],
        status: "draft",
    });
    const [tagInput, setTagInput] = useState("");
    const [tagError, setTagError] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const imageInputRef = useRef(null);
    const [submitting, setSubmitting] = useState(false);

    const { customToast } = useContext(MyContext);

    // Fetch articles
    useEffect(() => {
        const fetchData = async () => {
            try {
                const articlesRes = await axios.get("/api/knowledgebase/get");
                setArticles(articlesRes.data.knowledgebases || []);
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
                        message: `Image should have a 16:7 aspect ratio. Current ratio is ${img.width
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
                message: `Image must have a 16:7 aspect ratio. Current ratio is ${dimensionError.dimensions?.width
                    }x${dimensionError.dimensions?.height
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

        setFormData({
            articleId: article._id,
            title: article.title || "",
            introduction: article.introduction || "",
            contents: article.contents || "",
            tags: ensureArray(article.tags),
            relatedServices: ensureArray(article.relatedServices),
            relatedIndustries: ensureArray(article.relatedIndustries),
            relatedProducts: ensureArray(article.relatedProducts),
            relatedChikfdServices: ensureArray(article.relatedChikfdServices),
            status: article.status || "draft",
        });

        // Set image preview
        if (article.Image) {
            setImagePreview(article.Image);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle contents change from TextEditor
    const handleContentsChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            contents: value,
        }));
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

        if (!formData.contents.trim()) {
            customToast({
                success: false,
                message: "Contents is required",
            });
            return false;
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
            // Create FormData object to handle file upload
            const formDataToSubmit = new FormData();

            // Append article ID
            formDataToSubmit.append("articleId", formData.articleId);

            // Append image file if a new one was selected
            if (imageFile) {
                formDataToSubmit.append("Image", imageFile);
            }

            // Append other form fields
            formDataToSubmit.append("title", formData.title);
            formDataToSubmit.append("introduction", formData.introduction);
            formDataToSubmit.append("contents", formData.contents);
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
                setFormData({
                    articleId: "",
                    title: "",
                    introduction: "",
                    contents: "",
                    tags: [],
                    relatedServices: [],
                    relatedIndustries: [],
                    relatedProducts: [],
                    relatedChikfdServices: [],
                    status: "draft",
                });
                setImageFile(null);
                setImagePreview(null);
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

    // Delete article function
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
                            setFormData({
                                articleId: "",
                                title: "",
                                introduction: "",
                                contents: "",
                                tags: [],
                                relatedServices: [],
                                relatedIndustries: [],
                                relatedProducts: [],
                                relatedChikfdServices: [],
                                status: "draft",
                            });
                            setImageFile(null);
                            setImagePreview(null);
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

                {submitting && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
                        <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
                        <p className="text-white font-medium">Updating article...</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image & Details */}
                    <div className="space-y-6">
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

                        {/* Related Content */}
                        <RelatedItemsSelector
                            relatedServices={formData.relatedServices}
                            relatedIndustries={formData.relatedIndustries}
                            relatedProducts={formData.relatedProducts}
                            relatedChikfdServices={formData.relatedChikfdServices}
                            onRelatedServicesChange={(services) =>
                                setFormData(prev => ({ ...prev, relatedServices: services }))
                            }
                            onRelatedIndustriesChange={(industries) =>
                                setFormData(prev => ({ ...prev, relatedIndustries: industries }))
                            }
                            onRelatedProductsChange={(products) =>
                                setFormData(prev => ({ ...prev, relatedProducts: products }))
                            }
                            onRelatedChikfdServicesChange={(childServices) =>
                                setFormData(prev => ({ ...prev, relatedChikfdServices: childServices }))
                            }
                        />
                    </div>

                    {/* Right Column - Content */}
                    <div className="space-y-6">
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

                        {/* Contents */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Contents <span className="text-red-500">*</span>
                            </label>
                            <div className="border rounded-md">
                                <TextEditor
                                    value={formData.contents}
                                    onChange={handleContentsChange}
                                    placeholder="Write your article contents here..."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedArticle(null);
                                    setFormData({
                                        articleId: "",
                                        title: "",
                                        introduction: "",
                                        contents: "",
                                        tags: [],
                                        relatedServices: [],
                                        relatedIndustries: [],
                                        relatedProducts: [],
                                        relatedChikfdServices: [],
                                        status: "draft",
                                    });
                                    setImageFile(null);
                                    setImagePreview(null);
                                    setTagInput("");
                                    setTagError("");
                                }}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Update Article</span>
                                    </>
                                )}
                            </button>
                        </div>
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
                                        Contents
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
