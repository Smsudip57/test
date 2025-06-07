"use client"
import React, { useState, useEffect, useRef } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface Bullet {
  style: "number" | "dot" | "roman";
  content: string;
}

interface Point {
  title: string;
  explanationType: 'article' | 'bullets';
  article?: string;
  explanation?: string;
  bullets?: Bullet[];
  image?: string | null;
}

interface BlogPost {
  _id: string;
  type: string;
  image: string;
  title: string;
  description: string;
  points: Point[];
  createdAt: string;
  relatedService?: string;
  relatedIndustries?: string;
}

export default function Page() {
  const [blogData, setBlogData] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [single, setSingle] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const blogContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/blog/get");
        setBlogData(res.data.blogs);
        
        // Extract unique categories
        const uniqueCategories:any = Array.from(
          new Set(res.data.blogs.map((item: BlogPost) => item.type))
        ).filter(Boolean);
        
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setError("Failed to load blog posts. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Scroll to top when viewing a single post
    if (single && blogContentRef.current) {
      blogContentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [single]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };
  
  // Updated to handle new content structure
  const getReadingTime = (content: string, points: Point[]) => {
    const wordsPerMinute = 200;
    let totalWordCount = content.trim().split(/\s+/).length;
    
    // Add words from points
    points.forEach(point => {
      if (point.explanationType === 'article' && point.article) {
        totalWordCount += point.article.trim().split(/\s+/).length;
      } else if (point.explanationType === 'bullets' && point.bullets) {
        point.bullets.forEach(bullet => {
          totalWordCount += bullet.content.trim().split(/\s+/).length;
        });
      }
    });
    
    const readingTime = Math.ceil(totalWordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    const results = blogData.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearching(true);
    setSingle(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const getFeaturedPosts = () => {
    // Get the 3 most recent posts as featured
    return [...blogData].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 3);
  };

  // Filter posts by category
  const filteredPosts = category 
    ? blogData.filter(post => post.type === category)
    : blogData;

  // Get posts related to current category or single post
  const getRelatedPosts = () => {
    if (single) {
      return blogData
        .filter(post => post._id !== single._id && post.type === single.type)
        .slice(0, 4);
    } else if (category) {
      return blogData
        .filter(post => post.type === category)
        .slice(0, 4);
    } else {
      return blogData.slice(0, 4);
    }
  };

  // Helper function to render bullet points with proper styling
  const renderBullets = (bullets: Bullet[]) => {
    return (
      <ul className="space-y-2 mt-3 ml-6">
        {bullets.map((bullet, idx) => {
          let bulletStyle = "";
          
          if (bullet.style === "number") {
            return (
              <li key={idx} className="list-decimal">
                {bullet.content}
              </li>
            );
          } else if (bullet.style === "roman") {
            // Using CSS counter for roman numerals
            return (
              <li key={idx} className="list-[lower-roman]">
                {bullet.content}
              </li>
            );
          } else { // dot style
            return (
              <li key={idx} className="list-disc">
                {bullet.content}
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 relative z-20" id="blog-content" ref={blogContentRef}>
      {/* Hero Section */}
      <div className="bg-[#446E6D] text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            WEBME Blog
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Insights, news and expert perspectives on digital transformation
          </motion.p>
          
          {/* Search Form */}
          <motion.form 
            className="mt-8 max-w-2xl mx-auto flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full py-3 px-5 rounded-l-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#37c0bd] shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-[#37c0bd] hover:bg-[#2a9d99] py-3 px-6 rounded-r-full text-white transition-colors shadow-lg"
            >
              <SearchIcon />
            </button>
          </motion.form>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 ">
        <div className="flex items-center text-sm text-gray-500">
          <span 
            className="cursor-pointer hover:text-[#446E6D]"
            onClick={() => {setCategory(''); setSingle(null); clearSearch();}}
          >
            Home
          </span>
          
          {category && (
            <>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
              <span className="text-[#446E6D] font-medium">{category}</span>
            </>
          )}
          
          {single && (
            <>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
              {category && (
                <>
                  <span 
                    className="cursor-pointer hover:text-[#446E6D]"
                    onClick={() => {setSingle(null);}}
                  >
                    {category}
                  </span>
                  <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
                </>
              )}
              <span className="text-[#446E6D] font-medium truncate max-w-xs">{single.title}</span>
            </>
          )}
          
          {isSearching && (
            <>
              <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
              <span className="text-[#446E6D] font-medium">Search Results</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <p className="text-red-700">{error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Search Results */}
                {isSearching && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Search Results for &quot;{searchQuery}&quot;
                      </h2>
                      <button 
                        onClick={clearSearch} 
                        className="text-gray-500 hover:text-[#446E6D] flex items-center"
                      >
                        <CloseIcon fontSize="small" className="mr-1" />
                        Clear
                      </button>
                    </div>
                    
                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {searchResults.map((post, idx) => (
                          <motion.div 
                            key={post._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={() => setSingle(post)}
                          >
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-2/5 relative">
                                <div className="aspect-video w-full overflow-hidden">
                                  <img 
                                    src={post.image} 
                                    alt={post.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                                <div className="absolute top-3 right-3 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                                  {post.type}
                                </div>
                              </div>
                              <div className="md:w-3/5 p-5">
                                <div className="flex items-center gap-3 mb-2 text-gray-500 text-xs">
                                  <span className="flex items-center gap-1">
                                    <CalendarMonthIcon fontSize="inherit" />
                                    {formatDate(post.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <AccessTimeIcon fontSize="inherit" />
                                    {getReadingTime(post.description, post.points)}
                                  </span>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-[#446E6D] transition-colors cursor-pointer line-clamp-2">
                                  {post.title}
                                </h3>
                                
                                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                  {post.description}
                                </p>
                                
                                <button 
                                  className="text-sm py-2 px-4 bg-[#446E6D] text-white rounded-md hover:bg-[#37c0bd] transition-colors flex items-center gap-1"
                                >
                                  Read More
                                  <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                                </button>
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
                          onClick={clearSearch}
                        >
                          Clear Search
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Featured Posts */}
                {!single && !isSearching && !category && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {getFeaturedPosts().map((post, idx) => (
                        <motion.div 
                          key={post._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                          onClick={() => setSingle(post)}
                        >
                          <div className="relative">
                            <div className="aspect-video w-full overflow-hidden">
                              <img 
                                src={post.image} 
                                alt={post.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="absolute top-3 right-3 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                              {post.type}
                            </div>
                          </div>
                          <div className="p-5 flex flex-col flex-grow">
                            <div className="flex items-center gap-3 text-gray-500 text-xs mb-2">
                              <span className="flex items-center gap-1">
                                <CalendarMonthIcon fontSize="inherit" />
                                {formatDate(post.createdAt)}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-bold mb-2 text-gray-800 hover:text-[#446E6D] transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                              {post.description}
                            </p>
                            
                            <button className="text-[#446E6D] font-medium text-sm hover:text-[#37c0bd] transition-colors flex items-center mt-auto self-start">
                              Read More
                              <ArrowForwardIosIcon style={{ fontSize: '12px' }} className="ml-1" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blog Posts List */}
                {!single && (
                  <AnimatePresence>
                    <div>
                      {category && (
                        <div className="mb-6 flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-gray-800">
                            {category}
                          </h2>
                          <button 
                            className="text-[#446E6D] hover:text-[#37c0bd] text-sm flex items-center"
                            onClick={() => setCategory('')}
                          >
                            <KeyboardArrowLeftIcon fontSize="small" />
                            Back to all posts
                          </button>
                        </div>
                      )}

                      {!isSearching && (
                        filteredPosts.length > 0 ? (
                          <div className="grid grid-cols-1 gap-8">
                            {filteredPosts.map((post, idx) => (
                              <motion.div 
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                onClick={() => setSingle(post)}
                              >
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-2/5 relative">
                                    <div className="aspect-video w-full overflow-hidden">
                                      <img 
                                        src={post.image} 
                                        alt={post.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                      />
                                    </div>
                                    <div className="absolute top-3 right-3 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                                      {post.type}
                                    </div>
                                  </div>
                                  <div className="md:w-3/5 p-6">
                                    <div className="flex items-center gap-4 mb-2 text-gray-500 text-sm">
                                      <span className="flex items-center gap-1">
                                        <CalendarMonthIcon fontSize="inherit" />
                                        {formatDate(post.createdAt)}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <AccessTimeIcon fontSize="inherit" />
                                        {getReadingTime(post.description, post.points)}
                                      </span>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-3 text-gray-800 hover:text-[#446E6D] transition-colors cursor-pointer line-clamp-2">
                                      {post.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                      {post.description}
                                    </p>
                                    
                                    <button className="text-md py-2.5 px-6 bg-[#446E6D] text-white rounded-md hover:bg-[#37c0bd] transition-colors flex items-center gap-2 font-medium">
                                      Read More
                                      <ArrowForwardIosIcon style={{ fontSize: '14px' }} />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          category && (
                            <div className="bg-white rounded-lg p-8 text-center border">
                              <p className="text-gray-600 mb-4">No posts found in this category.</p>
                              <button 
                                className="px-4 py-2 bg-[#446E6D] text-white rounded-md hover:bg-[#37c0bd] transition-colors"
                                onClick={() => setCategory('')}
                              >
                                View All Posts
                              </button>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </AnimatePresence>
                )}

                {/* Single Blog Post */}
                {single && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="relative">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={single.image} 
                          alt={single.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-4 right-4 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                        {single.type}
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-10">
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-1">
                          <CalendarMonthIcon fontSize="inherit" />
                          {formatDate(single.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <PersonIcon fontSize="inherit" />
                          <span>WEBME</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <AccessTimeIcon fontSize="inherit" />
                          {getReadingTime(single.description, single.points)}
                        </span>
                      </div>
                      
                      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                        {single.title}
                      </h1>
                      
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 mb-8 leading-relaxed whitespace-pre-line">
                          {single.description}
                        </p>
                        
                        <div className="space-y-10 mt-10">
                          {single.points.map((point, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#446E6D]">
                              <h2 className="text-xl font-bold text-gray-800 mb-4">
                                {index + 1}. {point.title}
                              </h2>
                              
                              {point.image && (
                                <div className="mb-4 mt-2">
                                  <img 
                                    src={point.image} 
                                    alt={`Illustration for ${point.title}`}
                                    className="rounded-lg w-full max-h-80 object-contain"
                                  />
                                </div>
                              )}

                              {point.explanationType === 'article' ? (
                                // Article content with preserved whitespace
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                  {point?.article ? point.article : point?.explanation}
                                </p>
                              ) : (
                                // Bullet points with different styles
                                renderBullets(point.bullets || [])
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-10 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setSingle(null)}
                          className="flex items-center text-[#446E6D] hover:text-[#37c0bd] transition-colors"
                        >
                          <KeyboardArrowLeftIcon fontSize="small" className="mr-1" />
                          Back to all posts
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            {/* Search Box */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Search</h3>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#446E6D]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-[#446E6D] hover:bg-[#37c0bd] p-2 text-white rounded-r-md transition-colors"
                >
                  <SearchIcon />
                </button>
              </form>
            </div>
            
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  className={`w-full text-left flex items-center justify-between p-2 rounded-md transition-colors ${
                    !category ? 'bg-[#446E6D] text-white' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => { setCategory(''); setSingle(null); }}
                >
                  <span>All Posts</span>
                  <span className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full">
                    {blogData.length}
                  </span>
                </button>
                
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`w-full text-left flex items-center justify-between p-2 rounded-md transition-colors ${
                      category === cat ? 'bg-[#446E6D] text-white' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    onClick={() => { setCategory(cat); setSingle(null); }}
                  >
                    <span>{cat}</span>
                    <span className={`${category === cat ? 'bg-white text-gray-700' : 'bg-gray-200 text-gray-700'} text-xs px-2 py-1 rounded-full`}>
                      {blogData.filter(post => post.type === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Related Posts */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {single ? 'Related Posts' : 'Recent Posts'}
              </h3>
              <div className="space-y-4">
                {getRelatedPosts().map((post, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 cursor-pointer group"
                    onClick={() => setSingle(post)}
                  >
                    <div className="w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 group-hover:text-[#446E6D] transition-colors line-clamp-2 text-sm">
                        {post.title}
                      </h4>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <CalendarMonthIcon fontSize="inherit" />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {getRelatedPosts().length === 0 && (
                  <p className="text-gray-500 text-center py-2">No related posts found</p>
                )}
              </div>
            </div>
            
            {/* Tags Cloud (using categories for now) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, idx) => (
                  <span 
                    key={idx}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${
                      category === cat 
                        ? 'bg-[#446E6D] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-[#446E6D] hover:text-white'
                    }`}
                    onClick={() => { setCategory(cat); setSingle(null); }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-[#446E6D] text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <BookmarkIcon className="text-4xl mb-4" />
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="mb-6 opacity-90">Stay updated with our latest articles, industry insights and company news</p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-l-md sm:rounded-r-none rounded-r-md text-gray-800 flex-grow focus:outline-none focus:ring-2 focus:ring-[#37c0bd] focus:ring-offset-2 focus:ring-offset-[#446E6D]"
                required
              />
              <button type="submit" className="bg-[#37c0bd] hover:bg-[#2a9d99] px-6 py-3 rounded-r-md sm:rounded-l-none rounded-l-md font-medium transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}