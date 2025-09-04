"use client"
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlog } from './layout';

// Force dynamic rendering  
export const dynamic = 'force-dynamic';

function BlogPageContent() {
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const categoryParam: any = searchParams.get('category');

  const {
    blogData,
    loading,
    error,
    isSearching,
    searchResults,
    searchQuery,
    clearSearch,
    formatDate,
    getReadingTime
  } = useBlog();

  const [category, setCategory] = useState(categoryParam || '');

  useEffect(() => {
    setCategory(categoryParam || '');
  }, [categoryParam]);

  // Get featured posts (3 most recent)
  const getFeaturedPosts = () => {
    return [...blogData].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 3);
  };

  // Filter posts by category
  const filteredPosts = category
    ? blogData.filter(post => post.type === category)
    : blogData;

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
                  {searchResults.map((post, idx) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => router.push(`/about/blog/${post?.slug}`)}
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
                              <AccessTimeIcon />
                              {getReadingTime(post.description, post.contents)}
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
          {!isSearching && !category && (
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
                    onClick={() => router.push(`/about/blog/${post.slug}`)}
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
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => router.push(`/about/blog/${post.slug}`)}
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
                                <AccessTimeIcon />
                                {getReadingTime(post.description, post.contents)}
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
        </>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#446E6D]"></div>
    </div>}>
      <BlogPageContent />
    </Suspense>
  );
}