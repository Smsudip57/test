"use client"
import React, { useState, useEffect, createContext, useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

interface BlogPost {
    _id: string;
    type: string;
    image: string;
    title: string;
    description: string;
    contents: string;
    createdAt: string;
    relatedServices?: string[];
    relatedIndustries?: string[];
    relatedProducts?: string[];
    relatedChikfdServices?: string[];
    slug?: string;
}

interface BlogContextType {
    blogData: BlogPost[];
    categories: string[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e?: React.FormEvent) => void;
    clearSearch: () => void;
    isSearching: boolean;
    searchResults: BlogPost[];
    getRecentPosts: () => BlogPost[];
    formatDate: (dateString: string) => string;
    getReadingTime: (description: string, contents: string) => string;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (context === undefined) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [blogData, setBlogData] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/blog/get");
                setBlogData(res.data.blogs);

                // Extract unique categories
                const uniqueCategories: string[] = Array.from(
                    new Set(res.data.blogs.map((item: BlogPost) => item.type))
                ).filter(Boolean) as string[];

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

    const formatDate = (dateString: string) => {
        if (!dateString) return 'No date';
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const getReadingTime = (description: string, contents: string) => {
        const wordsPerMinute = 100;

        const descriptionText = description || '';
        let totalWordCount = descriptionText.trim().split(/\s+/).filter(word => word.length > 0).length;

        const contentsText = (contents && typeof contents === 'string')
            ? contents.replace(/<[^>]*>/g, ' ').trim()
            : '';
        totalWordCount += contentsText.split(/\s+/).filter(word => word.length > 0).length;

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

        // Navigate to blog listing page with search
        if (pathname !== '/about/blog') {
            router.push('/about/blog');
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setSearchResults([]);
    };

    const getRecentPosts = () => {
        return [...blogData].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 4);
    };

    const contextValue: BlogContextType = {
        blogData,
        categories,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        handleSearch,
        clearSearch,
        isSearching,
        searchResults,
        getRecentPosts,
        formatDate,
        getReadingTime,
    };

    return (
        <BlogContext.Provider value={contextValue}>
            <div className="min-h-screen bg-gray-50 pt-16 relative z-20">
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="flex items-center text-sm text-gray-500">
                        <span
                            className="cursor-pointer hover:text-[#446E6D]"
                            onClick={() => router.push('/')}
                        >
                            Home
                        </span>
                        <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
                        <span
                            className="cursor-pointer hover:text-[#446E6D]"
                            onClick={() => router.push('/about/blog')}
                        >
                            Blog
                        </span>
                        {pathname !== '/about/blog' && (
                            <>
                                <KeyboardArrowRightIcon fontSize="small" className="mx-1" />
                                <span className="text-[#446E6D] font-medium">Article</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="flex flex-col lg:flex-row lg:gap-8">
                        {/* Main Content */}
                        <div className="lg:w-2/3">
                            {children}
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
                                        className={`w-full text-left flex items-center justify-between p-2 rounded-md transition-colors ${pathname === '/about/blog' ? 'bg-[#446E6D] text-white' : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        onClick={() => router.push('/about/blog')}
                                    >
                                        <span>All Posts</span>
                                        <span className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full">
                                            {blogData.length}
                                        </span>
                                    </button>

                                    {categories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full text-left flex items-center justify-between p-2 rounded-md transition-colors hover:bg-gray-100 text-gray-700"
                                            onClick={() => router.push(`/about/blog?category=${encodeURIComponent(cat)}`)}
                                        >
                                            <span>{cat}</span>
                                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                                                {blogData.filter(post => post.type === cat).length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Posts */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Posts</h3>
                                <div className="space-y-4">
                                    {getRecentPosts().map((post, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 cursor-pointer group"
                                            onClick={() => router.push(`/about/blog/${post.slug}`)}
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

                                    {getRecentPosts().length === 0 && (
                                        <p className="text-gray-500 text-center py-2">No recent posts found</p>
                                    )}
                                </div>
                            </div>

                            {/* Tags Cloud */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 text-sm rounded-full cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-[#446E6D] hover:text-white"
                                            onClick={() => router.push(`/about/blog?category=${encodeURIComponent(cat)}`)}
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
        </BlogContext.Provider>
    );
}
