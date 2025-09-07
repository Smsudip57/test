"use client";
import React, { useRef, useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { motion } from "framer-motion";
import Link from "next/link";

const RelatedProducts = ({ relatedProducts }) => {
    // Early return if no data exists
    if (!relatedProducts || relatedProducts.length === 0) {
        return null;
    }

    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Only initialize Keen Slider if more than 1 item
    const [sliderRef, instanceRef] = useKeenSlider(
        relatedProducts.length > 1 ? {
            initial: 0,
            loop: relatedProducts.length > 4, // Only loop if more than 4 items (more than what's visible at desktop)
            mode: "free-snap",
            slides: {
                perView: "auto",
                spacing: 24,
            },
            breakpoints: {
                "(min-width: 768px)": {
                    slides: {
                        perView: Math.min(2, relatedProducts.length),
                        spacing: 24,
                    },
                },
                "(min-width: 1024px)": {
                    slides: {
                        perView: Math.min(3, relatedProducts.length),
                        spacing: 32,
                    },
                },
                "(min-width: 1280px)": {
                    slides: {
                        perView: Math.min(4, relatedProducts.length),
                        spacing: 32,
                    },
                },
            },
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel);
            },
            created() {
                setLoaded(true);
            },
        } : {}
    );

    // Auto-scroll effect - only when there are enough items to loop
    useEffect(() => {
        if (instanceRef.current && relatedProducts.length > 4) {
            const interval = setInterval(() => {
                instanceRef.current?.next();
            }, 4000);

            return () => clearInterval(interval);
        }
    }, [instanceRef, relatedProducts.length]);

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-[#446E6D] mb-4">
                        Related Products
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover more products that complement your needs
                    </p>
                </motion.div>

                {/* Navigation and Slider Container */}
                <div className="relative flex items-center">
                    {/* Left Navigation Arrow - Only show when more than 1 item */}
                    {loaded && instanceRef.current && relatedProducts.length > 1 && (
                        <button
                            className="flex-shrink-0 mr-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
                            onClick={() => instanceRef.current?.prev()}
                        >
                            <svg
                                className="w-6 h-6 text-[#446E6D]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Content Container */}
                    {relatedProducts.length === 1 ? (
                        // Single item - no slider needed
                        <div className="flex justify-center w-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="w-[320px]"
                            >
                                <ProductCard product={relatedProducts[0]} />
                            </motion.div>
                        </div>
                    ) : (
                        // Multiple items - use slider
                        <div className="flex-1 overflow-hidden">
                            <div ref={sliderRef} className="keen-slider">
                                {relatedProducts.map((product, index) => (
                                    <motion.div
                                        key={product._id || index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="keen-slider__slide min-w-[280px] md:min-w-[320px]"
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Right Navigation Arrow - Only show when more than 1 item */}
                    {loaded && instanceRef.current && relatedProducts.length > 1 && (
                        <button
                            className="flex-shrink-0 ml-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
                            onClick={() => instanceRef.current?.next()}
                        >
                            <svg
                                className="w-6 h-6 text-[#446E6D]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dots Indicator */}
                {loaded && instanceRef.current && (
                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({
                            length: Math.ceil(relatedProducts.length / 4),
                        }).map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${Math.floor(currentSlide / 4) === idx
                                    ? "bg-[#446E6D] scale-125"
                                    : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                onClick={() => {
                                    instanceRef.current?.moveToIdx(idx * 4);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

// Product Card Component
const ProductCard = ({ product }) => {
    return (
        <Link
            href={`/details/products/${product.slug || product._id}`}
            className="block w-full h-full"
        >
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full"
            >
                {/* Product Image */}
                <div className="relative overflow-hidden aspect-video">
                    <img
                        src={product.image || "/default-product.jpg"}
                        alt={product.Title || "Product"}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                            e.target.src = "/default-product.jpg";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Product Content */}
                <div className="p-6 text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 overflow-hidden text-left" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                    }}>
                        {product.Title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 overflow-hidden text-left" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis'
                    }}>
                        {product.detail || product.moreDetail}
                    </p>

                    {/* Product Features/Tags */}
                    {product.itemsTag && (
                        <div className="mb-4">
                            <span className="inline-block bg-gray-100 text-[#446E6D] px-3 py-1 text-xs font-medium">
                                {product.itemsTag}
                            </span>
                        </div>
                    )}

                    {/* Sections Count and View Product Link */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        {product.sections && product.sections.length > 0 && (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                                </svg>
                                {product.sections.length} Section{product.sections.length > 1 ? 's' : ''}
                            </div>
                        )}

                        <span className="text-[#446E6D] hover:underline transition-all duration-200 text-sm font-medium ml-auto">
                            View Product
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default RelatedProducts;
