"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  InputAdornment,
  Tab,
  Tabs
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';

export default function EditFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);

  // Fetch FAQs when component mounts
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/faq/get');
        
        if (response.data.success) {
          setFaqs(response.data.faqs);
          
          // Extract unique categories (service titles)
          const uniqueCategories = Array.from(
            new Set(response.data.faqs.map(faq => 
              faq.relatedServices?.title || "Uncategorized"
            ))
          );
          
          setCategories(["all", ...uniqueCategories]);
        } else {
          setError('Failed to fetch FAQs');
          toast.error('Failed to load FAQs');
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('An error occurred while loading FAQs');
        toast.error('Error loading FAQs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFaqs();
  }, []);

  // Handle category tab change
  const handleCategoryChange = (event, newValue) => {
    setCurrentCategory(newValue);
  };

  // Open edit dialog for a FAQ
  const handleEditFaq = (faq) => {
    setCurrentFaq({
      ...faq,
      // Create a deep copy of questions to prevent direct state mutation
      questions: faq.questions.map(q => ({ ...q }))
    });
    setEditDialogOpen(true);
  };

  // Handle changes to FAQ title
  const handleTitleChange = (e) => {
    setCurrentFaq({
      ...currentFaq,
      title: e.target.value
    });
  };

  // Handle changes to questions or answers
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...currentFaq.questions];
    updatedQuestions[index][field] = value;
    
    setCurrentFaq({
      ...currentFaq,
      questions: updatedQuestions
    });
  };

  // Add a new question-answer pair
  const addQuestion = () => {
    setCurrentFaq({
      ...currentFaq,
      questions: [...currentFaq.questions, { question: '', answer: '' }]
    });
  };

  // Remove a question-answer pair
  const removeQuestion = (index) => {
    if (currentFaq.questions.length === 1) {
      return toast.warning("FAQ must have at least one question");
    }
    
    const updatedQuestions = [...currentFaq.questions];
    updatedQuestions.splice(index, 1);
    
    setCurrentFaq({
      ...currentFaq,
      questions: updatedQuestions
    });
  };

  // Save edited FAQ
  const handleSaveFaq = async () => {
    // Basic validation
    if (!currentFaq.title.trim()) {
      return toast.error("Title is required");
    }
    
    const hasEmptyFields = currentFaq.questions.some(qa => 
      !qa.question.trim() || !qa.answer.trim()
    );
    
    if (hasEmptyFields) {
      return toast.error("All questions and answers are required");
    }
    
    try {
      const response = await axios.put(`/api/faq/update/${currentFaq._id}`, {
        title: currentFaq.title,
        questions: currentFaq.questions,
        // We don't include relatedServices as it's not editable
      });
      
      if (response.data.success) {
        toast.success("FAQ updated successfully");
        
        // Update the FAQ in the local state
        setFaqs(faqs.map(faq => 
          faq._id === currentFaq._id ? response.data.faq : faq
        ));
        
        // Close the dialog
        setEditDialogOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update FAQ");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error(error.response?.data?.message || "Error updating FAQ");
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (faqId) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) {
      return;
    }
    
    try {
      const response = await axios.delete(`/api/faq/delete/${faqId}`);
      
      if (response.data.success) {
        toast.success("FAQ deleted successfully");
        
        // Remove the FAQ from the local state
        setFaqs(faqs.filter(faq => faq._id !== faqId));
        
        // Close the dialog if it's open
        if (editDialogOpen && currentFaq?._id === faqId) {
          setEditDialogOpen(false);
        }
      } else {
        toast.error(response.data.message || "Failed to delete FAQ");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error(error.response?.data?.message || "Error deleting FAQ");
    }
  };

  // Filter FAQs based on current category and search query
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = 
      currentCategory === "all" || 
      (faq.relatedServices?.title || "Uncategorized") === currentCategory;
    
    const matchesSearch = 
      searchQuery === "" ||
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.questions.some(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesCategory && matchesSearch;
  });

  // Group FAQs by category for display
  const groupedFaqs = {};
  filteredFaqs.forEach(faq => {
    const category = faq.relatedServices?.title || "Uncategorized";
    if (!groupedFaqs[category]) {
      groupedFaqs[category] = [];
    }
    groupedFaqs[category].push(faq);
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Error Loading FAQs
        </Typography>
        <Typography>{error}</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(to right, #446E6D, #37c0bd)'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white', 
            fontWeight: 700,
            textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
          }}
        >
          FAQ Management
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
          View, edit and manage your website&apos;s frequently asked questions
        </Typography>
      </Paper>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Search FAQs..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: '350px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => window.location.href = '/admin/create-faq'}
          sx={{ 
            height: '56px',
            backgroundColor: '#446E6D',
            '&:hover': {
              backgroundColor: '#37c0bd'
            }
          }}
        >
          Create New FAQ
        </Button>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={currentCategory} 
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            },
            '& .Mui-selected': {
              color: '#37c0bd'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#37c0bd'
            }
          }}
        >
          <Tab label="All FAQs" value="all" />
          {categories.filter(cat => cat !== "all").map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </Box>

      {currentCategory === "all" ? (
        // Show all categories with their FAQs
        Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
          <Box key={category} sx={{ mb: 6 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                color: '#446E6D',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Chip 
                label={category} 
                sx={{ 
                  backgroundColor: '#37c0bd', 
                  color: 'white',
                  fontWeight: 'bold' 
                }} 
              />
              <span>({categoryFaqs.length} FAQs)</span>
            </Typography>
            
            {renderFaqList(categoryFaqs)}
          </Box>
        ))
      ) : (
        // Show FAQs of selected category
        <Box>
          {groupedFaqs[currentCategory] && groupedFaqs[currentCategory].length > 0 ? (
            renderFaqList(groupedFaqs[currentCategory])
          ) : (
            <Paper 
              elevation={1} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                backgroundColor: '#f8f8f8',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" sx={{ color: '#666' }}>
                No FAQs found in this category
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {/* Edit FAQ Dialog */}
      <Dialog 
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ 
          sx: { 
            borderRadius: 2,
            p: 1
          } 
        }}
      >
        <DialogTitle 
          sx={{ 
            pb: 1, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Edit FAQ
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {currentFaq && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                  Related Service (Non-editable)
                </Typography>
                <TextField
                  value={currentFaq.relatedServices?.title || "Uncategorized"}
                  fullWidth
                  disabled
                  variant="outlined"
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#446E6D',
                      fontWeight: 600
                    }
                  }}
                />
              </Box>
              
              <TextField
                label="FAQ Title"
                value={currentFaq.title}
                onChange={handleTitleChange}
                fullWidth
                variant="outlined"
                required
                sx={{ mb: 4 }}
              />
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Questions & Answers
              </Typography>
              
              {currentFaq.questions.map((qa, index) => (
                <Paper 
                  key={index} 
                  elevation={1} 
                  sx={{ 
                    p: 3, 
                    mb: 3, 
                    position: 'relative',
                    borderLeft: '4px solid #37c0bd',
                    borderRadius: '4px'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: '#446E6D' 
                    }}
                  >
                    Question {index + 1}
                  </Typography>
                  
                  <TextField
                    label="Question"
                    value={qa.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                  
                  <TextField
                    label="Answer"
                    value={qa.answer}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                    fullWidth
                    required
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                  
                  <IconButton 
                    color="error" 
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                    onClick={() => removeQuestion(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              ))}
              
              <Button 
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addQuestion}
                sx={{ 
                  mb: 2,
                  borderColor: '#37c0bd',
                  color: '#37c0bd',
                  '&:hover': {
                    borderColor: '#446E6D',
                    backgroundColor: 'rgba(55, 192, 189, 0.1)'
                  }
                }}
              >
                Add Question
              </Button>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveFaq}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ 
              backgroundColor: '#37c0bd',
              '&:hover': {
                backgroundColor: '#446E6D'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  
  // Helper function to render a list of FAQs
  function renderFaqList(faqList) {
    return (
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {faqList.map(faq => (
          <Card 
            key={faq._id} 
            elevation={2}
            sx={{ 
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardHeader
              title={faq.title}
              action={
                <Box>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditFaq(faq)}
                    sx={{ 
                      color: '#446E6D',
                      '&:hover': { color: '#37c0bd' }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteFaq(faq._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
              titleTypographyProps={{
                variant: 'h6', 
                fontWeight: 600,
                color: '#333',
                sx: { 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }
              }}
              sx={{
                pb: 1,
                '& .MuiCardHeader-content': {
                  overflow: 'hidden'
                }
              }}
            />
            <Divider />
            <CardContent>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                {faq.questions.length} Question{faq.questions.length !== 1 ? 's' : ''}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {faq.questions[0].question}
              </Typography>
              
              <Button 
                variant="contained" 
                size="small"
                onClick={() => handleEditFaq(faq)}
                fullWidth
                sx={{ 
                  backgroundColor: '#446E6D',
                  '&:hover': {
                    backgroundColor: '#37c0bd'
                  }
                }}
              >
                Edit FAQ
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }
}