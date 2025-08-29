"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { motion } from 'framer-motion';
import { useBlog } from '../layout';
import axios from 'axios';

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
    slug?: string;
}

export default function BlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const { formatDate, getReadingTime } = useBlog();

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/blog/get?slug=${encodeURIComponent(slug)}`);
                if (res.data.success && res.data.blog) {
                    setBlog(res.data.blog);
                } else {
                    setError("Blog post not found");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching blog:", error);
                setError("Failed to load blog post. Please try again later.");
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    // Helper function to render bullet points with proper styling
    const renderBullets = (bullets: Bullet[]) => {
        return (
            <ul className="space-y-2 mt-3 ml-6">
                {bullets.map((bullet, idx) => {
                    if (bullet.style === "number") {
                        return (
                            <li key={idx} className="list-decimal">
                                {bullet.content}
                            </li>
                        );
                    } else if (bullet.style === "roman") {
                        return (
                            <li key={idx} className="list-[lower-roman]">
                                {bullet.content}
                            </li>
                        );
                    } else {
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

    if (error || !blog) {
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
                        onClick={() => router.push('/about/blog')}
                    >
                        Back to Blog
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
            <div className="relative">
                <div className="aspect-video w-full overflow-hidden">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute top-4 right-4 bg-[#446E6D] text-white py-1 px-3 rounded-full text-xs font-semibold">
                    {blog.type}
                </div>
            </div>

            <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                        <CalendarMonthIcon fontSize="inherit" />
                        {formatDate(blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                        <PersonIcon fontSize="inherit" />
                        <span>WEBME</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <AccessTimeIcon />
                        {getReadingTime(blog.description, blog.points)}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                    {blog.title}
                </h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 mb-8 leading-relaxed whitespace-pre-line">
                        {blog.description}
                    </p>

                    <div className="space-y-10 mt-10">
                        {blog.points.map((point, index) => (
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
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {point?.article ? point.article : point?.explanation}
                                    </p>
                                ) : (
                                    renderBullets(point.bullets || [])
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200">
                    <button
                        onClick={() => router.push('/about/blog')}
                        className="flex items-center text-[#446E6D] hover:text-[#37c0bd] transition-colors"
                    >
                        <KeyboardArrowLeftIcon fontSize="small" className="mr-1" />
                        Back to all posts
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
