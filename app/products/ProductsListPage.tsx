"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Grid3X3,
    List,
    Package,
    ArrowRight,
    Tag,
    Layers,
    ChevronDown
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Product {
    _id: string;
    Title: string;
    slug: string;
    detail: string;
    moreDetail?: string;
    image: string;
    category: string;
    itemsTag?: string;
    sections?: Array<{
        title: string;
        image: string;
        points: Array<{
            title: string;
            detail: string;
        }>;
    }>;
    createdAt?: string;
    updatedAt?: string;
}

interface ParentService {
    _id: string;
    Title: string;
    slug?: string;
}

interface Service {
    _id: string;
    Title?: string;
    name?: string;
}

interface ProductsListPageProps {
    products: Product[];
    parentServices: ParentService[];
    services: Service[];
}

const ProductsListPage: React.FC<ProductsListPageProps> = ({
    products,
    parentServices,
    services
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Create category mappings
    const categoryMap = useMemo(() => {
        const map: Record<string, string> = {};
        parentServices.forEach(service => {
            map[service._id] = service.Title;
        });
        return map;
    }, [parentServices]);

    // Get unique categories
    const categories = useMemo(() => {
        const uniqueCategories = new Set<string>();
        products.forEach(product => {
            if (product.category && categoryMap[product.category]) {
                uniqueCategories.add(product.category);
            }
        });
        return Array.from(uniqueCategories);
    }, [products, categoryMap]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch =
                product.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.moreDetail && product.moreDetail.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory =
                selectedCategory === 'all' ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

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
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-primary-lighter/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary-lighter/10 to-primary/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-primary via-primary-lighter to-primary bg-clip-text text-transparent">
                                Our Products
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Explore our comprehensive range of digital products and services designed to
                            transform your business and drive growth.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12"
                    >
                        <div className="bg-white/80 backdrop-blur-sm border border-primary/20 rounded-lg p-6 shadow-lg">
                            <div className="text-3xl font-bold text-primary mb-2">{products.length}+</div>
                            <div className="text-gray-600">Products Available</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm border border-primary/20 rounded-lg p-6 shadow-lg">
                            <div className="text-3xl font-bold text-primary mb-2">{categories.length}+</div>
                            <div className="text-gray-600">Categories</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm border border-primary/20 rounded-lg p-6 shadow-lg">
                            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
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
                <div className="bg-white/90 backdrop-blur-md border border-primary/20 rounded-xl p-6 shadow-md">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 w-full max-w-2xl">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-primary/20 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                            />
                        </div>

                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full lg:w-56 bg-white border-primary/20 text-gray-800 hover:border-primary focus:border-primary focus:ring-primary/20">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-primary/20">
                                <SelectItem value="all" className="cursor-pointer hover:bg-primary/10">
                                    All Products
                                </SelectItem>
                                {categories.map((categoryId) => (
                                    <SelectItem
                                        key={categoryId}
                                        value={categoryId}
                                        className="cursor-pointer hover:bg-primary/10"
                                    >
                                        {categoryMap[categoryId]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1 border border-primary/20 whitespace-nowrap">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${viewMode === 'grid'
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Grid</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${viewMode === 'list'
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                <span className="hidden sm:inline">List</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Products Grid/List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <AnimatePresence mode="wait">
                    {filteredProducts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-20"
                        >
                            <div className="bg-white/90 backdrop-blur-sm border border-primary/20 rounded-3xl p-12 max-w-md mx-auto shadow-xl">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Products Found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search terms or filters to find what you&apos;re looking for.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                    }}
                                    className="bg-gradient-to-r from-primary to-primary-lighter text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
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
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    categoryName={categoryMap[product.category] || 'Uncategorized'}
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

// Product Card Component
interface ProductCardProps {
    product: Product;
    categoryName: string;
    layout: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    categoryName,
    layout
}) => {
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
                className="bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group shadow-lg"
            >
                <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className="lg:w-[40%] relative aspect-video">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.Title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-product.jpg';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary-lighter/10 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm">No Image</p>
                                </div>
                            </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/20"></div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-2/3 p-8">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="bg-gradient-to-r from-primary/20 to-primary-lighter/20 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20 flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {categoryName}
                            </span>
                            {product.itemsTag && (
                                <span className="bg-gradient-to-r from-primary-lighter/20 to-primary/20 text-primary-dark px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                                    {product.itemsTag}
                                </span>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-primary transition-colors duration-300">
                            {product.Title}
                        </h3>

                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                            {product.detail}
                        </p>

                        {product.sections && product.sections.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                <Layers className="w-4 h-4" />
                                <span>{product.sections.length} Sections Available</span>
                            </div>
                        )}

                        <Link
                            href={`/details/products/${product.slug ? product?.slug : product?.Title}`}
                            className="group/link flex items-center gap-2 bg-gradient-to-r from-primary to-primary-lighter text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 w-fit"
                        >
                            View Details
                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid layout
    return (
        <motion.div
            variants={itemVariants}
            className="bg-white/90 backdrop-blur-sm border border-primary/20 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group shadow-lg"
        >
            {/* Image Section */}
            <div className="relative aspect-video">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.Title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary-lighter/10 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Package className="w-8 h-8" />
                            </div>
                            <p className="text-sm">No Image</p>
                        </div>
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {categoryName}
                    </span>
                </div>

                {/* Sections Count */}
                {product.sections && product.sections.length > 0 && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Layers className="w-4 h-4" />
                        <span>{product.sections.length}</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {product.Title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {product.detail}
                </p>

                <Link
                    href={`/details/products/${product.slug}`}
                    className="group/link flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-lighter text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
        </motion.div>
    );
};

export default ProductsListPage;
