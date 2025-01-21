'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { Upload ,ChevronLeft , Pencil } from 'lucide-react';
import { MyContext } from '@/context/context';

export default function EditServiceList() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [formValues, setFormValues] = useState({
    Title: '',
    deltail: '',
    moreDetail: '',
    category: '',
    image: null,
  });
  const [categories] = useState([
    'Branding',
    'Workfrom Anywhere',
    'Modern Workplace',
    'Digital',
    'Endless Support',
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const imageInputRef = useRef(null);
  const { setShowConfirm, setConfirmFunction, customToast  } = useContext(MyContext);
  // Fetch services
  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/service/getservice', {
        withCredentials: true,
      });
      const fetchedServices = response.data.services || [];
      setServices(fetchedServices);
      setFilteredServices(fetchedServices);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((service) => service.category === category));
    }
  };

  // Open edit modal with pre-filled values
  const handleEditClick = (service) => {
    setEditingService(service._id);
    setFormValues({
      Title: service.Title,
      deltail: service.deltail,
      category: service.category,
      moreDetail: service.moreDetail,
      image: service.image,
    });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingService(null);
    setFormValues({ Title: '', deltail: '', category: '', image: null, moreDetail: '' });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormValues((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Save edited service
  const handleSave = async () => {
    const Save = async () => {
      
      setSaving(true);
      const formData = new FormData();
      formData.append('serviceId', editingService);
      formData.append('Title', formValues.Title);
      formData.append('deltail', formValues.deltail);
      formData.append('category', formValues.category);
    formData.append('moreDetail', formValues.moreDetail);
    if (formValues.image) {
      formData.append('image', formValues.image);
    }

    try {
      const response = await axios.post('/api/service/editservice', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if(response?.data?.success){
      customToast(response?.data)
      await fetchServices();
      closeEditModal();
    }
    } catch (err) {
      customToast(err?.response?.data)
    } finally {
      setSaving(false);
    }
  }

  setConfirmFunction(()=>Save);
  setShowConfirm('Are you sure you want to update this service?');
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <div>Loading services...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return (
    <div className="w-full text=gray-700 mx-auto  bg-[#f5f5f5]">
      {!editingService && <div>

      <div className="mb-4 flex justify-between">
      <h1 className="text-xl font-bold mb-4 w-full text-left">Edit Service</h1>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-xs text-gray-500 font-medium mb-2">Filter by Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="mt-1 block w-full p-2 border rounded-md"
          >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      </div>

      {filteredServices.length === 0 ? (
        <p className='text-gray-700 w-full h-[40vh] flex justify-center items-center text-center'>No services available.</p>
      ) : (
        <ul className="space-y-4">
          {filteredServices.map((service) => (
            <li
              key={service._id}
              className="flex items-center bg-white p-4 shadow rounded-lg space-x-4"
            >
              {/* Display Service Image */}
              {service.image && (
                <img
                src={service.image}
                alt={'Couldn\'t load'}
                className="w-16 h-16 rounded-md text-gray-400 text-xs object-cover overflow-hidden"
                />
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{service.Title}</h2>
                <p className="text-gray-600">{service.deltail}</p>
                <p className="text-gray-500 text-sm">{service.category}</p>
              </div>
              <button
                onClick={() => handleEditClick(service)}
                className="text-white text-sm bg-[#446E6D] hover:bg-[#446e6d9d] px-4 py-2 rounded-md flex items-center gap-2"
              > <Pencil style={{ width: '1em', height: '1em' }} /> 
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
      </div>}
      {
        editingService && (
          <div className='w-full'>
            <p className='flex gap-2 cursor-pointer justify-center items-center max-w-max text-gray-500 mb-4'
            onClick={closeEditModal}
            ><ChevronLeft style={{ width: '1em', height: '1em'}}/> Back</p>
            </div>
        )
      }
      {/* Modal for editing */}
      {editingService && (
        <div className='shadow'>

        {
              <div className="p-10 bg-white rounded-md w-full mx-auto text-gray-700">
              <h1 className="text-xl font-bold mb-4 w-full text-left">Edit Service</h1>

              <form  className="w-full flex flex-row items-center">
              <div className="mb-4 basis-1/2"
                
              >
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full hidden"
                    ref={imageInputRef}
                    />
                    <div className='flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:bg-[#D4DDDD] transition-colors duration-300 mr-12 aspect-[2/1] relative'
                    onClick={() => imageInputRef.current && imageInputRef.current.click()}
                    >
                    {formValues.image ? <img src={
                    typeof formValues.image === 'string' // Use lowercase 'string'
                      ? formValues.image
                      : URL.createObjectURL(formValues.image) // Ensure it's a File/Blob
                  }  alt="Couldn't load" className='w-full h-full object-cover text-center' /> :<span className='flex items-center justify-center flex-col gap-5'>

                  <label htmlFor="image" className="block font-semibold mb-1 z-10">
                    Upload Image
                  </label>
                    <Upload size={36} className='text-gray-700'/>
                    </span>}
                    <span className='flex absolute bg-white/65 w-full h-full items-center justify-center flex-col gap-5'>

                  <label htmlFor="image" className=" font-semibold mb-1 z-10">
                    Change Image
                  </label>
                    <Upload size={36} className='text-gray-700'/>
                    </span>
                    </div>
                </div>

                <div className='basis-1/2'>

                <div className="mb-4">
                  <label htmlFor="Title" className="block font-semibold mb-3">
                    Title
                  </label>
                  <input
                    type="text"
                    name="Title"
                    value={formValues.Title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter the title"
                    />
                </div>

                <div className="mb-4">
                  <label htmlFor="detail" className="block font-semibold mb-3">
                    Detail
                  </label>
                  <textarea
                    name="deltail"
                    value={formValues.deltail}
                    onChange={handleInputChange}
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
                    name="moreDetail"
                    value={formValues.moreDetail}
                    onChange={handleInputChange}
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
                    name="category"
                    value={formValues.category}
                    onChange={handleInputChange}
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
                
                <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                            className="bg-blue-500 text-white p-2 rounded w-full"
                            >
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={closeEditModal}
                              className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded w-full"
                            >
                              Cancel
                            </button>
                          </div>
                  </div>
              </form>
              </div>


          }
        </div>
      )}
    </div>
  );
}
