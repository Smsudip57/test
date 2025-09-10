"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CalendarIcon, ClockIcon } from "lucide-react";

// Define interfaces for type safety
interface BlogPost {
  _id: string;
  title: string;
  excerpt?: string;
  description?: string;
  image?: string;
  createdAt?: string;
  readTime?: number;
  relatedIndustries?: string | string[];
  relatedService?: {
    _id: string;
    [key: string]: any;
  };
  [key: string]: any; // Allow for other properties
}

interface BlogSectionProps {
  industry?: string;
  parent?: string;
  data?: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({
  industry,
  parent,
  data,
}) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ blogs: BlogPost[] }>(
          `/api/blog/get`
        );

        if (industry || parent) {
          // Filter blogs based on industry or parent service
          const filteredBlogs = response.data.blogs.filter((item: BlogPost) => {
            const matchesIndustry =
              industry &&
              // Handle both string and array relationships
              ((typeof item.relatedIndustries === "string" &&
                item.relatedIndustries === industry) ||
                (Array.isArray(item.relatedIndustries) &&
                  item.relatedIndustries.includes(industry)));

            const matchesParent = parent && item.relatedService?._id === parent;

            return matchesIndustry || matchesParent;
          });

          setBlogs(filteredBlogs);
        } else {
          // If no filters, show first 4 blogs
          const fourBlogs = response.data.blogs.slice(0, 4);
          setBlogs(fourBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!data) {
      fetchBlogs();
    } else {
      setBlogs(data);
      setLoading(false);
    }
  }, [industry, parent]); // Added parent to dependency array

  return (
    <div className="relative w-full bg-bottom">
      <div className="flex flex-col justify-center mt-24 lg:mt-0 my-[65px] w-[90%] mx-auto lg:w-full">
        <div className="mx-auto text-center w-full lg:w-[1000px] z-20">
          <span className="text-2xl lg:text-4xl text-[#446E6D]">
            <strong>BLOGS</strong>
          </span>
        </div>

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full xl:w-[1280px] mx-auto my-16 z-20">
            <div className="grid lg:grid-cols-4 gap-6 lg:gap-10">
              {blogs.map((item: BlogPost, index: number) => (
                <div
                  key={item._id || index}
                  className="bg-white overflow-hidden rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] group"
                >
                  {/* Image container with 16:7 aspect ratio */}
                  <div className="aspect-[16/7] w-full relative overflow-hidden">
                    {item.image ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <img
                          src={item.image}
                          className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-500 group-hover:scale-105"
                          alt={item.title || "Blog image"}
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>
                          ) => {
                            e.currentTarget.src =
                              "https://placehold.co/600x262/446E6D/ffffff?text=WEBME+Blog";
                          }}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#446E6D]/80 to-[#446E6D]">
                        <span className="text-white font-semibold text-lg">
                          WEBME Blog
                        </span>
                      </div>
                    )}

                    {/* Category label that overlaps the image */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="text-xs font-medium bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[#446E6D] shadow-sm">
                        {item.category || "Blog"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Publication date or timestamp if available */}
                    {item.createdAt && (
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <CalendarIcon size={14} className="mr-1" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>

                        {item.readTime && (
                          <>
                            <span className="mx-2">•</span>
                            <ClockIcon size={14} className="mr-1" />
                            <span>{item.readTime} min read</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#446E6D] transition-colors">
                      {item.title || "Untitled Blog Post"}
                    </h3>

                    {/* Description/excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.excerpt ||
                        item.description ||
                        "Read this article to learn more about the latest industry trends and insights."}
                    </p>

                    {/* Read button with animated arrow */}
                    <div className="mt-auto">
                      <a
                        href={`/blog/${item._id}`}
                        className="inline-flex items-center text-[#446E6D] font-semibold transition-all group-hover:translate-x-1"
                      >
                        <span>Read article</span>
                        <OpenInNewIcon
                          fontSize="inherit"
                          className="ml-1 transition-transform group-hover:translate-x-1"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {blogs.length === 0 && !loading && (
                <div className="col-span-full py-10 text-center text-gray-500">
                  <div className="p-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-lg">No blogs found for this industry.</p>
                    <p className="text-sm mt-2">
                      Check back later for new content.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <a
          href="/about/blog"
          className="text-[#446E6D] w-max mx-auto border border-[#446E6D] py-3 px-6 flex items-center rounded-md font-semibold cursor-pointer gap-2 hover:bg-[#446E6D] hover:text-white transition-all duration-300"
        >
          <span>Read all resources</span>
          <OpenInNewIcon fontSize="inherit" />
        </a>
      </div>
    </div>
  );
};

export default BlogSection;
