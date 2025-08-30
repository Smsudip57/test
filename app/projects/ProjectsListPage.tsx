"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Video from '@/components/shaerd/Video';
import {
    Search,
    Grid3X3,
    List,
    Calendar,
    ExternalLink,
    ArrowRight
} from 'lucide-react';

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

interface ProjectsListPageProps {
    projects: Project[];
    services: any[];
    products: any[];
    childServices: any[];
}

const ProjectsListPage: React.FC<ProjectsListPageProps> = ({
    projects,
    services,
    products,
    childServices
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');

    // Create category mappings for better performance
    const categoryMappings: CategoryMappings = useMemo(() => ({
        serviceMap: services.reduce((acc, service) => {
            acc[service._id] = service.name;
            return acc;
        }, {}),
        productMap: products.reduce((acc, product) => {
            acc[product._id] = product.name;
            return acc;
        }, {}),
        childServiceMap: childServices.reduce((acc, childService) => {
            acc[childService._id] = childService.name;
            return acc;
        }, {})
    }), [services, products, childServices]);

    // Get unique categories for filtering
    const categories = useMemo(() => {
        const allCategories = new Set<string>();
        projects.forEach(project => {
            project.relatedServices.forEach(serviceId => {
                if (categoryMappings.serviceMap[serviceId]) {
                    allCategories.add(categoryMappings.serviceMap[serviceId]);
                }
            });
            project.relatedProducts.forEach(productId => {
                if (categoryMappings.productMap[productId]) {
                    allCategories.add(categoryMappings.productMap[productId]);
                }
            });
        });
        return Array.from(allCategories);
    }, [projects, categoryMappings]);

    // Filter projects based on search term
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.detail.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [projects, searchTerm]);

    const toggleVideo = () => {
        // Video component handles its own play/pause logic
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative pt-32 pb-10 px-4 sm:px-6 lg:px-8"
            >
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#446E6D]/10 to-[#00FFF3]/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#e59cff]/10 to-[#ba9cff]/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-[#446E6D] via-[#00FFF3] to-[#446E6D] bg-clip-text text-transparent">
                                Our Projects
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Explore our comprehensive portfolio of successful IT projects, digital solutions,
                            and technology implementations that drive business growth.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12"
                    >
                        <div className="bg-white/80 backdrop-blur-sm border border-[#446E6D]/20 rounded-lg p-6 shadow-lg">
                            <div className="text-3xl font-bold text-[#446E6D] mb-2">{projects.length}+</div>
                            <div className="text-gray-600">Projects Completed</div>
                        </div>
                      
                        <div className="bg-white/80 backdrop-blur-sm border border-[#446E6D]/20 rounded-lg p-6 shadow-lg">
                            <div className="text-3xl font-bold text-[#446E6D] mb-2">100%</div>
                            <div className="text-gray-600">Success Rate</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm border border-[#446E6D]/20 rounded-lg p-6 shadow-lg">
                            <div className="text-3xl font-bold text-[#446E6D] mb-2">24/7</div>
                            <div className="text-gray-600">Support</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Filters and Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
            >
                <div className="bg-white/90 backdrop-blur-md border border-[#446E6D]/20 rounded-xl p-6 shadow-md">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-2xl">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-[#446E6D]/20 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#446E6D] focus:ring-2 focus:ring-[#446E6D]/20 transition-all duration-300"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1 border border-[#446E6D]/20">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all duration-300 ${viewMode === 'grid'
                                        ? 'bg-[#446E6D] text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all duration-300 ${viewMode === 'list'
                                        ? 'bg-[#446E6D] text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                List
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Projects Grid/List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <AnimatePresence mode="wait">
                    {filteredProjects.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-20"
                        >
                            <div className="bg-white/90 backdrop-blur-sm border border-[#446E6D]/20 rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#446E6D] to-[#00FFF3] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Projects Found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search terms or filters to find what you&apos;re looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                    }}
                                    className="bg-gradient-to-r from-[#446E6D] to-[#00FFF3] text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#446E6D]/25 transition-all duration-300"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={viewMode}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                                    : 'space-y-8'
                            }
                        >
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                    categoryMappings={categoryMappings}
                                    layout={viewMode}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Project Card Component
interface ProjectCardProps {
    project: Project;
    categoryMappings: CategoryMappings;
    layout: 'grid' | 'list';
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    categoryMappings,
    layout
}) => {
    const projectCategories = [
        ...project.relatedServices.map(id => categoryMappings.serviceMap[id]).filter(Boolean),
        ...project.relatedProducts.map(id => categoryMappings.productMap[id]).filter(Boolean)
    ].slice(0, 3);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Date N/A';
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    if (layout === 'list') {
        return (
            <motion.div
                variants={itemVariants}
                className="bg-white/90 backdrop-blur-sm border border-[#446E6D]/20 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-[#446E6D]/10 transition-all duration-500 group shadow-lg"
            >
                <div className="flex flex-col lg:flex-row">
                    {/* Image/Video Section */}
                    <div className="lg:w-[40%] relative aspect-video">
                        {project.media?.url ? (
                            <>
                                {project.media.type === 'video' ? (
                                    <Video
                                        src={project.media.url}
                                        className="w-full h-full"
                                        aspectRatio="16/9"
                                        themeColor="#446E6D"
                                        playsInline={true}
                                    />
                                ) : (
                                    <Image
                                        src={project.media.url}
                                        alt={project.Title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder-project.jpg';
                                        }}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#446E6D]/10 to-[#00FFF3]/10 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <div className="w-16 h-16 bg-[#446E6D]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <ExternalLink className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm">No Preview</p>
                                </div>
                            </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/20"></div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-2/3 p-8">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {projectCategories.map((category, index) => (
                                <span
                                    key={index}
                                    className="bg-gradient-to-r from-[#446E6D]/20 to-[#00FFF3]/20 text-[#446E6D] px-3 py-1 rounded-full text-sm font-medium border border-[#446E6D]/20"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-[#446E6D] transition-colors duration-300">
                            {project.Title}
                        </h3>

                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                            {project.detail}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(project.createdAt)}</span>
                            </div>

                            <Link
                                href={`/details/projects/${project.slug}`}
                                className="group/link flex items-center gap-2 bg-gradient-to-r from-[#446E6D] to-[#00FFF3] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#446E6D]/25 transition-all duration-300"
                            >
                                View Details
                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
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
            className="bg-white/90 backdrop-blur-sm border border-[#446E6D]/20 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-[#446E6D]/10 transition-all duration-500 group shadow-lg"
        >
            {/* Image/Video Section */}
            <div className="relative aspect-video">
                {project.media?.url ? (
                    <>
                        {project.media.type === 'video' ? (
                            <Video
                                src={project.media.url}
                                className="w-full h-full"
                                aspectRatio="16/9"
                                themeColor="#446E6D"
                                playsInline={true}
                            />
                        ) : (
                            <Image
                                src={project.media.url}
                                alt={project.Title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-project.jpg';
                                }}
                            />
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#446E6D]/10 to-[#00FFF3]/10 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="w-16 h-16 bg-[#446E6D]/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <ExternalLink className="w-8 h-8" />
                            </div>
                            <p className="text-sm">No Preview</p>
                        </div>
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                
                {/* Date */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-white/90">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.createdAt)}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#446E6D] transition-colors duration-300 line-clamp-1">
                    {project.Title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {project.detail}
                </p>

                <Link
                    href={`/details/projects/${project.slug}`}
                    className="group/link flex items-center justify-center gap-2 bg-gradient-to-r from-[#446E6D] to-[#00FFF3] text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#446E6D]/25 transition-all duration-300"
                >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
        </motion.div>
    );
};

export default ProjectsListPage;
