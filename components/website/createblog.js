'use client';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Loader2, UploadCloud, X, PlusCircle } from 'lucide-react'; // Added PlusCircle for adding points
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
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { customToast } = useContext(MyContext);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleAddPoint = () => {
    setFormData((prev) => ({
      ...prev,
      points: [...prev.points, { title: '', explanation: '' }],
    }));
  };

  const handlePointChange = (index, field, value) => {
    const updatedPoints = [...formData.points];
    updatedPoints[index][field] = value;
    setFormData((prev) => ({ ...prev, points: updatedPoints }));
  };

  const handleRemovePoint = (index) => {
    const updatedPoints = formData.points.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, points: updatedPoints }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.description || !formData.type || !formData.image) {
      customToast({ success: false, message: 'Please fill all required fields!' });
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'points') {
        data.append(key, JSON.stringify(formData[key])); // Convert points array to JSON
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('/api/blog/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
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
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      customToast(error.response?.data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg border">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Blog</h2>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Image Upload with Preview */}
         <div className="relative  max-w-64 mx-auto w-full h-max border rounded-lg p-4 text-center cursor-pointer hover:opacity-80 transition">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full aspect-square object-cover rounded-lg" />
          ) : (
            <label className="mb-2 flex items-center aspect-square justify-center">
              <div>
              <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
              <p className="text-gray-700 font-medium">Click to upload an image</p>
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
          <label className="text-gray-700 font-medium">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg mb-2" required />

          <label className="text-gray-700 font-medium">Category</label>
          <input type="text" name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg mb-2" required />

          <label className="text-gray-700 font-medium">Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg mb-2" rows="4" required />

        {/* Points Section */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Blog Points</h3>
          {formData.points.map((point, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="Point Title"
                value={point.title}
                onChange={(e) => handlePointChange(index, "title", e.target.value)}
                className="w-1/3 px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Point Explanation"
                value={point.explanation}
                onChange={(e) => handlePointChange(index, "explanation", e.target.value)}
                className="w-2/3 px-4 py-2 border rounded-lg"
                required
              />
              <button type="button" onClick={() => handleRemovePoint(index)} className="text-red-500">
                <X size={24} />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddPoint} className="flex items-center text-blue-500 mt-2">
            <PlusCircle className="mr-1" size={20} /> Add Point
          </button>
        </div>

         {/* Related Service & Industry */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-gray-700 font-medium">Related Service</label>
            <select
              name="relatedService"
              value={formData.relatedService}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg mb-2"
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
            <label className="mb-2 block text-gray-700 font-medium">Related Industry</label>
            <select
              name="relatedIndustries"
              value={formData.relatedIndustries}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg mb-2"
            >
              <option value="">Select a Industry</option>
              {industries.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.Title}
                </option>
              ))}
            </select>
          </div>
        </div>
       
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full transition duration-300">
          Create Blog
        </button> </div>

      </form>
    </div>
  );
};

export default CreateBlog;
