"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Type definitions
interface SubPoint {
  title: string;
  description: string;
}

interface Section {
  title: string;
  content: string;
  points: SubPoint[];
}

interface ApiArticle {
  _id: string;
  title: string;
  introduction: string;
  mainSections: Section[];
  conclusion: string;
  tags: string[];
  Image?: string; // Added Image field
  relatedServices: {
    _id: string;
    title: string;
    [key: string]: any;
  } | null;
  relatedIndustries: Array<{ _id: string; title: string; [key: string]: any }>;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface UiPoint {
  title: string;
  explain: string;
  points?: UiPoint[];
}

interface UiArticle {
  _id: string; // Added _id field
  title: string;
  explain: string;
  image?: string; // Added image field
  points: UiPoint[];
  updatedAt: string; // Added updatedAt field
  tags: string[]; // Added tags field
}

interface CategoryWithArticles {
  about: string;
  articles: UiArticle[];
}

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<CategoryWithArticles[]>([]);
  const [category, setCategory] = useState<string>('');
  const [single, setSingle] = useState<UiArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredArticles, setFilteredArticles] = useState<UiArticle[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Fetch knowledgebase data when component mounts
  useEffect(() => {
    const fetchKnowledgebase = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; knowledgebases: ApiArticle[] }>('/api/knowledgebase/get');
        
        if (response.data.success) {
          // Process and organize the data
          const organizedData = processKnowledgebaseData(response.data.knowledgebases);
          setBlogData(organizedData);
        } else {
          setError('Failed to fetch knowledgebase data');
        }
      } catch (err) {
        console.error('Error fetching knowledgebase:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgebase();
  }, []);

  // Function to process and organize knowledgebase data
  const processKnowledgebaseData = (knowledgebases: ApiArticle[]): CategoryWithArticles[] => {
    // Group articles by their related services (categories)
    const categoryMap: Record<string, CategoryWithArticles> = {};
    
    knowledgebases.forEach(article => {
      if (article.status !== 'published') return;
      
      // Get the category name from relatedServices
      let categoryName = 'Uncategorized';
      if (article.relatedServices && article.relatedServices.Title) {
        categoryName = article.relatedServices.Title;
      }
      
      // Create category if it doesn't exist
      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = {
          about: categoryName,
          articles: []
        };
      }
      
      // Format article for our UI structure
      const formattedArticle: UiArticle = {
        _id: article._id,
        title: article.title,
        explain: article.introduction,
        image: article.Image, // Include image if available
        points: [],
        updatedAt: article.updatedAt,
        tags: article.tags || []
      };
      
      // Add main sections
      if (article.mainSections && article.mainSections.length > 0) {
        article.mainSections.forEach(section => {
          const formattedSection: UiPoint = {
            title: section.title,
            explain: section.content,
            points: []
          };
          
          // Add points to section
          if (section.points && section.points.length > 0) {
            section.points.forEach(point => {
              formattedSection.points?.push({
                title: point.title,
                explain: point.description
              });
            });
          }
          
          formattedArticle.points.push(formattedSection);
        });
      }
      
      // Add conclusion as a section
      if (article.conclusion) {
        formattedArticle.points.push({
          title: 'Conclusion',
          explain: article.conclusion,
          points: []
        });
      }
      
      // Add article to its category
      categoryMap[categoryName].articles.push(formattedArticle);
    });
    
    // Convert the map to an array
    return Object.values(categoryMap);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    
    if (e.target.value.trim() === '') {
      setFilteredArticles([]);
      setShowSearch(false);
      return;
    }
    
    // Filter articles based on search query
    const results: UiArticle[] = [];
    blogData.forEach(category => {
      category.articles.forEach(article => {
        if (
          article.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
          article.explain.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          results.push(article);
        }
      });
    });
    
    setFilteredArticles(results);
    setShowSearch(true);
  };

  // Handle search submission
  const handleSearch = (e: React.MouseEvent<HTMLDivElement> | React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setShowSearch(false);
      return;
    }
    
    // Filter articles based on search query
    const results: UiArticle[] = [];
    blogData.forEach(category => {
      category.articles.forEach(article => {
        if (
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.explain.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push(article);
        }
      });
    });
    
    setFilteredArticles(results);
    setShowSearch(true);
  };

  // Get all articles for featured section
  const getAllArticles = (): UiArticle[] => {
    const allArticles: UiArticle[] = [];
    blogData.forEach(category => {
      category.articles.forEach(article => {
        allArticles.push(article);
      });
    });
    return allArticles;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Estimated reading time
  const getReadingTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className='pt-16 min-h-screen bg-gray-50' id="read-more">
      {/* Hero Section */}
      <div className='w-full bg-[#446E6D] py-16 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold text-center mb-6'>Knowledge Base</h1>
          <p className='text-lg md:text-xl text-center max-w-3xl mx-auto mb-8 opacity-90'>
            Find answers to your questions and learn more about our services and solutions
          </p>
          
          {/* Search box in hero section */}
          <div className='max-w-2xl mx-auto'>
            <div className='relative'>
              <input 
                className='w-full py-4 px-6 rounded-full text-gray-800 text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#37c0bd] transition-all duration-300'
                name='search'
                placeholder='Search for articles...'
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button 
                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#37c0bd] hover:bg-[#2a9d99] p-3 rounded-full shadow-md transition-all duration-300'
                onClick={handleSearch as any}
              >
                <SearchIcon className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center'>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-full w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-full w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-full w-1/4 mx-auto mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className='max-w-8xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center'>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <p className='text-xl text-red-700'>{error}</p>
            <button 
              className='mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative z-20'>
          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <span 
              className="cursor-pointer hover:text-[#446E6D] flex items-center" 
              onClick={() => {setCategory(''); setSingle(null); setShowSearch(false);}}
            >
              Home
            </span>
            
            {(category || single || showSearch) && (
              <>
                <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
                <span 
                  className={`cursor-pointer ${!single && !showSearch ? 'text-[#446E6D] font-medium' : 'hover:text-[#446E6D]'}`}
                  onClick={() => {setCategory(''); setSingle(null); setShowSearch(false);}}
                >
                  Topics
                </span>
              </>
            )}
            
            {category && (
              <>
                <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
                <span className="text-[#446E6D] font-medium">{category}</span>
              </>
            )}
            
            {single && (
              <>
                <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
                <span className="text-[#446E6D] font-medium truncate max-w-xs">{single.title}</span>
              </>
            )}
            
            {showSearch && (
              <>
                <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
                <span className="text-[#446E6D] font-medium">Search Results</span>
              </>
            )}
          </div>

          <div className='flex flex-col lg:flex-row lg:items-start gap-8'>
            {/* Main content area */}
            <div className='lg:w-2/3 order-2 lg:order-1'>
              {/* Back button for mobile */}
              {(category || single || showSearch) && (
                <button 
                  className="lg:hidden flex items-center text-[#446E6D] mb-6 hover:underline"
                  onClick={() => {
                    if (single) { 
                      setSingle(null);
                      setCategory(category || '');
                    } else {
                      setCategory('');
                      setShowSearch(false);
                    }
                  }}
                >
                  <ArrowBackIcon fontSize="small" className="mr-1" />
                  Back
                </button>
              )}

              {/* Search results */}
              {showSearch && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Search Results for &quot;{searchQuery}&quot;
                  </h2>
                  
                  {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredArticles.map((article, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                          onClick={() => {setSingle(article); setShowSearch(false);}}
                        >
                          <div className="flex flex-col sm:flex-row">
                            {article.image && (
                              <div className="sm:w-1/3 h-48 sm:h-auto">
                                <img 
                                  src={article.image} 
                                  alt={article.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className={`p-6 ${article.image ? 'sm:w-2/3' : 'w-full'}`}>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-[#37c0bd] cursor-pointer">
                                {article.title}
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-2">{article.explain}</p>
                              <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span className="flex items-center">
                                  <CalendarMonthIcon fontSize="small" className="mr-1" />
                                  {formatDate(article.updatedAt)}
                                </span>
                                <span className="flex items-center">
                                  <AccessTimeIcon fontSize="small" className="mr-1" />
                                  {getReadingTime(article.explain)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-8 text-center border">
                      <p className="text-gray-600 mb-4">No articles found matching your search.</p>
                      <button 
                        className="px-4 py-2 bg-[#446E6D] text-white rounded-md hover:bg-[#37c0bd] transition-colors"
                        onClick={() => {setSearchQuery(''); setShowSearch(false);}}
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Featured articles section */}
              {!category && !single && !showSearch && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getAllArticles().slice(0, 4).map((article, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => {setSingle(article); setCategory('');}}
                      >
                        {article.image && (
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-[#37c0bd]">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{article.explain}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <CalendarMonthIcon fontSize="small" className="mr-1" />
                              {formatDate(article.updatedAt)}
                            </span>
                            <span className="flex items-center">
                              <AccessTimeIcon fontSize="small" className="mr-1" />
                              {getReadingTime(article.explain)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display all topics and their articles */}
              {!category && !single && !showSearch && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Topic</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12'>
                    {blogData.filter(item => item.articles && item.articles.length > 0).map((item, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <h3 
                          className='text-xl font-bold text-[#446E6D] mb-4 cursor-pointer hover:text-[#37c0bd]' 
                          onClick={() => {setCategory(item.about); setSingle(null)}}
                        >
                          {item.about}
                        </h3>
                        <ul className='space-y-3'>
                          {item.articles && item.articles.slice(0, 5).map((article, idx) => (
                            <li 
                              className='text-gray-700 hover:text-[#37c0bd] cursor-pointer flex items-center' 
                              key={idx} 
                              onClick={() => {setSingle(article); setCategory('');}}
                            >
                              <ArrowForwardIosIcon fontSize='inherit' className='mr-2 text-xs text-[#446E6D]' />
                              <span className="line-clamp-1">{article.title}</span>
                            </li>
                          ))}
                        </ul>
                        {item.articles.length > 5 && (
                          <button 
                            className="mt-4 text-[#446E6D] hover:text-[#37c0bd] text-sm font-medium"
                            onClick={() => {setCategory(item.about); setSingle(null)}}
                          >
                            View all {item.articles.length} articles
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display articles in selected category */}
              {category && !single && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{category}</h2>
                  {blogData.filter(item => item.about === category).map((item, index) => (
                    <div key={index} className="mb-8">
                      {item.articles && item.articles.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                          {item.articles.map((article, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                              onClick={() => {setSingle(article); setCategory('');}}
                            >
                              <div className="flex flex-col sm:flex-row">
                                {article.image && (
                                  <div className="sm:w-1/3 h-48 sm:h-auto">
                                    <img 
                                      src={article.image} 
                                      alt={article.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className={`p-6 ${article.image ? 'sm:w-2/3' : 'w-full'}`}>
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-[#37c0bd] cursor-pointer">
                                    {article.title}
                                  </h3>
                                  <p className="text-gray-600 mb-4 line-clamp-3">{article.explain}</p>
                                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                                    <span className="flex items-center">
                                      <CalendarMonthIcon fontSize="small" className="mr-1" />
                                      {formatDate(article.updatedAt)}
                                    </span>
                                    <span className="flex items-center">
                                      <AccessTimeIcon fontSize="small" className="mr-1" />
                                      {getReadingTime(article.explain)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-8 text-center border">
                          <p className="text-gray-600">No articles found in this topic.</p>
                          <button 
                            className="mt-4 px-4 py-2 bg-[#446E6D] text-white rounded-md hover:bg-[#37c0bd] transition-colors"
                            onClick={() => {setCategory(''); setSingle(null);}}
                          >
                            Browse All Topics
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Display single article */}
              {single && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {single.image && (
                    <div className="w-full h-64 md:h-80 overflow-hidden">
                      <img 
                        src={single.image} 
                        alt={single.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{single.title}</h1>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
                      <span className="flex items-center">
                        <CalendarMonthIcon fontSize="small" className="mr-1" />
                        {formatDate(single.updatedAt)}
                      </span>
                      <span className="flex items-center">
                        <AccessTimeIcon fontSize="small" className="mr-1" />
                        {getReadingTime(single.explain)}
                      </span>
                    </div>
                    
                    {single.tags && single.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {single.tags.map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 mb-8 leading-relaxed">{single.explain}</p>
                      
                      {single.points && single.points.map((item, index) => (
                        <div key={index} className="mb-8">
                          {item.title && (
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h2>
                          )}
                          
                          {item.explain && (
                            <p className="text-gray-700 mb-6 leading-relaxed">{item.explain}</p>
                          )}
                          
                          {item.points && item.points.length > 0 && (
                            <div className="space-y-6 ml-4 border-l-4 border-[#446E6D] pl-6">
                              {item.points.map((point, idx) => (
                                <div key={idx} className="bg-gray-50 p-6 rounded-lg">
                                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{point.title}</h3>
                                  <p className="text-gray-700 leading-relaxed">{point.explain}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className='lg:w-1/3 order-1 lg:order-2 space-y-6'>
              {/* Search box in sidebar */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-bold text-gray-800 mb-4'>Search</h3>
                <div className='relative'>
                  <input 
                    className='w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#446E6D] transition-all'
                    name='search'
                    placeholder='Search articles...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button 
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#446E6D]'
                    onClick={handleSearch as any}
                  >
                    <SearchIcon />
                  </button>
                </div>
              </div>
              
              {/* Topics sidebar */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-bold text-gray-800 mb-4'>Topics</h3>
                <ul className='space-y-3'>
                  {blogData.map((item, index) => (
                    <li key={index}>
                      <button 
                        className={`w-full text-left flex items-center py-2 px-3 rounded-md transition-colors ${category === item.about ? 'bg-[#446E6D] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => {setCategory(item.about); setSingle(null);}}
                      >
                        <ArrowForwardIosIcon fontSize='inherit' className={`mr-2 text-xs ${category === item.about ? 'text-white' : 'text-[#446E6D]'}`} />
                        <span>{item.about}</span>
                        <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {item.articles.length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Recent articles */}
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-bold text-gray-800 mb-4'>Recent Articles</h3>
                <ul className='space-y-4'>
                  {getAllArticles().slice(0, 5).map((article, idx) => (
                    <li key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <button 
                        className='w-full text-left group'
                        onClick={() => {setSingle(article); setCategory('');}}
                      >
                        <h4 className="text-gray-700 font-medium group-hover:text-[#446E6D] line-clamp-2">{article.title}</h4>
                        <span className="text-xs text-gray-500 mt-1 flex items-center">
                          <CalendarMonthIcon fontSize="inherit" className="mr-1" />
                          {formatDate(article.updatedAt)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Tags cloud */}
              {getAllArticles().some(article => article.tags && article.tags.length > 0) && (
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4'>Popular Tags</h3>
                  <div className='flex flex-wrap gap-2'>
                    {Array.from(new Set(getAllArticles().flatMap(article => article.tags || []))).slice(0, 12).map((tag, idx) => (
                      <span 
                        key={idx} 
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-[#446E6D] hover:text-white transition-colors"
                        onClick={() => {
                          setSearchQuery(tag);
                          handleSearch({ preventDefault: () => {} } as any);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}