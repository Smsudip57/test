'use client';
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { Loader2, UploadCloud, X, Video, Image as ImageIcon, AlertCircle, ArrowLeft, Save, Edit } from "lucide-react";
import { MyContext } from '@/context/context';
import { motion } from "framer-motion";
import RelatedItemsSelector from '@/components/website/components/RelatedItemsSelector';
import ImageUploader from '@/components/website/components/ImageUploader';

export default function EditTestimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    Testimonial: "",
    postedBy: "",
    role: "",
    relatedServices: [],
    relatedIndustries: [],
    relatedProducts: [],
    relatedChikfdServices: [],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const { customToast } = useContext(MyContext);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/testimonial/get");
      if (res.data.success) setTestimonials(res.data.testimonials);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to fetch testimonials. Please try again.");
      customToast({
        success: false,
        message: "Failed to fetch testimonials"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (fileUrl, preview) => {
    setImageUrl(fileUrl);
    setImagePreview(preview);
    setError(null);
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    setImagePreview(null);
  };

  const handleVideoUpload = (videoUrl, preview) => {
    setVideoUrl(videoUrl);
    setVideoPreview(preview);
    setError(null);
  };

  const handleVideoRemove = () => {
    setVideoUrl(null);
    setVideoPreview(null);
  };

  const handleEdit = (testimonial) => {
    setEditing(testimonial._id);
    setForm({
      ...testimonial,
      // Convert single relation IDs to arrays if they exist
      relatedServices: testimonial.relatedServices?.map(s => typeof s === 'string' ? s : s._id) || [],
      relatedIndustries: testimonial.relatedIndustries?.map(i => typeof i === 'string' ? i : i._id) || [],
      relatedProducts: testimonial.relatedProducts?.map(p => typeof p === 'string' ? p : p._id) || [],
      relatedChikfdServices: testimonial.relatedChikfdServices?.map(c => typeof c === 'string' ? c : c._id) || [],
    });
    setImagePreview(testimonial.image);
    setVideoPreview(testimonial.video);
    setError(null); // Clear any existing errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRelatedItemsChange = (relatedItems) => {
    setForm((prev) => ({
      ...prev,
      relatedServices: relatedItems.relatedServices || [],
      relatedIndustries: relatedItems.relatedIndustries || [],
      relatedProducts: relatedItems.relatedProducts || [],
      relatedChikfdServices: relatedItems.relatedChikfdServices || [],
    }));
  };

  const validateForm = () => {
    if (!form.Testimonial || !form.Testimonial.trim()) {
      setError("Testimonial text is required");
      return false;
    }

    if (!form.postedBy || !form.postedBy.trim()) {
      setError("Author name is required");
      return false;
    }

    if (!form.role || !form.role.trim()) {
      setError("Author role is required");
      return false;
    }

    if (!imagePreview) {
      setError("Image is required");
      return false;
    }

    if (!videoPreview) {
      setError("Video is required");
      return false;
    }

    // Validate at least one relationship is selected
    const totalRelations =
      (form.relatedServices?.length || 0) +
      (form.relatedIndustries?.length || 0) +
      (form.relatedProducts?.length || 0) +
      (form.relatedChikfdServices?.length || 0);

    if (totalRelations === 0) {
      setError("Please select at least one relationship!");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      customToast({
        success: false,
        message: error
      });
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Prepare JSON payload
      const payload = {
        testimonialId: form._id,
        Testimonial: form.Testimonial,
        postedBy: form.postedBy,
        role: form.role,
        relatedServices: form.relatedServices,
        relatedIndustries: form.relatedIndustries,
        relatedProducts: form.relatedProducts,
        relatedChikfdServices: form.relatedChikfdServices,
      };

      // Include image URL if changed
      if (imageUrl) {
        payload.image = imageUrl;
      }

      // Include video URL if changed
      if (videoUrl) {
        payload.video = videoUrl;
      }

      const res = await axios.post("/api/testimonial/edit", payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        // Update local state to reflect changes
        await fetchTestimonials(); // Refetch to get updated data with proper relations

        setEditing(null); // Close the edit form after saving

        customToast({
          success: true,
          message: "Testimonial updated successfully"
        });
      } else {
        setError("Failed to save changes. Please try again.");
        customToast({
          success: false,
          message: res.data.message || "Failed to save changes"
        });
      }
    } catch (err) {
      console.error("Error updating testimonial:", err);
      setError("An error occurred while saving. Please try again.");
      customToast({
        success: false,
        message: err.response?.data?.message || "An error occurred while saving"
      });
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    // Clean up any blob URLs
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }

    setEditing(null);
    setForm({
      Testimonial: "",
      postedBy: "",
      role: "",
      image: null,
      video: null,
      relatedServices: [],
      relatedIndustries: [],
      relatedProducts: [],
      relatedChikfdServices: [],
    });
    setImagePreview(null);
    setVideoPreview(null);
    setError(null);
  };

  return (
    <div className="max-w-full mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
      {editing ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={cancelEdit}
              className="flex items-center text-gray-600 hover:text-[#446E6D] transition-colors"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span>Back to Testimonials</span>
            </button>

            <h1 className="text-2xl font-bold text-center text-[#446E6D]">
              Edit Testimonial
            </h1>

            <div className="w-24"></div> {/* Spacer for centering the title */}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Media Uploads */}
            <div className="space-y-6">
              {/* Image Upload Component */}
              <ImageUploader
                method="url"
                mediaType="image"
                onImageChange={handleImageUpload}
                onImageRemove={handleImageRemove}
                preview={imagePreview}
                label="Testimonial Image* (1:1 ratio required)"
                maxSize={10}
                aspectRatio="1:1"
              />

              {/* Video Upload Component */}
              <ImageUploader
                method="url"
                mediaType="video"
                onImageChange={handleVideoUpload}
                onImageRemove={handleVideoRemove}
                preview={videoPreview}
                label="Testimonial Video*"
                maxSize={50}
                aspectRatio={null}
              />
            </div>

            {/* Right Column - Text Fields */}
            <div className="space-y-6">
              {/* Testimonial Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Text*</label>
                <textarea
                  name="Testimonial"
                  value={form.Testimonial}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                  rows="4"
                  placeholder="Enter the testimonial content..."
                />
              </div>

              {/* Author Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posted By*</label>
                  <input
                    type="text"
                    name="postedBy"
                    value={form.postedBy}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                    placeholder="Author's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role*</label>
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                    placeholder="Author's position or role"
                  />
                </div>
              </div>

              {/* Related Entities */}
              <RelatedItemsSelector
                relations={["services", "industries", "products", "childServices"]}
                value={{
                  relatedServices: form.relatedServices,
                  relatedIndustries: form.relatedIndustries,
                  relatedProducts: form.relatedProducts,
                  relatedChikfdServices: form.relatedChikfdServices,
                }}
                onChange={handleRelatedItemsChange}
                disabled={saving}
                isMultiple={true}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium ${saving
                    ? 'bg-[#446E6D]/70 cursor-not-allowed'
                    : 'bg-[#446E6D] hover:bg-[#375857] transition-colors'
                    } shadow-md flex items-center justify-center`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={20} />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {/* Display Testimonials List */}
          <h1 className="text-3xl font-bold mb-6 text-center text-[#446E6D]">Testimonials</h1>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-[#446E6D]" />
            </div>
          ) : error ? (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No testimonials found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={testimonial.image}
                      alt={testimonial.postedBy}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#446E6D]/20"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-lg font-medium line-clamp-2 text-gray-800">{testimonial.Testimonial}</p>
                    <p className="text-[#446E6D] font-semibold mt-1">{testimonial.postedBy}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {testimonial.relatedService && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {typeof testimonial.relatedService === 'object'
                            ? testimonial.relatedService?.Title || 'Service'
                            : 'Service'}
                        </span>
                      )}

                      {testimonial.relatedIndustries && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {typeof testimonial.relatedIndustries === 'object'
                            ? testimonial.relatedIndustries?.Title || 'Industry'
                            : 'Industry'}
                        </span>
                      )}

                      {testimonial.relatedProduct && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {typeof testimonial.relatedProduct === 'object'
                            ? testimonial.relatedProduct?.Title || 'Product'
                            : 'Product'}
                        </span>
                      )}

                      {/* Added Child Service Label */}
                      {testimonial.relatedChikfdServices && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {typeof testimonial.relatedChikfdServices === 'object'
                            ? testimonial.relatedChikfdServices?.Title || 'Child Service'
                            : 'Child Service'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 mt-4 sm:mt-0">
                    <motion.button
                      onClick={() => handleEdit(testimonial)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-[#446E6D] hover:bg-[#375857] text-white rounded-lg flex items-center shadow-sm transition-all"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}