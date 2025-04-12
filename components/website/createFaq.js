"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, TextField, Button, Typography, Paper, IconButton, 
         FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function CreateFaq() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    questions: [{ question: '', answer: '' }],
    relatedServices: '',
    relatedIndustries: ''
  });
  
  // Services and Industries lists
  const [services, setServices] = useState([]);
  const [industries, setIndustries] = useState([]);
  
  // Loading and submission states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Fetch services and industries on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch services
        const servicesRes = await axios.get('/api/service/getservice',{
          withCredentials: true
        });
        if (servicesRes.data.success) {
          setServices(servicesRes.data.services || []);
        }
        
        // Fetch industries
        const industriesRes = await axios.get('/api/industry/get',{
            withCredentials: true
        });
        if (industriesRes.data.success) {
          setIndustries(industriesRes.data.industries || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Failed to load services and industries");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle input change for title and dropdowns
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle question or answer change
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Add a new question-answer pair
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', answer: '' }]
    }));
  };
  
  // Remove a question-answer pair
  const removeQuestion = (index) => {
    if (formData.questions.length === 1) {
      return toast.warning("You need at least one question");
    }
    
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      return toast.error("Title is required");
    }
    
    if (!formData.relatedServices) {
      return toast.error("Please select a related service");
    }
    
    // Validate all questions have both question and answer
    const hasEmptyFields = formData.questions.some(qa => 
      !qa.question.trim() || !qa.answer.trim()
    );
    
    if (hasEmptyFields) {
      return toast.error("All questions and answers are required");
    }
    
    setSubmitting(true);
    
    try {
      const response = await axios.post('/api/faq/create', {
        title: formData.title,
        questions: formData.questions,
        relatedServices: formData.relatedServices,
        relatedIndustries: formData.relatedIndustries || null
      });
      
      if (response.data.success) {
        toast.success("FAQ created successfully");
        setSuccess(true);
        
        // Reset form
        setFormData({
          title: '',
          questions: [{ question: '', answer: '' }],
          relatedServices: '',
          relatedIndustries: ''
        });
      } else {
        toast.error(response.data.message || "Failed to create FAQ");
      }
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      toast.error(error.response?.data?.message || "Error creating FAQ");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Reset form after successful submission
  const handleAddAnother = () => {
    setSuccess(false);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (success) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: 'success.main' }}>
            <span className='text-green-500 font-semibold'>

          FAQ Created Successfully!
            </span>
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleAddAnother}
          sx={{ mr: 2 }}
        >
          Add Another FAQ
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => window.location.href = '/admin/faqs'}
        >
          View All FAQs
        </Button>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 6,}}>
      <Typography variant="h5" sx={{ mb: 4  }} className=' font-semibold'>Create New FAQ</Typography>
      
      <form onSubmit={handleSubmit}>
        {/* FAQ Title */}
        <TextField
          label="FAQ Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        
        {/* Service Selection */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Related Service</InputLabel>
          <Select
            name="relatedServices"
            value={formData.relatedServices}
            onChange={handleInputChange}
            label="Related Service"
          >
            {services.map(service => (
              <MenuItem key={service._id} value={service._id}>
                {service.Title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Industry Selection (Optional) */}
        {/* <FormControl fullWidth margin="normal">
          <InputLabel>Related Industry (Optional)</InputLabel>
          <Select
            name="relatedIndustries"
            value={formData.relatedIndustries}
            onChange={handleInputChange}
            label="Related Industry (Optional)"
          >
            <MenuItem value="">None</MenuItem>
            {industries.map(industry => (
              <MenuItem key={industry._id} value={industry._id}>
                {industry.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        
        {/* Questions and Answers */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Questions & Answers
        </Typography>
        
        {formData.questions.map((qa, index) => (
          <Box 
            key={index} 
            sx={{ 
              mt: 3, 
              p: 2, 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              position: 'relative'
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Question {index + 1}
            </Typography>
            
            <TextField
              label="Question"
              value={qa.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            
            <TextField
              label="Answer"
              value={qa.answer}
              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
              fullWidth
              required
              margin="normal"
              multiline
              rows={3}
            />
            
            <IconButton 
              color="error" 
              sx={{ position: 'absolute', top: 10, right: 10 }}
              onClick={() => removeQuestion(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        
        {/* Add Question Button */}
        <Button 
          startIcon={<AddIcon />}
          onClick={addQuestion}
          sx={{ mt: 2 }}
        >
          Add Question
        </Button>
        
        {/* Submit Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : "Create FAQ"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}