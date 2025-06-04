"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, TextField, Button, Typography, Paper, IconButton,
  FormControl, InputLabel, Select, MenuItem, CircularProgress,
  Checkbox, ListItemText, Chip, OutlinedInput, Divider,
  Card, CardContent, Tooltip, Fade, alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TitleIcon from '@mui/icons-material/Title';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LinkIcon from '@mui/icons-material/Link';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

// Theme colors
const themeColors = {
  primary: '#446E6D',
  primaryLight: '#76B4B1',
  primaryDark: '#1a2928',
  accent: '#37c0bd',
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    borderColor: themeColors.primaryLight,
  },
  marginBottom: theme.spacing(3),
  position: 'relative',
}));

const QuestionNumberBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '-12px',
  left: '-12px',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: themeColors.primary,
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  zIndex: 1,
  boxShadow: theme.shadows[2],
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& svg': {
    marginRight: theme.spacing(1),
    color: themeColors.primary,
  }
}));

export default function CreateFaq() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    questions: [{ question: '', answer: '' }],
    relatedProducts: [],
    relatedChikfdServices: []
  });

  // Data lists
  const [products, setProducts] = useState([]);
  const [childServices, setChildServices] = useState([]);

  // Loading and submission states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch products and child services on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const productsRes = await axios.get('/api/product/get', {
          withCredentials: true
        });
        if (productsRes.data.success) {
          setProducts(productsRes.data.products || []);
        }

        // Fetch child services
        const childServicesRes = await axios.get('/api/child/get', {
          withCredentials: true
        });
        if (childServicesRes.data.success) {
          setChildServices(childServicesRes.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load products and services");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input change for title
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (e) => {
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
        relatedProducts: formData.relatedProducts,
        relatedChikfdServices: formData.relatedChikfdServices
      });

      if (response.data.success) {
        toast.success("FAQ created successfully");
        setSuccess(true);

        // Reset form
        setFormData({
          title: '',
          questions: [{ question: '', answer: '' }],
          relatedProducts: [],
          relatedChikfdServices: []
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px' 
      }}>
        <CircularProgress sx={{ color: themeColors.primary }} size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading resources...
        </Typography>
      </Box>
    );
  }

  if (success) {
    return (
      <Paper 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3} 
        sx={{ 
          p: 5, 
          maxWidth: 900, 
          mx: 'auto', 
          mt: 4,
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <CheckCircleOutlineIcon 
          sx={{ fontSize: 80, mb: 2, color: themeColors.accent }} 
        />
        <Typography variant="h4" sx={{ mb: 2, color: themeColors.primary, fontWeight: 'bold' }}>
          FAQ Created Successfully!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
          Your FAQ has been created and is now available in the system. You can add another FAQ or view all existing FAQs.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddAnother}
            sx={{ 
              bgcolor: themeColors.primary,
              '&:hover': { bgcolor: themeColors.accent }
            }}
          >
            Create Another FAQ
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.location.href = '/admin/faqs'}
            sx={{ 
              color: themeColors.primary,
              borderColor: themeColors.primary,
              '&:hover': { 
                borderColor: themeColors.accent,
                color: themeColors.accent
              } 
            }}
          >
            View All FAQs
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      elevation={3} 
      sx={{ 
        p: { xs: 3, md: 6 }, 
        borderRadius: 2,
        maxWidth: '1100px',
        mx: 'auto'
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontWeight: 600,
          color: themeColors.primary,
          borderBottom: '2px solid',
          borderColor: themeColors.primaryLight,
          pb: 1,
          display: 'inline-block'
        }}
      >
        Create New FAQ
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <Box sx={{ mb: 5 }}>
          <SectionTitle variant="h5" gutterBottom>
            <TitleIcon />
            Basic Information
          </SectionTitle>
          
          <TextField
            label="FAQ Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
            variant="outlined"
            placeholder="Enter a descriptive title for this FAQ"
            InputProps={{
              sx: { borderRadius: 1.5 }
            }}
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: themeColors.primary,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: themeColors.primary,
              },
            }}
            helperText="A clear title helps users find this FAQ"
          />
        </Box>

        {/* Related Items Section */}
        <Box sx={{ mb: 5 }}>
          <SectionTitle variant="h5" gutterBottom>
            <LinkIcon />
            Related Items
          </SectionTitle>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Related Products Multi-Select */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="related-products-label" sx={{ 
                '&.Mui-focused': { color: themeColors.primary } 
              }}>
                Related Products
              </InputLabel>
              <Select
                labelId="related-products-label"
                multiple
                name="relatedProducts"
                value={formData.relatedProducts}
                onChange={handleMultiSelectChange}
                input={
                  <OutlinedInput 
                    label="Related Products" 
                    sx={{ 
                      borderRadius: 1.5,
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.primary,
                      },
                    }} 
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const product = products.find(p => p._id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={product ? product.Title : value} 
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            backgroundColor: alpha(themeColors.primary, 0.1),
                            '& .MuiChip-label': { color: themeColors.primary }
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                {products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    <Checkbox 
                      checked={formData.relatedProducts.indexOf(product._id) > -1} 
                      sx={{ 
                        color: themeColors.primaryLight,
                        '&.Mui-checked': {
                          color: themeColors.primary,
                        },
                      }}
                    />
                    <ListItemText 
                      primary={product.Title} 
                      secondary={product.detail?.substring(0, 60) + (product.detail?.length > 60 ? '...' : '')}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Related Child Services Multi-Select */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="related-child-services-label" sx={{ 
                '&.Mui-focused': { color: themeColors.primary } 
              }}>
                Related Child Services
              </InputLabel>
              <Select
                labelId="related-child-services-label"
                multiple
                name="relatedChikfdServices"
                value={formData.relatedChikfdServices}
                onChange={handleMultiSelectChange}
                input={
                  <OutlinedInput 
                    label="Related Child Services" 
                    sx={{ 
                      borderRadius: 1.5,
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.primary,
                      },
                    }} 
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const service = childServices.find(s => s._id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={service ? service.Title : value} 
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            backgroundColor: alpha(themeColors.accent, 0.1),
                            '& .MuiChip-label': { color: themeColors.accent }
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300
                    }
                  }
                }}
              >
                {childServices.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    <Checkbox 
                      checked={formData.relatedChikfdServices.indexOf(service._id) > -1} 
                      sx={{ 
                        color: themeColors.primaryLight,
                        '&.Mui-checked': {
                          color: themeColors.accent,
                        },
                      }}
                    />
                    <ListItemText 
                      primary={service.Title} 
                      secondary={service.detail?.substring(0, 60) + (service.detail?.length > 60 ? '...' : '')}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Questions and Answers Section */}
        <Box sx={{ mb: 5 }}>
          <SectionTitle variant="h5" gutterBottom>
            <QuestionAnswerIcon />
            Questions & Answers
          </SectionTitle>

          <AnimatePresence>
            {formData.questions.map((qa, index) => (
              <StyledCard
                component={motion.div}
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                elevation={0}
              >
                <QuestionNumberBadge>
                  {index + 1}
                </QuestionNumberBadge>
                
                <CardContent sx={{ pt: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 2 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'text.secondary'
                    }}>
                      <DragIndicatorIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight={500}>
                        Question {index + 1}
                      </Typography>
                    </Box>
                    
                    <Tooltip title="Remove question" placement="top" TransitionComponent={Fade}>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => removeQuestion(index)}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: alpha('#f44336', 0.1) 
                          } 
                        }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <TextField
                    label="Question"
                    value={qa.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    variant="outlined"
                    placeholder="Enter the question"
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.primary,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: themeColors.primary,
                      },
                    }}
                  />

                  <TextField
                    label="Answer"
                    value={qa.answer}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Provide a detailed answer to the question"
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.primary,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: themeColors.primary,
                      },
                    }}
                    helperText="Clear and concise answers help users the most"
                  />
                </CardContent>
              </StyledCard>
            ))}
          </AnimatePresence>

          {/* Add Question Button */}
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addQuestion}
            sx={{ 
              mt: 2, 
              borderRadius: 1.5,
              borderStyle: 'dashed',
              py: 1.5,
              px: 3,
              fontWeight: 500,
              color: themeColors.primary,
              borderColor: themeColors.primary,
              '&:hover': {
                borderColor: themeColors.accent,
                color: themeColors.accent
              }
            }}
          >
            Add Another Question
          </Button>
        </Box>

        {/* Submit Button */}
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            size="large"
            sx={{ 
              bgcolor: themeColors.primary,
              '&:hover': { bgcolor: themeColors.accent },
              borderRadius: 1.5,
              py: 1.5,
              px: 4,
              fontWeight: 600,
              boxShadow: 4
            }}
          >
            {submitting ? "Creating..." : "Create FAQ"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}