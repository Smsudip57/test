'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import {Upload} from 'lucide-react'
import { MyContext } from '@/context/context';
import { useContext } from 'react';


export default function ServiceForm() {
  const [formData, setFormData] = useState({
    Title: '',
    detail: '',
    moreDetail: '',
    category: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const imageInputRef = useRef(null);

  const categories = [
    'Branding',
    'Workfrom Anywhere',
    'Modern Workplace',
    'Digital',
    'Endless Support',
  ];
  const context = useContext(MyContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const Delete = async () => {
      
      // Ensure all required fields are filled
      if (!formData.Title || !formData.detail || !formData.moreDetail || !formData.category || !formData.image) {
        setErrorMessage('All fields are required!');
        return;
      }
      
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      // Prepare form data
      const data = new FormData();
      data.append('Title', formData.Title);
      data.append('detail', formData.detail);
      data.append('moreDetail', formData.moreDetail);
      data.append('category', formData.category);
      data.append('image', formData.image);
      
      try {
      const response = await axios.post('/api/service/createservice', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, 
      });

      context.customToast(response.data)
      setFormData({
        Title: '',
        detail: '',
        moreDetail: '',
        category: '',
        image: null,
      });
    } catch (error) {
      context.customToast({success:false, message:'Something went wrong'})
    } finally {
      setLoading(false);
    }
  }
  context.setShowConfirm('Are you sure you want to create a new service?');
  context.setConfirmFunction(() => Delete);
  };
  
  return (
    <div className="p-10 bg-white shadow rounded-md w-full mx-auto text-gray-700">
      <h1 className="text-xl font-bold mb-4 w-full text-left">Create a Service</h1>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="w-full flex flex-row items-center">
      <div className="mb-4 basis-1/2"
         
      >
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full hidden"
            ref={imageInputRef}
            />
            <div className='flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-[#D4DDDD] transition-colors duration-300 mr-12 aspect-[2/1]'
             onClick={() => imageInputRef.current && imageInputRef.current.click()}
            >
            {formData.image ? <img src={URL.createObjectURL(formData.image)} alt="Selected Image" className='w-full h-full object-cover' /> :<span className='flex items-center justify-center flex-col gap-5'>

          <label htmlFor="image" className="block font-semibold mb-1 ">
            Upload Image
          </label>
            <Upload size={36} className='text-gray-700'/>
            </span>}
            </div>
        </div>

        <div className='basis-1/2'>

        <div className="mb-4">
          <label htmlFor="Title" className="block font-semibold mb-3">
            Title
          </label>
          <input
            type="text"
            id="Title"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter the title"
            />
        </div>

        <div className="mb-4">
          <label htmlFor="detail" className="block font-semibold mb-3">
            Detail
          </label>
          <textarea
            id="detail"
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter the details (new lines will be preserved)"
            rows={5}
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="moreDetail" className="block font-semibold mb-3">
            More Detail
          </label>
          <textarea
            id="moreDetail"
            name="moreDetail"
            value={formData.moreDetail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter more details (new lines will be preserved)"
            rows={3}
            ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block font-semibold mb-3">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={loading}
          >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
          </div>
      </form>
    </div>
  );
}
