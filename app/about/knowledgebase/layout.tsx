"use client"
import React, { useState, useEffect, createContext, useContext } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

// Type definitions matching the simplified knowledgebase schema
interface KnowledgebaseArticle {
    _id: string;
    title: string;
    Image?: string;
    introduction: string;
    contents: string;
    tags: string[];
    relatedServices?: string[] | { Title: string }[];
    relatedIndustries?: string[];
    relatedProducts?: string[];
    relatedChikfdServices?: string[];
    status: "draft" | "published" | "archived";
    createdAt: string;
    updatedAt: string;
    slug?: string;
    conclution?: string
}

interface CategoryWithArticles {
    about: string;
    articles: KnowledgebaseArticle[];
}

interface KnowledgebaseContextType {
    knowledgebaseData: KnowledgebaseArticle[];
    categories: CategoryWithArticles[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e?: React.FormEvent) => void;
    clearSearch: () => void;
    isSearching: boolean;
    searchResults: KnowledgebaseArticle[];
    getRecentArticles: () => KnowledgebaseArticle[];
    formatDate: (dateString: string) => string;
    getReadingTime: (introduction: string, contents: string) => string;
}

const KnowledgebaseContext = createContext<KnowledgebaseContextType | undefined>(undefined);

export const useKnowledgebase = () => {
    const context = useContext(KnowledgebaseContext);
    if (context === undefined) {
        throw new Error('useKnowledgebase must be used within a KnowledgebaseProvider');
    }
    return context;
};

export default function KnowledgebaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [knowledgebaseData, setKnowledgebaseData] = useState<KnowledgebaseArticle[]>([]);
    const [categories, setCategories] = useState<CategoryWithArticles[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<KnowledgebaseArticle[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/knowledgebase/get");

                if (res.data.success) {
                    const publishedArticles = res.data.knowledgebases.filter(
                        (article: KnowledgebaseArticle) => article.status === "published"
                    );

                    setKnowledgebaseData(publishedArticles);

                    // Process and organize data by categories
                    const organizedData = processKnowledgebaseData(publishedArticles);
                    setCategories(organizedData);
                } else {
                    setError("Failed to fetch knowledgebase data");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching knowledgebase data:", error);
                setError("Failed to load knowledgebase articles. Please try again later.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Process and organize knowledgebase data by categories
    const processKnowledgebaseData = (articles: KnowledgebaseArticle[]): CategoryWithArticles[] => {
        const categoryMap: Record<string, CategoryWithArticles> = {};

        articles.forEach((article:any) => {
            let categoryName = "General";
            if (article.relatedServices && article.relatedServices.length > 0) {
                categoryName = article?.relatedServices[0]?.Title;
            }

            if (!categoryMap[categoryName]) {
                categoryMap[categoryName] = {
                    about: categoryName,
                    articles: [],
                };
            }

            categoryMap[categoryName].articles.push(article);
        });

        return Object.values(categoryMap);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'No date';
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const getReadingTime = (introduction: string, contents: string) => {
        const wordsPerMinute = 200;

        // Count words in introduction (with fallback for undefined/null)
        const introductionText = introduction || '';
        let totalWordCount = introductionText.trim().split(/\s+/).filter(word => word.length > 0).length;

        // Count words in contents (strip HTML tags for word counting)
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

        const results = knowledgebaseData.filter((article:any) =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.introduction.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article?.conclusion.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(results);
        setIsSearching(true);

        // Navigate to knowledgebase listing page with search
        if (pathname !== '/about/knowledgebase') {
            router.push('/about/knowledgebase');
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setSearchResults([]);
    };

    const getRecentArticles = () => {
        return [...knowledgebaseData].sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ).slice(0, 4);
    };

    const contextValue: KnowledgebaseContextType = {
        knowledgebaseData,
        categories,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        handleSearch,
        clearSearch,
        isSearching,
        searchResults,
        getRecentArticles,
        formatDate,
        getReadingTime,
    };

    return (
        <KnowledgebaseContext.Provider value={contextValue}>
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
                            Knowledge Base
                        </motion.h1>
                        <motion.p
                            className="text-xl max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Find answers to your questions and learn more about our services and solutions
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
                            onClick={() => router.push('/about/knowledgebase')}
                        >
                            Knowledge Base
                        </span>
                        {pathname !== '/about/knowledgebase' && (
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
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Topics</h3>
                                <div className="space-y-2">
                                    <button
                                        className={`w-full text-left flex items-center justify-between p-2 rounded-md transition-colors ${pathname === '/about/knowledgebase' && !searchQuery ? 'bg-[#446E6D] text-white' : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        onClick={() => {
                                            clearSearch();
                                            router.push('/about/knowledgebase');
                                        }}
                                    >
                                        <span>All Articles</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${pathname === '/about/knowledgebase' && !searchQuery ? 'bg-white text-gray-700' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {knowledgebaseData.length}
                                        </span>
                                    </button>

                                    {categories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full text-left flex items-center justify-between p-2 rounded-md transition-colors hover:bg-gray-100 text-gray-700"
                                            onClick={() => {
                                                clearSearch();
                                                router.push(`/about/knowledgebase?category=${encodeURIComponent(cat.about)}`);
                                            }}
                                        >
                                            <span>{cat.about}</span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                                                {cat.articles.length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Articles */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Articles</h3>
                                <div className="space-y-4">
                                    {getRecentArticles().map((article, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 cursor-pointer group"
                                            onClick={() => router.push(`/about/knowledgebase/${article.slug}`)}
                                        >
                                            <div className="w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                <img
                                                    src={article.Image || '/placeholder-image.jpg'}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-800 group-hover:text-[#446E6D] transition-colors line-clamp-2 text-sm">
                                                    {article.title}
                                                </h4>
                                                <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <CalendarMonthIcon fontSize="inherit" />
                                                    {formatDate(article.updatedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {getRecentArticles().length === 0 && (
                                        <p className="text-gray-500 text-center py-2">No recent articles found</p>
                                    )}
                                </div>
                            </div>

                            {/* Tags Cloud */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(
                                        new Set(knowledgebaseData.flatMap(article => article.tags || []))
                                    ).slice(0, 12).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 text-sm rounded-full cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-[#446E6D] hover:text-white"
                                            onClick={() => {
                                                setSearchQuery(tag);
                                                handleSearch();
                                            }}
                                        >
                                            {tag}
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
                            <p className="mb-6 opacity-90">Stay updated with our latest articles, insights and knowledge base updates</p>
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
        </KnowledgebaseContext.Provider>
    );
}
