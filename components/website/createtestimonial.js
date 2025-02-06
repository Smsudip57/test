'use client';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Loader2, UploadCloud, X } from 'lucide-react'; // Icons
import { MyContext } from '@/context/context';
import { context } from '@react-three/fiber';

const CreateTestimonial = () => {
  const [formData, setFormData] = useState({
    Testimonial: '',
    video: null,
    image: null,
    postedBy: '',
    role: '',
    relatedService: '',
    relatedIndustries: '',
  });

  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const { customToast } = useContext(MyContext)

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
    const { name } = e.target;

    if (!file) return;

    if (name === 'image') {
      setImagePreview(URL.createObjectURL(file));
    } else if (name === 'video') {
      setVideoPreview(URL.createObjectURL(file));
    }

    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.Testimonial || !formData.postedBy || !formData.role || !formData.image || !formData.video) {
      customToast({
        success:false,
        message: 'Please fill all information!'
      })
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post('/api/testimonial/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (response.status === 201) {
        setMessage('Testimonial created successfully!');
        setProgress(0);
        setLoading(false);
        setImagePreview(null);
        setVideoPreview(null);
        setFormData({
          Testimonial: '',
          video: null,
          image: null,
          postedBy: '',
          role: '',
          relatedService: '',
          relatedIndustries: '',
        });
        console.log('sudip')
        customToast(response.data)
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      customToast(error.response?.data)
      setProgress(0);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-lg shadow-lg border">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Testimonial</h2>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-white text-lg font-semibold mt-2">{progress}% Uploaded</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-16  grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className='flex gap-4'>
        {/* Image Upload with Preview */}
        <div className="relative  max-w-64 w-full h-max border rounded-lg p-4 text-center cursor-pointer hover:opacity-80 transition">
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


        {/* Video Upload with Preview */}
        <div className="relative w-full h-max aspect-[16/9] border rounded-lg p-4 text-center cursor-pointer hover:opacity-80 transition flex items-center justify-center">
          {videoPreview ? (
            <video src={videoPreview} controls className="w-full h-48 object-cover rounded-lg" />
          ) : (
            <label className="mb-2 flex items-center aspect-[16/9] justify-center">
              <span className='mx-auto w-max'>

              <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
              <p className="text-gray-700 font-medium">Click to upload a video</p>
              <input
                type="file"
                accept="video/*"
                name="video"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
                />
                </span>
            </label>
          )}
        </div>
            </div>
        <div>
        {/* Testimonial Input */}
        <div>
          <label className="mb-2 block text-gray-700 font-medium">Testimonial</label>
          <textarea
            name="Testimonial"
            value={formData.Testimonial}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>
        {/* Author Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-gray-700 font-medium">Posted By</label>
            <input
              type="text"
              name="postedBy"
              value={formData.postedBy}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg mb-2"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-gray-700 font-medium">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg mb-2"
              required
            />
          </div>
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
        </div>

      </form>
        {/* Submit Button */}
        <div className="flex justify-center mt-16 max-w-64 mx-auto">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded w-full transition duration-300"
          >
            Create Testimonial
          </button>
        </div>
    </div>
  );
};

export default CreateTestimonial;
