"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CreateServiceDetails = () => {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    relatedServices: '',
    description: '',
    sections: [
      {
        title: '',
        image: null,
        imagePreview: null,
        points: [{ title: '', detail: '' }]
      }
    ]
  });

  // Fetch services only once when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/service/getservice');
        setServices(response.data.services);
      } catch (error) {
        // toast.error('Failed to fetch services');
        // console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Memoize handlers to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSectionChange = useCallback((index, field, value) => {
    setFormData(prevData => {
      const updatedSections = [...prevData.sections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return { ...prevData, sections: updatedSections };
    });
  }, []);

  const handlePointChange = useCallback((sectionIndex, pointIndex, field, value) => {
    setFormData(prevData => {
      const updatedSections = [...prevData.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        points: updatedSections[sectionIndex].points.map((point, idx) => 
          idx === pointIndex ? { ...point, [field]: value } : point
        )
      };
      return { ...prevData, sections: updatedSections };
    });
  }, []);

  const handleImageChange = useCallback((sectionIndex, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/i)) {
      toast.error('Only image files are allowed!');
      return;
    }

    // Create preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prevData => {
        const updatedSections = [...prevData.sections];
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          image: file,
          imagePreview: reader.result
        };
        return { ...prevData, sections: updatedSections };
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const addSection = useCallback(() => {
    setFormData(prevData => ({
      ...prevData,
      sections: [
        ...prevData.sections, 
        {
          title: '',
          image: null,
          imagePreview: null,
          points: [{ title: '', detail: '' }]
        }
      ]
    }));
  }, []);

  const removeSection = useCallback((index) => {
    setFormData(prevData => {
      if (prevData.sections.length <= 1) {
        toast.error('At least one section is required');
        return prevData;
      }
      
      const updatedSections = prevData.sections.filter((_, i) => i !== index);
      return { ...prevData, sections: updatedSections };
    });
  }, []);

  const addPoint = useCallback((sectionIndex) => {
    setFormData(prevData => {
      const updatedSections = [...prevData.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        points: [
          ...updatedSections[sectionIndex].points,
          { title: '', detail: '' }
        ]
      };
      return { ...prevData, sections: updatedSections };
    });
  }, []);

  const removePoint = useCallback((sectionIndex, pointIndex) => {
    setFormData(prevData => {
      const section = prevData.sections[sectionIndex];
      
      if (section.points.length <= 1) {
        toast.error('At least one point is required in a section');
        return prevData;
      }
      
      const updatedSections = [...prevData.sections];
      updatedSections[sectionIndex] = {
        ...section,
        points: section.points.filter((_, i) => i !== pointIndex)
      };
      
      return { ...prevData, sections: updatedSections };
    });
  }, []);

  const moveSection = useCallback((fromIndex, toIndex) => {
    setFormData(prevData => {
      const updatedSections = [...prevData.sections];
      const [movedItem] = updatedSections.splice(fromIndex, 1);
      updatedSections.splice(toIndex, 0, movedItem);
      return { ...prevData, sections: updatedSections };
    });
  }, []);

  // Form validation function
  const validateForm = useCallback(() => {
    if (!formData.relatedServices) {
      toast.error('Please select a related service');
      return false;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    
    // Validate each section
    for (const [index, section] of formData.sections.entries()) {
      if (!section.title.trim()) {
        toast.error(`Section ${index + 1} title is required`);
        return false;
      }
      
      if (!section.image && !section.imagePreview) {
        toast.error(`Section ${index + 1} image is required`);
        return false;
      }
      
      // Validate each point
      for (const [pIndex, point] of section.points.entries()) {
        if (!point.title.trim()) {
          toast.error(`Title for point ${pIndex + 1} in section ${index + 1} is required`);
          return false;
        }
        
        if (!point.detail.trim()) {
          toast.error(`Detail for point ${pIndex + 1} in section ${index + 1} is required`);
          return false;
        }
      }
    }
    
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare form data for submission
      const submitFormData = new FormData();
      submitFormData.append('relatedServices', formData.relatedServices);
      submitFormData.append('description', formData.description);
      
      // Prepare sections data
      const sectionsData = formData.sections.map(section => ({
        title: section.title,
        image: '', // Temporary placeholder for backend
        points: section.points
      }));
      
      submitFormData.append('sections', JSON.stringify(sectionsData));
      
      // Append all images
      formData.sections.forEach((section, index) => {
        if (section.image) {
          submitFormData.append('images', section.image);
        }
      });
      
      await axios.post('/api/servicedetails/create', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials:true
      });
      
      toast.success('Service details created successfully!');
      
      // Redirect to view page after success
      setTimeout(() => {
        router.push('/admin/services');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating service details:', error);
      toast.error(error.response?.data?.error || 'Failed to create service details');
    } finally {
      setLoading(false);
    }
  }, [formData, router, validateForm]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        
        <div className=" mx-auto">
          <header className="flex items-center justify-between mb-10 bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <button 
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-[#446E6D] transition-all"
                aria-label="Go back"
              >
                <ArrowBackIcon />
              </button>
              <h1 className="text-3xl font-bold text-[#446E6D]">
                Create Service Details
              </h1>
            </div>
            
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center px-6 py-3 rounded-lg text-white font-medium ${
                loading ? 'bg-blue-400' : 'bg-[#446E6D] hover:bg-[#446E6D]'
              } transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleOutlineIcon className="mr-2" />
                  Save Service Details
                </>
              )}
            </motion.button>
          </header>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <form onSubmit={handleSubmit}>
              <div className="mb-10">
                <label htmlFor="relatedServices" className="block text-base font-semibold text-gray-800 mb-2">
                  Related Service*
                </label>
                <div className="relative">
                  <select
                    id="relatedServices"
                    name="relatedServices"
                    value={formData.relatedServices}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none shadow-sm"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id} className='cursor-pointer'>
                        {service.Title}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">Choose the service this detail belongs to</p>
              </div>
              
              <div className="mb-10">
                <label htmlFor="description" className="block text-base font-semibold text-gray-800 mb-2">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Enter a detailed description of the service"
                />
                <p className="mt-1 text-sm text-gray-500">Provide a comprehensive overview of this service</p>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="bg-blue-100 text-[#446E6D] w-8 h-8 rounded-full inline-flex items-center justify-center mr-2">
                      <span>{formData.sections.length}</span>
                    </span>
                    Service Sections
                  </h2>
                  <motion.button
                    type="button"
                    onClick={addSection}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#446E6D] text-white hover:bg-[#446E6D] transition-all duration-200 font-medium shadow-sm"
                  >
                    <AddIcon className="mr-1" fontSize="small" />
                    Add New Section
                  </motion.button>
                </div>
                
                <div className="space-y-10">
                  <AnimatePresence>
                    {formData.sections.map((section, sectionIndex) => (
                      <SectionItem
                        key={sectionIndex}
                        section={section}
                        index={sectionIndex}
                        handleSectionChange={handleSectionChange}
                        handleImageChange={handleImageChange}
                        handlePointChange={handlePointChange}
                        addPoint={addPoint}
                        removePoint={removePoint}
                        removeSection={removeSection}
                        moveSection={moveSection}
                        totalSections={formData.sections.length}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

const SectionItem = React.memo(({
  section,
  index,
  handleSectionChange,
  handleImageChange,
  handlePointChange,
  addPoint,
  removePoint,
  removeSection,
  moveSection,
  totalSections
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SECTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));
  
  const [, drop] = useDrop(() => ({
    accept: 'SECTION',
    hover: (item) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    }
  }));
  
  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25, 
        duration: 0.3 
      }}
      className={`relative rounded-2xl ${
        isDragging ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'
      } bg-white shadow-sm overflow-hidden`}
      style={{ 
        opacity: isDragging ? 0.7 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="cursor-move mr-3 text-[#446E6D] hover:text-blue-800 transition-colors">
          <DragIndicatorIcon />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Section {index + 1}
          {section.title && <span className="ml-2 text-sm text-gray-500">({section.title})</span>}
        </h3>
        <div className="ml-auto flex gap-2">
          {totalSections > 1 && (
            <motion.button
              type="button"
              onClick={() => removeSection(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
            >
              <DeleteOutlineIcon />
            </motion.button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label htmlFor={`section-title-${index}`} className="block text-base font-semibold text-gray-800 mb-2">
              Section Title*
            </label>
            <input
              type="text"
              id={`section-title-${index}`}
              value={section.title}
              onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Enter section title"
            />
          </div>
          
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Section Image*
            </label>
            <div className="flex items-start space-x-4">
              {!section.imagePreview ? (
                <div className="flex-1">
                  <label
                    htmlFor={`section-image-${index}`}
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <CloudUploadIcon className="text-blue-500 mb-2" fontSize="large" />
                      <p className="text-sm font-medium text-[#446E6D] mb-1">Click to upload image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, or GIF (max 10MB)</p>
                    </div>
                    <input
                      id={`section-image-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative w-40 h-40 rounded-xl overflow-hidden shadow-md border border-gray-200"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200"></div>
                  <img
                    src={section.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      handleSectionChange(index, 'image', null);
                      handleSectionChange(index, 'imagePreview', null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md transition-all duration-200"
                  >
                    <CloseIcon fontSize="small" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-semibold text-gray-700 flex items-center">
              <span className="bg-blue-50 text-[#446E6D] w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">
                {section.points.length}
              </span>
              Key Points
            </h4>
            <motion.button
              type="button"
              onClick={() => addPoint(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-50 text-[#446E6D] hover:bg-blue-100 transition-all duration-200 font-medium"
            >
              <AddIcon className="mr-1" fontSize="small" />
              Add Point
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {section.points.map((point, pointIndex) => (
              <motion.div 
                key={pointIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-all duration-200"
              >
                <div>
                  <label htmlFor={`point-title-${index}-${pointIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Point Title*
                  </label>
                  <input
                    type="text"
                    id={`point-title-${index}-${pointIndex}`}
                    value={point.title}
                    onChange={(e) => handlePointChange(index, pointIndex, 'title', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Enter point title"
                  />
                </div>
                
                <div className="relative">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`point-detail-${index}-${pointIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Point Detail*
                    </label>
                    {section.points.length > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removePoint(index, pointIndex)}
                        className="p-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </motion.button>
                    )}
                  </div>
                  <textarea
                    id={`point-detail-${index}-${pointIndex}`}
                    value={point.detail}
                    onChange={(e) => handlePointChange(index, pointIndex, 'detail', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    rows={2}
                    placeholder="Enter point detail"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-3 text-xs text-[#446E6D] flex items-start">
        <InfoOutlinedIcon fontSize="small" className="mr-1 flex-shrink-0 mt-0.5" />
        <span>Drag this section to reposition it. Each section must have at least one point and an image.</span>
      </div>
    </motion.div>
  );
});

SectionItem.displayName = 'SectionItem';

export default CreateServiceDetails;