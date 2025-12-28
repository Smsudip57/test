"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetTestimonialByIdQuery,
  useListTestimonialsQuery,
} from "@/app/redux/api/testimonialApi";
import {
  ArrowLeft,
  Play,
  Clock,
  User,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Testimonial {
  _id: string;
  Testimonial: string;
  video: string;
  image: string;
  postedBy: string;
  role: string;
  relatedService?: any;
  relatedIndustries?: any;
  relatedProduct?: any;
  relatedChikfdServices?: any;
  createdAt?: string;
}

export default function SingleTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Fetch single testimonial
  const {
    data: testimonial,
    isLoading,
    error,
  } = useGetTestimonialByIdQuery(id);

  // Fetch all testimonials for related ones
  const { data: allTestimonialsData } = useListTestimonialsQuery({});
  const allTestimonials = allTestimonialsData?.testimonials || [];

  // Get related testimonials (same category/service)
  const getRelatedTestimonials = () => {
    if (!testimonial || !allTestimonials.length) return [];

    return allTestimonials
      .filter((t: Testimonial) => t._id !== id)
      .filter((t: Testimonial) => {
        // Match by service
        if (
          testimonial?.relatedService &&
          t?.relatedService &&
          testimonial?.relatedService?._id === t?.relatedService?._id
        ) {
          return true;
        }
        // Match by industry
        if (
          testimonial?.relatedIndustries &&
          t?.relatedIndustries &&
          testimonial?.relatedIndustries?._id === t?.relatedIndustries?._id
        ) {
          return true;
        }
        // Match by product
        if (
          testimonial?.relatedProducts &&
          t?.relatedProducts &&
          testimonial?.relatedProducts?._id === t?.relatedProducts?._id
        ) {
          return true;
        }
        return false;
      })
      .slice(0, 3);
  };

  const relatedTestimonials = getRelatedTestimonials();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#446E6D]" />
          <p className="mt-4 text-lg">Loading success story...</p>
        </div>
      </div>
    );
  }

  if (error || !testimonial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Story Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The success story you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            href="/customer-success-stories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#446E6D] text-white rounded-lg hover:bg-[#375857] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to All Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full md:w-[90%] lg:w-[1280px] mx-auto px-4 md:px-0 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#446E6D] hover:text-[#375857] transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <p className="text-sm text-gray-500">Customer Success Story</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-[90%] lg:w-[1280px] mx-auto px-4 md:px-0 py-8 md:py-16">
        {/* Hero Section - Video/Image */}
        <div className="mb-10 md:mb-16">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl group bg-black">
            {/* Video Player */}
            {videoPlaying ? (
              <iframe
                src={`${testimonial.video}?autoplay=1`}
                title="Testimonial Video"
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={testimonial.image}
                  alt={testimonial.postedBy}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer"
                  onClick={() => setVideoPlaying(true)}
                >
                  <div className="bg-white/90 group-hover:bg-white transition-all p-4 rounded-full">
                    <Play size={32} className="text-[#446E6D] fill-[#446E6D]" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Left Column - Story Content */}
          <div className="md:col-span-2">
            {/* Author Info Card */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-md border border-gray-100 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#446E6D] to-[#375857] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
                  {testimonial?.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial?.postedBy}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    testimonial?.postedBy?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {testimonial?.postedBy || "Guest"}
                  </h1>
                  <div className="flex items-center gap-2 text-[#446E6D] font-semibold mt-2">
                    <Briefcase size={18} />
                    <span>{testimonial?.role || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Testimonial Text */}
              <div className="space-y-6">
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-line">
                  "
                  {testimonial?.Testimonial ||
                    "Testimonial content not available"}
                  "
                </p>

                {/* Metadata */}
                <div className="pt-6 border-t border-gray-200 flex flex-wrap gap-6 text-sm text-gray-600">
                  {testimonial?.createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#446E6D]" />
                      <span>
                        {new Date(testimonial.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Info Cards */}
            <div className="space-y-4">
              {testimonial?.relatedService && (
                <div className="bg-gradient-to-r from-[#446E6D]/10 to-[#446E6D]/5 border border-[#446E6D]/20 rounded-lg p-4 md:p-6">
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
                    Related Service
                  </p>
                  <p className="text-lg md:text-xl font-semibold text-gray-900">
                    {typeof testimonial?.relatedService === "object"
                      ? testimonial?.relatedService?.Title ||
                        testimonial?.relatedService?.Name
                      : "Service"}
                  </p>
                </div>
              )}

              {testimonial?.relatedIndustries && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-5 border border-blue-200 rounded-lg p-4 md:p-6">
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
                    Industry
                  </p>
                  <p className="text-lg md:text-xl font-semibold text-gray-900">
                    {typeof testimonial?.relatedIndustries === "object"
                      ? testimonial?.relatedIndustries?.Title
                      : "Industry"}
                  </p>
                </div>
              )}

              {testimonial?.relatedProducts && (
                <div className="bg-gradient-to-r from-purple-50 to-purple-5 border border-purple-200 rounded-lg p-4 md:p-6">
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">
                    Product
                  </p>
                  <p className="text-lg md:text-xl font-semibold text-gray-900">
                    {typeof testimonial?.relatedProducts === "object"
                      ? testimonial?.relatedProducts?.Title
                      : "Product"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="md:col-span-1">
            {/* CTA Card */}
            <div className="sticky top-24 bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Want Similar Results?
              </h3>
              <p className="text-gray-600 mb-6">
                Let's discuss how we can help your business achieve similar
                success.
              </p>
              <button className="w-full bg-[#446E6D] hover:bg-[#375857] text-white font-semibold py-3 rounded-lg transition-colors">
                Get in Touch
              </button>
              <Link
                href="/customer-success-stories"
                className="mt-4 block w-full text-center text-[#446E6D] hover:text-[#375857] font-semibold py-3 border-2 border-[#446E6D] rounded-lg transition-colors"
              >
                View More Stories
              </Link>
            </div>
          </div>
        </div>

        {/* Related Stories Section */}
        {relatedTestimonials.length > 0 && (
          <div className="mt-16 md:mt-24 pt-16 border-t-2 border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Related Success Stories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedTestimonials.map((relatedTestimonial: Testimonial) => (
                <Link
                  href={`/customer-success-stories/${relatedTestimonial._id}`}
                  key={relatedTestimonial._id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video overflow-hidden bg-gray-200">
                    <img
                      src={relatedTestimonial.image}
                      alt={relatedTestimonial.postedBy}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-full p-3">
                        <Play
                          size={24}
                          className="text-[#446E6D] fill-[#446E6D]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6">
                    <p className="text-gray-600 text-sm font-semibold mb-2">
                      {relatedTestimonial.role}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#446E6D] transition-colors line-clamp-2">
                      {relatedTestimonial.postedBy}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {relatedTestimonial.Testimonial}
                    </p>
                    <div className="flex items-center text-[#446E6D] font-semibold text-sm group-hover:gap-2 transition-all">
                      Read Story
                      <ChevronRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
