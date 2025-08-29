"use client"
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { motion, AnimatePresence } from 'framer-motion';
import { useKnowledgebase } from './layout';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const {
    knowledgebaseData,
    categories,
    loading,
    error,
    isSearching,
    searchResults,
    searchQuery,
    clearSearch,
    formatDate,
    getReadingTime
  } = useKnowledgebase();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');

  useEffect(() => {
    setSelectedCategory(categoryParam || '');
  }, [categoryParam]);

  // Function to handle category selection
  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    router.push(`/about/knowledgebase?category=${encodeURIComponent(categoryName)}`);
  };

  // Function to clear category selection
  const clearCategorySelection = () => {
    setSelectedCategory('');
    router.push('/about/knowledgebase');
  };

  // Get featured articles (4 most recent)
  const getFeaturedArticles = () => {
    return [...knowledgebaseData].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ).slice(0, 4);
  };

  // Filter articles by category
  const filteredArticles = selectedCategory
    ? categories.find(cat => cat.about === selectedCategory)?.articles || []
    : knowledgebaseData;

  return (
    <>
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
                  {searchResults.map((article, idx) => (
                    <motion.div
                      key={article._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => router.push(`/about/knowledgebase/${article.slug || article._id}`)}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-2/5 relative">
                          <div className="aspect-video w-full overflow-hidden">
                            <img
                              src={article.Image || '/placeholder-image.jpg'}
                              alt={article.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          {article.tags && article.tags.length > 0 && (
                            <div className="absolute top-3 right-3 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                              {article.tags[0]}
                            </div>
                          )}
                        </div>
                        <div className="md:w-3/5 p-5">
                          <div className="flex items-center gap-3 mb-2 text-gray-500 text-xs">
                            <span className="flex items-center gap-1">
                              <CalendarMonthIcon fontSize="inherit" />
                              {formatDate(article.updatedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <AccessTimeIcon />
                              {getReadingTime(article.introduction, article.mainSections)}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-[#446E6D] transition-colors cursor-pointer line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                            {article.introduction}
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

          {/* Featured Articles */}
          {!isSearching && !selectedCategory && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFeaturedArticles().map((article, idx) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                    onClick={() => router.push(`/about/knowledgebase/${article.slug || article._id}`)}
                  >
                    <div className="relative">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={article.Image || '/placeholder-image.jpg'}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {article.tags && article.tags.length > 0 && (
                        <div className="absolute top-3 right-3 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                          {article.tags[0]}
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-gray-500 text-xs mb-2">
                        <span className="flex items-center gap-1">
                          <CalendarMonthIcon fontSize="inherit" />
                          {formatDate(article.updatedAt)}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2 text-gray-800 hover:text-[#446E6D] transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                        {article.introduction}
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

          {/* Browse by Topic */}
          {!isSearching && !selectedCategory && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Topic</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3
                      className="text-xl font-bold text-[#446E6D] mb-4 cursor-pointer hover:text-[#37c0bd]"
                      onClick={() => handleCategorySelect(category.about)}
                    >
                      {category.about}
                    </h3>
                    <ul className="space-y-3">
                      {category.articles.slice(0, 5).map((article, idx) => (
                        <li
                          key={idx}
                          className="text-gray-700 hover:text-[#37c0bd] cursor-pointer flex items-center"
                          onClick={() => router.push(`/about/knowledgebase/${article.slug || article._id}`)}
                        >
                          <ArrowForwardIosIcon
                            fontSize="inherit"
                            className="mr-2 text-xs text-[#446E6D]"
                          />
                          <span className="line-clamp-1">{article.title}</span>
                        </li>
                      ))}
                    </ul>
                    {category.articles.length > 5 && (
                      <button
                        className="mt-4 text-[#446E6D] hover:text-[#37c0bd] text-sm font-medium"
                        onClick={() => handleCategorySelect(category.about)}
                      >
                        View all {category.articles.length} articles
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Articles List */}
          <AnimatePresence>
            <div>
              {selectedCategory && (
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedCategory}
                  </h2>
                  <button
                    className="text-[#446E6D] hover:text-[#37c0bd] text-sm flex items-center"
                    onClick={clearCategorySelection}
                  >
                    <KeyboardArrowLeftIcon fontSize="small" />
                    Back to all topics
                  </button>
                </div>
              )}

              {!isSearching && selectedCategory && (
                filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8">
                    {filteredArticles.map((article, idx) => (
                      <motion.div
                        key={article._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => router.push(`/about/knowledgebase/${article.slug || article._id}`)}
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-2/5 relative">
                            <div className="aspect-video w-full overflow-hidden">
                              <img
                                src={article.Image || '/placeholder-image.jpg'}
                                alt={article.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            {article.tags && article.tags.length > 0 && (
                              <div className="absolute top-3 right-3 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                                {article.tags[0]}
                              </div>
                            )}
                          </div>
                          <div className="md:w-3/5 p-6">
                            <div className="flex items-center gap-4 mb-2 text-gray-500 text-sm">
                              <span className="flex items-center gap-1">
                                <CalendarMonthIcon fontSize="inherit" />
                                {formatDate(article.updatedAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <AccessTimeIcon />
                                {getReadingTime(article.introduction, article.mainSections)}
                              </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-gray-800 hover:text-[#446E6D] transition-colors cursor-pointer line-clamp-2">
                              {article.title}
                            </h3>

                            <p className="text-gray-600 mb-6 line-clamp-3">
                              {article.introduction}
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
                  <div className="bg-white rounded-lg p-8 text-center border">
                    <p className="text-gray-600 mb-4">No articles found in this topic.</p>
                    <button
                      className="px-4 py-2 bg-[#446E6D] text-white rounded-md hover:bg-[#37c0bd] transition-colors"
                      onClick={clearCategorySelection}
                    >
                      View All Topics
                    </button>
                  </div>
                )
              )}
            </div>
          </AnimatePresence>
        </>
      )}
    </>
  );
}
