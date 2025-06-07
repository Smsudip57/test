'use client';
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Loader2, UploadCloud, X, PlusCircle, ListOrdered } from 'lucide-react';
import { MyContext } from '@/context/context';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    description: "",
    title: "",
    type: "",
    image: null,
    points: [],
    relatedService: "",
    relatedIndustries: "",
  });

  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [pointImagePreviews, setPointImagePreviews] = useState({});
  const [uploadingPointImages, setUploadingPointImages] = useState(false);
  const { customToast } = useContext(MyContext);

  // Function to validate image dimensions (16:7 aspect ratio with 5% tolerance)
  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const aspectRatio = width / height;
          const targetRatio = 16 / 7;
          const tolerance = 0.05; // 5% tolerance
          
          if (Math.abs(aspectRatio - targetRatio) <= tolerance) {
            resolve({ width, height, aspectRatio });
          } else {
            reject({ 
              message: `Image must have a 16:7 aspect ratio. Current ratio is ${aspectRatio.toFixed(2)}:1`,
              dimensions: { width, height, aspectRatio }
            });
          }
        };
        img.onerror = () => {
          reject({ message: "Failed to load image. Please select a valid image file." });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, industryRes] = await Promise.all([
          axios.get('/api/service/getservice'),
          axios.get('/api/industry/get'),
        ]);
        setServices(serviceRes.data.services || []);
        setIndustries(industryRes.data.industries || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate image dimensions (16:7 aspect ratio with 5% tolerance)
      await validateImageDimensions(file);
      
      // If validation passes, set the image preview and update formData
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: file }));
    } catch (error) {
      console.error("Image validation failed:", error);
      customToast({
        success: false, 
        message: error.message || "Image must have a 16:7 aspect ratio"
      });
      e.target.value = "";
    }
  };

  const handleAddPoint = () => {
    setFormData((prev) => ({
      ...prev,
      points: [...prev.points, { 
        title: '', 
        explanationType: 'article', 
        article: '',
        bullets: [],
        image: null,
        imageFile: null // Added to store the file object separately
      }],
    }));
  };

  const handlePointChange = (index, field, value) => {
    const updatedPoints = [...formData.points];
    updatedPoints[index] = { ...updatedPoints[index], [field]: value };
    
    // If changing explanationType, ensure the required fields are initialized
    if (field === 'explanationType') {
      if (value === 'article' && !updatedPoints[index].article) {
        updatedPoints[index].article = '';
      } else if (value === 'bullets' && (!updatedPoints[index].bullets || updatedPoints[index].bullets.length === 0)) {
        updatedPoints[index].bullets = [{ style: 'dot', content: '' }];
      }
    }
    
    setFormData((prev) => ({ ...prev, points: updatedPoints }));
  };

  const handleRemovePoint = (index) => {
    const updatedPoints = formData.points.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, points: updatedPoints }));
    
    // Remove image preview
    setPointImagePreviews(prev => {
      const updated = {...prev};
      delete updated[index];
      return updated;
    });
  };

  const handleAddBullet = (pointIndex) => {
    const updatedPoints = [...formData.points];
    if (!updatedPoints[pointIndex].bullets) {
      updatedPoints[pointIndex].bullets = [];
    }
    updatedPoints[pointIndex].bullets.push({ style: 'dot', content: '' });
    setFormData((prev) => ({ ...prev, points: updatedPoints }));
  };

  const handleBulletChange = (pointIndex, bulletIndex, field, value) => {
    const updatedPoints = [...formData.points];
    updatedPoints[pointIndex].bullets[bulletIndex][field] = value;
    setFormData((prev) => ({ ...prev, points: updatedPoints }));
  };

  const handleRemoveBullet = (pointIndex, bulletIndex) => {
    const updatedPoints = [...formData.points];
    updatedPoints[pointIndex].bullets = updatedPoints[pointIndex].bullets.filter((_, i) => i !== bulletIndex);
    setFormData((prev) => ({ ...prev, points: updatedPoints }));
  };

  // Upload a single point image and return the URL
  const uploadPointImage = async (file) => {
    try {
      const imageData = new FormData();
      imageData.append('image', file);
      
      const response = await axios.post('/api/upload/image', imageData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        return response.data.imageUrl;
      } else {
        throw new Error(response.data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading point image:', error);
      throw error;
    }
  };

  const handlePointImageChange = (pointIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const updatedPoints = [...formData.points];
    // Store the file object in a separate property
    updatedPoints[pointIndex].imageFile = file;
    updatedPoints[pointIndex].image = null; // Clear the image URL if any
    
    setFormData((prev) => ({ ...prev, points: updatedPoints }));
    
    // Create preview for point image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPointImagePreviews(prev => ({
        ...prev,
        [pointIndex]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePointImage = (pointIndex) => {
    const updatedPoints = [...formData.points];
    updatedPoints[pointIndex].image = null;
    updatedPoints[pointIndex].imageFile = null;
    
    setFormData((prev) => ({
      ...prev,
      points: updatedPoints,
    }));
    
    // Remove the preview
    setPointImagePreviews(prev => {
      const updated = {...prev};
      delete updated[index];
      return updated;
    });
  };

  // Upload all point images before form submission
  const uploadAllPointImages = async () => {
    const updatedPoints = [...formData.points];
    let hasImagesToUpload = false;
    
    // Check if any points have image files to upload
    for (const point of updatedPoints) {
      if (point.imageFile) {
        hasImagesToUpload = true;
        break;
      }
    }
    
    if (!hasImagesToUpload) {
      return updatedPoints; // No images to upload, return points as is
    }
    
    setUploadingPointImages(true);
    
    try {
      // Upload each point image and update the points with the returned URLs
      for (let i = 0; i < updatedPoints.length; i++) {
        const point = updatedPoints[i];
        
        if (point.imageFile) {
          // Upload the image and get the URL
          const imageUrl = await uploadPointImage(point.imageFile);
          
          // Update the point with the image URL
          updatedPoints[i] = {
            ...point,
            image: imageUrl,
            imageFile: null // Clear the file object
          };
        }
      }
      
      return updatedPoints;
    } catch (error) {
      console.error('Error uploading point images:', error);
      customToast({
        success: false,
        message: 'Failed to upload one or more point images'
      });
      throw error;
    } finally {
      setUploadingPointImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description || !formData.type || !formData.image) {
      customToast({ success: false, message: 'Please fill all required fields!' });
      setLoading(false);
      return;
    }

    // Validate points structure
    for (const point of formData.points) {
      if (!point.title) {
        customToast({ success: false, message: 'All points must have a title!' });
        setLoading(false);
        return;
      }

      if (point.explanationType === 'article' && !point.article) {
        customToast({ success: false, message: 'Points with article explanation type must have content!' });
        setLoading(false);
        return;
      }

      if (point.explanationType === 'bullets') {
        if (!point.bullets || point.bullets.length === 0) {
          customToast({ success: false, message: 'Points with bullets explanation type must have at least one bullet!' });
          setLoading(false);
          return;
        }

        for (const bullet of point.bullets) {
          if (!bullet.content) {
            customToast({ success: false, message: 'All bullets must have content!' });
            setLoading(false);
            return;
          }
        }
      }
    }

    try {
      // Step 1: Upload any point images first
      let updatedPoints;
      try {
        updatedPoints = await uploadAllPointImages();
        
        // Update form data with the new points that have image URLs
        setFormData(prev => ({
          ...prev,
          points: updatedPoints
        }));
      } catch (error) {
        setLoading(false);
        return; // Stop if image uploads fail
      }
      
      // Step 2: Create the main form data for submission
      const data = new FormData();
      
      // Append regular fields
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('image', formData.image);
      data.append('relatedService', formData.relatedService);
      data.append('relatedIndustries', formData.relatedIndustries);
      
      // Prepare points for submission - remove any imageFile properties
      const pointsForSubmission = updatedPoints.map(point => {
        const { imageFile, ...pointWithoutImageFile } = point;
        return pointWithoutImageFile;
      });
      
      // Convert points array to JSON
      data.append('points', JSON.stringify(pointsForSubmission));

      // Step 3: Submit the form
      const response = await axios.post('/api/blog/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.status === 201) {
        customToast(response.data);
        setFormData({
          description: "",
          title: "",
          type: "",
          image: null,
          points: [],
          relatedService: "",
          relatedIndustries: "",
        });
        setImagePreview(null);
        setPointImagePreviews({});
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      customToast(error.response?.data || { success: false, message: 'Failed to create blog' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg border">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Blog</h2>

      {(loading || uploadingPointImages) && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
          <p className="text-white font-medium">
            {uploadingPointImages ? "Uploading images..." : "Creating blog post..."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload with Preview */}
        <div className="relative mx-auto w-full h-max border rounded-lg p-4 text-center cursor-pointer hover:opacity-80 transition">
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full aspect-[16/7] object-cover rounded-lg" />
              <button 
                type="button" 
                onClick={() => {
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, image: null }));
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="mb-2 flex items-center aspect-[16/7] justify-center">
              <div>
                <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                <p className="text-gray-700 font-medium">Click to upload an image</p>
                <p className="text-xs text-gray-500 mt-1">16:7 aspect ratio required</p>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>
            </label>
          )}
        </div>

        {/* Blog Details */}
        <div className='flex flex-col gap-5'>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2 border rounded-lg" 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <input 
              type="text" 
              name="type" 
              value={formData.type} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2 border rounded-lg" 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2 border rounded-lg" 
              rows="4" 
              required 
            />
          </div>

          {/* Related Service & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Related Service</label>
              <select
                name="relatedService"
                value={formData.relatedService}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select a Service</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.Title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Related Industry</label>
              <select
                name="relatedIndustries"
                value={formData.relatedIndustries}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select an Industry</option>
                {industries.map((industry) => (
                  <option key={industry._id} value={industry._id}>
                    {industry.Title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-3 rounded-lg w-full transition duration-300 hover:bg-blue-600 mt-4"
            disabled={loading || uploadingPointImages}
          >
            {loading || uploadingPointImages ? (
              <span className="flex items-center justify-center">
                <Loader2 size={18} className="animate-spin mr-2" />
                {uploadingPointImages ? "Uploading Images..." : "Creating Blog..."}
              </span>
            ) : "Create Blog"}
          </button>
        </div>

        {/* Points Section - Full Width */}
        <div className="md:col-span-2 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Blog Points</h3>
            <button 
              type="button" 
              onClick={handleAddPoint} 
              className="flex items-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
            >
              <PlusCircle className="mr-2" size={18} /> Add Point
            </button>
          </div>

          {formData.points.length === 0 && (
            <div className="text-center py-8 bg-gray-50 border border-dashed rounded-lg">
              <p className="text-gray-500">No points added yet. Click "Add Point" to begin.</p>
            </div>
          )}

          {formData.points.map((point, pointIndex) => (
            <div 
              key={pointIndex} 
              className="mb-6 p-6 border rounded-lg bg-gray-50 relative"
            >
              <button 
                type="button" 
                onClick={() => handleRemovePoint(pointIndex)} 
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Point Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={point.title}
                  onChange={(e) => handlePointChange(pointIndex, "title", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter point title"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Explanation Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={point.explanationType}
                  onChange={(e) => handlePointChange(pointIndex, "explanationType", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="article">Article</option>
                  <option value="bullets">Bullet Points</option>
                </select>
              </div>

              {point.explanationType === 'article' ? (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Article Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={point.article}
                    onChange={(e) => handlePointChange(pointIndex, "article", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="6"
                    placeholder="Enter article content (preserves spaces and new lines)"
                    required
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-gray-700 font-medium">
                      Bullet Points <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddBullet(pointIndex)}
                      className="flex items-center text-blue-500 hover:text-blue-600"
                    >
                      <PlusCircle size={16} className="mr-1" /> Add Bullet
                    </button>
                  </div>

                  {(!point.bullets || point.bullets.length === 0) && (
                    <div className="text-center py-4 bg-white border border-dashed rounded-lg mb-3">
                      <p className="text-gray-500 text-sm">No bullets added yet. Click "Add Bullet" to begin.</p>
                    </div>
                  )}

                  {point.bullets && point.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-3 mb-3 items-start">
                      <div className="w-28">
                        <select
                          value={bullet.style}
                          onChange={(e) => handleBulletChange(pointIndex, bulletIndex, "style", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="dot">Dot</option>
                          <option value="number">Number</option>
                          <option value="roman">Roman</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={bullet.content}
                          onChange={(e) => handleBulletChange(pointIndex, bulletIndex, "content", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          placeholder="Bullet content"
                          required
                        />
                      </div>
                      {point.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(pointIndex, bulletIndex)}
                          className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Point Image (Optional)
                </label>
                <div className="space-y-4">
                  {pointImagePreviews[pointIndex] ? (
                    <div className="relative">
                      <img 
                        src={pointImagePreviews[pointIndex]} 
                        alt={`Preview for point ${pointIndex + 1}`}
                        className="w-full max-h-40 object-contain rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePointImage(pointIndex)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePointImageChange(pointIndex, e)}
                      className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700"
                    />
                  )}
                </div>
                {point.imageFile && !pointImagePreviews[pointIndex] && (
                  <div className="mt-2 text-sm text-green-600">
                    Image selected: {point.imageFile.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;