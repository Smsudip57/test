"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { motion } from 'framer-motion';
import { useKnowledgebase } from '../layout';
import axios from 'axios';

// Type definitions matching the knowledgebase schema
interface Bullet {
    style: "number" | "dot" | "roman";
    content: string;
}

interface MainSection {
    title: string;
    explanationType: "article" | "bullets";
    article?: string;
    bullets?: Bullet[];
    image?: string;
}

interface KnowledgebaseArticle {
    _id: string;
    title: string;
    Image?: string;
    introduction: string;
    mainSections: MainSection[];
    conclusion: string;
    tags: string[];
    relatedServices: Array<{
        _id: string;
        Title: string;
        [key: string]: any;
    }>;
    relatedIndustries: Array<{ _id: string; title: string;[key: string]: any }>;
    status: "draft" | "published" | "archived";
    createdAt: string;
    updatedAt: string;
    slug?: string;
}

export default function KnowledgebaseArticlePage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const { formatDate, getReadingTime, renderBulletPoints } = useKnowledgebase();

    const [article, setArticle] = useState<KnowledgebaseArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`/api/knowledgebase/get?slug=${slug}`);

                if (response.data.success && response.data.knowledgebase) {
                    setArticle(response.data.knowledgebase);
                } else {
                    setError("Knowledge base article not found");
                }
            } catch (error) {
                console.error("Error fetching knowledge base article:", error);
                setError("Failed to load article. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <p className="text-red-700">{error}</p>
                <div className="mt-4 space-x-4">
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                    <button
                        className="px-4 py-2 bg-[#446E6D] text-white rounded-md hover:bg-[#37c0bd] transition-colors"
                        onClick={() => router.push('/about/knowledgebase')}
                    >
                        Back to Knowledge Base
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
            {article.Image && (
                <div className="relative">
                    <div className="aspect-video w-full overflow-hidden">
                        <img
                            src={article.Image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {article.tags && article.tags.length > 0 && (
                        <div className="absolute top-4 right-4 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                            {article.tags[0]}
                        </div>
                    )}
                </div>
            )}

            <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                        <CalendarMonthIcon fontSize="inherit" />
                        {formatDate(article.updatedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                        <PersonIcon fontSize="inherit" />
                        <span>WEBME</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <AccessTimeIcon />
                        {getReadingTime(article.introduction, article.mainSections)}
                    </span>
                </div>

                {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {article.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                    {article.title}
                </h1>

                <div className="prose prose-lg max-w-none">
                    {/* Introduction */}
                    <p className="text-gray-700 mb-8 leading-relaxed text-lg whitespace-pre-line">
                        {article.introduction}
                    </p>

                    {/* Main Sections */}
                    <div className="space-y-10 mt-10">
                        {article.mainSections.map((section, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#446E6D]">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {index + 1}. {section.title}
                                </h2>

                                {section.image && (
                                    <div className="mb-4 mt-2">
                                        <img
                                            src={section.image}
                                            alt={`Illustration for ${section.title}`}
                                            className="rounded-lg w-full max-h-80 object-contain"
                                        />
                                    </div>
                                )}

                                {section.explanationType === 'article' ? (
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {section.article}
                                    </p>
                                ) : (
                                    renderBulletPoints(section.bullets || [])
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Conclusion */}
                    {article.conclusion && (
                        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#446E6D] mt-10">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Conclusion
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {article.conclusion}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                    <button
                        onClick={() => router.push('/about/knowledgebase')}
                        className="flex items-center text-[#446E6D] hover:text-[#37c0bd] transition-colors"
                    >
                        <KeyboardArrowLeftIcon fontSize="small" className="mr-1" />
                        Back to Knowledge Base
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
