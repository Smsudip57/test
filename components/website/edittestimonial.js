'use client';
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { Loader2, UploadCloud, X, Video, Image as ImageIcon, AlertCircle, ArrowLeft, Save, Edit } from "lucide-react";
import { MyContext } from '@/context/context';
import { motion } from "framer-motion";

export default function EditTestimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    Testimonial: "",
    postedBy: "",
    role: "",
    image: null,
    video: null,
    relatedService: "",
    relatedIndustries: "",
    relatedProduct: "",
    relatedChikfdServices: "", // Added relatedChikfdServices field
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [products, setProducts] = useState([]);
  const [childServices, setChildServices] = useState([]); // Added childServices state
  const { customToast } = useContext(MyContext);
  
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
    fetchData();
  }, []);

  // Validate image dimensions (1:1 aspect ratio with 0.1% tolerance)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const width = this.width;
          const height = this.height;
          const aspectRatio = width / height;
          const targetRatio = 1/ 1;
          const tolerance = 0.1; // 0.1% tolerance
          
          if (Math.abs(aspectRatio - targetRatio) <= tolerance) {
            resolve({ width, height, aspectRatio });
          } else {
            reject({ 
              message: `Image must have a 1:1 aspect ratio. Current ratio is ${aspectRatio.toFixed(2)}:1`,
              dimensions: { width, height, aspectRatio }
            });
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

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

  const fetchData = async () => {
    try {
      // Fetch services, industries, products, and child services in parallel
      const [serviceRes, industryRes, productRes, childServiceRes] = await Promise.all([
        axios.get("/api/service/getservice"),
        axios.get("/api/industry/get"),
        axios.get("/api/product/get"),
        axios.get("/api/child/get") // Correct endpoint for child services
      ]);
      
      setServices(serviceRes.data.services || []);
      setIndustries(industryRes.data.industries || []);
      setProducts(productRes.data.products || []);
      setChildServices(childServiceRes.data.products || []); // API returns child services in 'products' field
    } catch (error) {
      console.error("Error fetching data:", error);
      customToast({ 
        success: false, 
        message: "Failed to load dropdown options" 
      });
    }
  };

  const handleEdit = (testimonial) => {
    setEditing(testimonial._id);
    setForm({
      ...testimonial,
      // Map relation IDs properly, handling possible nulls
      relatedService: testimonial.relatedService?._id || testimonial.relatedService || "",
      relatedIndustries: testimonial.relatedIndustries?._id || testimonial.relatedIndustries || "",
      relatedProduct: testimonial.relatedProduct?._id || testimonial.relatedProduct || "",
      relatedChikfdServices: testimonial.relatedChikfdServices?._id || testimonial.relatedChikfdServices || "",
    });
    setImagePreview(testimonial.image);
    setVideoPreview(testimonial.video);
    setError(null); // Clear any existing errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const { name } = e.target;
    
    if (!file) return;
    
    // File type validation
    if (name === "image") {
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        customToast({
          success: false,
          message: 'Only image files are allowed!'
        });
        e.target.value = '';
        return;
      }
      
      try {
        // Validate image dimensions (1:1)
        await validateImageDimensions(file);
        
        // Revoke previous objectURL to prevent memory leaks
        if (imagePreview && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
        }
        
        setImagePreview(URL.createObjectURL(file));
        setForm((prev) => ({ ...prev, [name]: file }));
      } catch (err) {
        console.error("Image validation error:", err);
        customToast({
          success: false,
          message: `Image must have a 1:1 aspect ratio. Current ratio is ${err.dimensions?.aspectRatio.toFixed(2)}:1`
        });
        e.target.value = '';
        return;
      }
    } else if (name === "video") {
      if (!file.type.match(/video\/(mp4|webm|ogg|quicktime)/i)) {
        customToast({
          success: false,
          message: 'Only video files are allowed!'
        });
        e.target.value = '';
        return;
      }
      
      // Revoke previous objectURL to prevent memory leaks
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
      
      setVideoPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, [name]: file }));
    }
  };

  const clearFilePreview = (fieldName) => {
    if (fieldName === 'image') {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setForm(prev => ({ ...prev, image: null }));
      if (imageInputRef.current) imageInputRef.current.value = '';
    } else if (fieldName === 'video') {
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(null);
      setForm(prev => ({ ...prev, video: null }));
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
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
      
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(form).forEach((key) => {
        // Don't append null/undefined values except for image/video which are handled separately
        if (form[key] !== null && form[key] !== undefined && key !== 'image' && key !== 'video') {
          formData.append(key, form[key]);
        }
      });
      
      // Only append image and video if they're File objects (have been changed)
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }
      
      if (form.video instanceof File) {
        formData.append("video", form.video);
      }
      
      formData.append("testimonialId", form._id);
      
      const res = await axios.post("/api/testimonial/edit", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      relatedService: "",
      relatedIndustries: "",
      relatedProduct: "",
      relatedChikfdServices: "", // Reset child services field too
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
              {/* Image Upload with Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Image*</label>
                <div className="relative border-2 border-dashed border-[#446E6D]/30 rounded-lg p-4 text-center hover:bg-[#446E6D]/5 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          type="button" 
                          onClick={() => imageInputRef.current?.click()}
                          className="bg-white rounded-full p-2 m-1 shadow-md"
                        >
                          <UploadCloud size={16} className="text-gray-700" />
                        </button>
                        <button
                          type="button" 
                          onClick={() => clearFilePreview('image')}
                          className="bg-white rounded-full p-2 m-1 shadow-md text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                      <ImageIcon className="h-12 w-12 text-[#446E6D]" />
                      <p className="mt-2 text-sm font-medium text-[#446E6D]">Click to upload an image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB (1:1 ratio required)</p>
                    </label>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Video Upload with Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Video*</label>
                <div className="relative border-2 border-dashed border-[#446E6D]/30 rounded-lg p-4 text-center hover:bg-[#446E6D]/5 transition-colors">
                  {videoPreview ? (
                    <div className="relative">
                      <video 
                        src={videoPreview} 
                        controls 
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          type="button" 
                          onClick={() => videoInputRef.current?.click()}
                          className="bg-white rounded-full p-2 m-1 shadow-md"
                        >
                          <UploadCloud size={16} className="text-gray-700" />
                        </button>
                        <button
                          type="button" 
                          onClick={() => clearFilePreview('video')}
                          className="bg-white rounded-full p-2 m-1 shadow-md text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                      <Video className="h-12 w-12 text-[#446E6D]" />
                      <p className="mt-2 text-sm font-medium text-[#446E6D]">Click to upload a video</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, WebM up to 50MB</p>
                    </label>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    name="video"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Related Parent Service</label>
                <select
                  name="relatedService"
                  value={form.relatedService}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                >
                  <option value="">Select a Parent Service (Optional)</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.Title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Related Industry</label>
                <select
                  name="relatedIndustries"
                  value={form.relatedIndustries}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                >
                  <option value="">Select an Industry (Optional)</option>
                  {industries.map((industry) => (
                    <option key={industry._id} value={industry._id}>
                      {industry.Title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Selection Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Related Child Service</label>
                <select
                  name="relatedProduct"
                  value={form.relatedProduct}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                >
                  <option value="">Select a Child Service (Optional)</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.Title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Child Services Selection Dropdown - Added */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Related Product</label>
                <select
                  name="relatedChikfdServices"
                  value={form.relatedChikfdServices}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D]"
                >
                  <option value="">Select a Product (Optional)</option>
                  {childServices.map((childService) => (
                    <option key={childService._id} value={childService._id}>
                      {childService.Title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                    saving 
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