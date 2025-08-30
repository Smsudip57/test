"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Calendar, Tag, ExternalLink } from 'lucide-react';
import Video from '@/components/shaerd/Video';

interface Project {
    _id: string;
    Title: string;
    slug: string;
    detail: string;
    media: {
        url: string;
        type: 'image' | 'video';
    };
    relatedServices: string[];
    relatedProducts: string[];
    relatedChikfdServices: string[];
    createdAt: string;
    updatedAt: string;
}

interface CategoryMappings {
    serviceMap: Record<string, string>;
    productMap: Record<string, string>;
    childServiceMap: Record<string, string>;
}

interface ProjectCardProps {
    project: Project;
    categoryMappings: CategoryMappings;
    activeVideo: string | null;
    toggleVideo: (projectId: string) => void;
    layout: 'grid' | 'list';
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    categoryMappings,
    activeVideo,
    toggleVideo,
    layout
}) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    // Get project categories
    const getProjectCategories = () => {
        const categories: string[] = [];

        project.relatedServices?.forEach(serviceId => {
            const serviceName = categoryMappings.serviceMap[serviceId];
            if (serviceName) categories.push(serviceName);
        });

        project.relatedProducts?.forEach(productId => {
            const productName = categoryMappings.productMap[productId];
            if (productName) categories.push(productName);
        });

        project.relatedChikfdServices?.forEach(childServiceId => {
            const childServiceName = categoryMappings.childServiceMap[childServiceId];
            if (childServiceName) categories.push(childServiceName);
        });

        return categories.slice(0, 3); // Limit to 3 categories
    };

    const categories = getProjectCategories();
    const projectSlug = project.slug || encodeURIComponent(project.Title);

    if (layout === 'list') {
        return (
            <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
                <div className="flex flex-col lg:flex-row">
                    {/* Media Section */}
                    <div className="lg:w-2/5 relative">
                        {project.media?.type === 'video' ? (
                            <div className="aspect-video w-full">
                                {activeVideo === project._id ? (
                                    <Video
                                        src={project.media.url}
                                        themeColor="#446E6D"
                                        controls={true}
                                    />
                                ) : (
                                    <div
                                        className="relative w-full h-full bg-gray-900 flex items-center justify-center cursor-pointer group"
                                        onClick={() => toggleVideo(project._id)}
                                    >
                                        <Image
                                            src={project.media.url}
                                            alt={project.Title}
                                            fill
                                            className="object-cover opacity-70"
                                            sizes="(max-width: 1024px) 100vw, 40vw"
                                        />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                                        <Play className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-video w-full relative">
                                <Image
                                    src={project.media?.url || '/images/placeholder.jpg'}
                                    alt={project.Title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                        <div>
                            {/* Categories */}
                            {categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#446E6D]/10 text-[#446E6D]"
                                        >
                                            <Tag className="w-3 h-3 mr-1" />
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 hover:text-[#446E6D] transition-colors">
                                {project.Title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                                {project.detail}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(project.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>

                            <Link
                                href={`/details/projects/${projectSlug}`}
                                className="inline-flex items-center px-6 py-3 bg-[#446E6D] text-white rounded-lg hover:bg-[#355857] transition-all duration-200 group"
                            >
                                View Project
                                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid layout
    return (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
        >
            {/* Media Section */}
            <div className="relative aspect-video">
                {project.media?.type === 'video' ? (
                    activeVideo === project._id ? (
                        <Video
                            src={project.media.url}
                            themeColor="#446E6D"
                            controls={true}
                        />
                    ) : (
                        <div
                            className="relative w-full h-full bg-gray-900 flex items-center justify-center cursor-pointer group"
                            onClick={() => toggleVideo(project._id)}
                        >
                            <Image
                                src={project.media.url}
                                alt={project.Title}
                                fill
                                className="object-cover opacity-70"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                            <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                        </div>
                    )
                ) : (
                    <Image
                        src={project.media?.url || '/images/placeholder.jpg'}
                        alt={project.Title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Categories */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {categories.map((category, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#446E6D]/10 text-[#446E6D]"
                            >
                                <Tag className="w-3 h-3 mr-1" />
                                {category}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#446E6D] transition-colors">
                    {project.Title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {project.detail}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(project.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>

                    <Link
                        href={`/details/projects/${projectSlug}`}
                        className="inline-flex items-center px-4 py-2 bg-[#446E6D] text-white rounded-lg hover:bg-[#355857] transition-all duration-200 group text-sm"
                    >
                        View Project
                        <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
