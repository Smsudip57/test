"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
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

const BlogCard: React.FC<{ blog: BlogPost }> = React.memo(({ blog }) => {
  const router = useRouter();
  const handleRedirect = useCallback(() => {
    router.push(`/about/blog/${blog.slug || blog._id}`);
  }, [router, blog.slug, blog._id]);

  return (
    <article
      className="bg-white overflow-hidden rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] group cursor-pointer"
      onClick={handleRedirect}
      tabIndex={0}
      role="button"
      aria-label={`Read blog: ${blog.title}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRedirect(); }}
    >
      <div className="aspect-[16/7] w-full relative overflow-hidden">
        {blog.image ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <Image
              src={blog.image}
              alt={blog.title || "Blog image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover absolute top-0 left-0 transition-transform duration-500 group-hover:scale-105"
              onError={(e: any) => {
                e.target.src = "https://placehold.co/600x262/446E6D/ffffff?text=WEBME+Blog";
              }}
              priority={false}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#446E6D]/80 to-[#446E6D]">
            <span className="text-white font-semibold text-lg">WEBME Blog</span>
          </div>
        )}
        <div className="absolute top-4 left-4 z-20">
          <span className="text-xs font-medium bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[#446E6D] shadow-sm">
            {blog.category || "Blog"}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        {blog.createdAt && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <CalendarIcon size={14} className="mr-1" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            {blog.readTime && (
              <>
                <span className="mx-2">•</span>
                <ClockIcon size={14} className="mr-1" />
                <span>{blog.readTime} min read</span>
              </>
            )}
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#446E6D] transition-colors">
          {blog.title || "Untitled Blog Post"}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {blog.excerpt || blog.description || "Read this article to learn more about the latest industry trends and insights."}
        </p>
        <div className="mt-auto">
          <span className="inline-flex items-center text-[#446E6D] font-semibold transition-all group-hover:translate-x-1">
            Read article
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="ml-1 transition-transform group-hover:translate-x-1"><path stroke="#446E6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17l5-5m0 0l5-5m-5 5H7m5 0V7" /></svg>
          </span>
        </div>
      </div>
    </article>
  );
});

BlogCard.displayName = "BlogCard";

const BlogSection: React.FC<BlogSectionProps> = ({ industry, parent, data }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(parent)
  useEffect(() => {
    let isMounted = true;
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ blogs: BlogPost[] }>(`/api/blog/get`);
        let filteredBlogs = response.data.blogs;
        if (industry || parent) {
          filteredBlogs = filteredBlogs.filter((item: BlogPost) => {
            const matchesIndustry =
              industry &&
              ((typeof item.relatedIndustries === "string" && item.relatedIndustries === industry) ||
                (Array.isArray(item.relatedIndustries) && item.relatedIndustries.includes(industry)));
            const matchesParent = parent && ((typeof item.relatedServices === "string" && item.relatedServices === parent) ||
                (Array.isArray(item.relatedServices) && item.relatedServices.includes(parent)));
            return matchesIndustry || matchesParent;
          });
        } else {
          filteredBlogs = filteredBlogs.slice(0, 4);
        }
        if (isMounted) setBlogs(filteredBlogs);
      } catch (error) {
        // Optionally handle error
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (!data) {
      fetchBlogs();
    } else {
      setBlogs(data);
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [industry, parent, data]);

  const blogList = useMemo(() => blogs, [blogs]);

  return (
    <section className="relative w-full bg-bottom" aria-label="Blog section">
      <div className="flex flex-col justify-center mt-24 lg:mt-0 my-[65px] w-[90%] mx-auto lg:w-full">
        <header className="mx-auto text-center w-full lg:w-[1000px] z-20 mb-8">
          <h2 className="text-2xl lg:text-4xl text-[#446E6D] font-bold">
            BLOGS
          </h2>
        </header>
        {loading ? (
          <div className="w-full xl:w-[1280px] mx-auto my-16 z-20">
            <div className="grid lg:grid-cols-4 gap-6 lg:gap-10">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white overflow-hidden rounded-xl shadow-lg flex flex-col animate-pulse"
                  style={{ minHeight: 420 }}
                >
                  <div className="aspect-[16/7] w-full relative overflow-hidden bg-gray-200">
                    <div className="absolute top-4 left-4 z-20">
                      <span className="text-xs font-medium bg-white/80 px-3 py-1.5 rounded-full text-gray-300 shadow-sm">
                        &nbsp;
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
                    <div className="h-6 w-full bg-gray-200 rounded mb-3" />
                    <div className="h-3 w-5/6 bg-gray-200 rounded mb-4" />
                    <div className="h-3 w-4/6 bg-gray-200 rounded mb-2" />
                    <div className="mt-auto">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full xl:w-[1280px] mx-auto my-16 z-20">
            <div className="grid lg:grid-cols-4 gap-6 lg:gap-10">
              {blogList.map((item: BlogPost, index: number) => (
                <BlogCard key={item._id || index} blog={item} />
              ))}
              {blogList.length === 0 && !loading && (
                <div className="col-span-full py-10 text-center text-gray-500">
                  <div className="p-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-lg">No blogs found for this {parent ? "service" : "industry"}.</p>
                    <p className="text-sm mt-2">Check back later for new content.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <footer className="mt-8">
          <a
            href="/about/blog"
            className="text-[#446E6D] w-max mx-auto border border-[#446E6D] py-3 px-6 flex items-center rounded-md font-semibold cursor-pointer gap-2 hover:bg-[#446E6D] hover:text-white transition-all duration-300"
            aria-label="Read all blog resources"
          >
            <span>Read all resources</span>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#446E6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17l5-5m0 0l5-5m-5 5H7m5 0V7" /></svg>
          </a>
        </footer>
      </div>
    </section>
  );
};

export default BlogSection;
