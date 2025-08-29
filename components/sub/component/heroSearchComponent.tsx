"use client";
import { SearchIcon, Loader2, XCircle } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";

// Define types for search results
interface SearchResult {
  id: string;
  type: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  url: string;
}

interface SearchResults {
  services: any[];
  childServices: any[];
  blogs: any[];
  knowledgeBase: any[];
  projects: any[];
  products: any[];
  testimonials: any[];
}

export default function HeroSearchComponent() {
  const router = useRouter();
  const data = "Your IT Solutions Galaxy";
  const data2 = "Search for Products, Services you wish to explore";
  const [typingText, setTypingText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [isTypingData1, setIsTypingData1] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle typing animation effect
  useEffect(() => {
    const handleTyping = () => {
      const activeData = isTypingData1 ? data : data2;

      if (!deleting) {
        if (index < activeData.length) {
          setTypingText((prev) => prev + activeData[index]);
          setIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setDeleting(true), 1000);
        }
      } else {
        if (index > 0) {
          setTypingText((prev) => prev.slice(0, -1));
          setIndex((prev) => prev - 1);
        } else {
          setDeleting(false);
          setIsTypingData1((prev) => !prev);
          setIndex(0);
        }
      }
    };

    const timeoutId = setTimeout(handleTyping, 100);
    return () => clearTimeout(timeoutId);
  }, [index, deleting, isTypingData1, data, data2]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setResults(null);
        setTotalResults(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`/api/search?search=${encodeURIComponent(query)}`);

        if (response.data.success) {
          setResults(response.data.results);
          setTotalResults(response.data.totalResults);
          setShowDropdown(true);
        } else {
          setError("Failed to fetch results");
          setResults(null);
          setTotalResults(0);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("An error occurred while searching");
        setResults(null);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Handle input change with debounce
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle form submission for search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        const response = await axios.get(`/api/search?search=${encodeURIComponent(searchQuery.trim())}`);

        if (response.data.success) {
          setResults(response.data.results);
          setTotalResults(response.data.totalResults);
          setShowDropdown(true);
        } else {
          setError("Failed to fetch results");
          setResults(null);
          setTotalResults(0);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("An error occurred while searching");
        setResults(null);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setResults(null);
    setTotalResults(0);
    setShowDropdown(false);
  };

  // Format result items for each category
  const formatResultItem = (item: any, type: string): SearchResult => {
    switch (type) {
      case 'services':
        return {
          id: item._id,
          type: 'Service',
          title: item.Title,
          description: item.deltail || item.moreDetail,
          image: item.image,
          category: item.category,
          url: `/${encodeURIComponent(item.Title)}`
        };
      case 'childServices':
        return {
          id: item._id,
          type: 'Child Service',
          title: item.Title,
          description: item.detail || item.moreDetail,
          image: item.image,
          category: item.category,
          url: `/details/childs/${item.slug ? encodeURIComponent(item.slug) : encodeURIComponent(item.Title)}`
        };
      case 'blogs':
        return {
          id: item._id,
          type: 'Blog',
          title: item.title,
          description: item.description,
          image: item.image,
          category: item.type,
          url: `/about/blog/${item.slug || item._id}`
        };
      case 'knowledgeBase':
        return {
          id: item._id,
          type: 'Knowledge Base',
          title: item.title,
          description: item.introduction,
          image: item.Image,
          url: `/about/knowledgebase/${item.slug || item._id}`
        };
      case 'projects':
        return {
          id: item._id,
          type: 'Project',
          title: item.Title,
          description: item.detail,
          image: item.media?.url || item.image,
          url: `/details/projects/${item.slug ? encodeURIComponent(item.slug) : encodeURIComponent(item.Title)}`
        };
      case 'products':
        return {
          id: item._id,
          type: 'Product',
          title: item.Title,
          description: item.detail,
          image: item.image,
          category: item.category,
          url: `/details/services/${item.slug ? encodeURIComponent(item.slug) : encodeURIComponent(item.Title)}`
        };
      case 'testimonials':
        return {
          id: item._id,
          type: 'Testimonial',
          title: item.postedBy,
          description: item.Testimonial,
          image: item.image,
          url: `/testimonials/${item._id}`
        };
      default:
        return {
          id: item._id,
          type: 'Other',
          title: item.title || item.Title,
          description: item.description || item.detail,
          image: item.image,
          url: '#'
        };
    }
  };

  return (
    <div className="w-full" style={{ position: 'relative', zIndex: 9999 }} ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="rounded-[70px] w-full mx-auto border-[1.5px] gap-2 xs:gap-4 flex md:gap-5 border-[#0B2B20] p-1 justify-between bg-white border-box">
          <div className="flex gap-2.5 items-center flex-1">
            <img
              alt="search"
              loading="lazy"
              width="25"
              height="25"
              decoding="async"
              data-nimg="1"
              className="sm:ml-2 xs:w-6 xs:h-6 w-5 invisible sm:visible"
              style={{ color: "transparent" }}
              src="/search.svg"
            />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onClick={() => searchQuery && setShowDropdown(true)}
              placeholder={typingText || "Search for products, services..."}
              className="text-[#101513] text-base xs:text-base w-full leading-7 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#446E6D] font-medium text-white text-lg sm:text-base px-1.5 xs:px-3 md:px-[34px] py-2 md:py-[11.5px] font-graphik rounded-[39px] border-box flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span className="hidden sm:block">webmedigital</span>
                <span className="sm:hidden aspect-square p-2">
                  <SearchIcon fontSize="inherit" />
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Search Results Dropdown with smoother animation */}
      <AnimatePresence>
        {showDropdown && searchQuery.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-[80vh] overflow-y-auto"
            style={{ zIndex: 9999 }}
          >
            {loading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-[#446E6D]" />
                <span className="ml-3 text-gray-600">Searching...</span>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => debouncedSearch(searchQuery)}
                  className="mt-2 text-[#446E6D] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : results && totalResults > 0 ? (
              <div className="divide-y divide-gray-100">
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-500">
                    Found <span className="font-semibold text-[#446E6D]">{totalResults}</span> results for &quot;{searchQuery}&quot;
                  </p>
                </div>

                {/* Services */}
                {results.services?.length > 0 && (
                  <ResultSection
                    title="Services"
                    items={results.services}
                    type="services"
                    formatItem={formatResultItem}
                    onItemClick={() => setShowDropdown(false)}
                  />
                )}

                {/* Child Services */}
                {results.childServices?.length > 0 && (
                  <ResultSection
                    title="Solutions"
                    items={results.childServices}
                    type="childServices"
                    formatItem={formatResultItem}
                    onItemClick={() => setShowDropdown(false)}
                  />
                )}

                {/* Products */}
                {results.products?.length > 0 && (
                  <ResultSection
                    title="Products"
                    items={results.products}
                    type="products"
                    formatItem={formatResultItem}
                    onItemClick={() => setShowDropdown(false)}
                  />
                )}

                {/* Blogs */}
                {results.blogs?.length > 0 && (
                  <ResultSection
                    title="Blogs"
                    items={results.blogs}
                    type="blogs"
                    formatItem={formatResultItem}
                    onItemClick={() => setShowDropdown(false)}
                  />
                )}

                {/* Knowledge Base */}
                {results.knowledgeBase?.length > 0 && (
                  <ResultSection
                    title="Knowledge Base"
                    items={results.knowledgeBase}
                    type="knowledgeBase"
                    formatItem={formatResultItem}
                    onItemClick={() => setShowDropdown(false)}
                  />
                )}

                {/* Projects */}
                {results.projects?.length > 0 && (
                  <ResultSection
                    title="Projects"
                    items={results.projects}
                    type="projects"
                    formatItem={formatResultItem}
                    onItemClick={() => setShowDropdown(false)}
                  />
                )}

                {/* Testimonials */}
                {results.testimonials?.length > 0 && (
                  <ResultSection
                    title="Testimonials"
                    items={results.testimonials}
                    type="testimonials"
                    formatItem={formatResultItem}
                    onItemClick={() => setShowDropdown(false)}
                  />
                )}

                <div className="p-3 bg-gray-50 text-center">

                </div>
              </div>
            ) : searchQuery && !loading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No results found for&quot;{searchQuery}&quot;</p>
                <p className="text-sm text-gray-400 mt-1">Try different keywords or check spelling</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Result Section Component
interface ResultSectionProps {
  title: string;
  items: any[];
  type: string;
  formatItem: (item: any, type: string) => SearchResult;
  onItemClick: () => void;
}


function ResultSection({ title, items, type, formatItem, onItemClick }: ResultSectionProps) {
  // Limit to 3 items max per section in dropdown
  const limitedItems = items.slice(0, 3);

  return (
    <div className="py-3 px-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="space-y-3">
        {limitedItems.map((item) => {
          const formattedItem = formatItem(item, type);
          return (
            <Link
              href={formattedItem.url}
              key={formattedItem.id}
              onClick={onItemClick}
              className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              {/* Media display - Handle both images and videos */}
              <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-md relative bg-gray-100">
                {type === 'projects' && item.media?.type === 'video' ? (
                  <>
                    {/* Video thumbnail with play indicator */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-40 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {/* Video poster (first frame) or fallback to a static image */}
                    <img
                      src={item.media?.thumbnail || item.media?.url || item.image || '/video-placeholder.jpg'}
                      alt={formattedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </>
                ) : formattedItem.image ? (
                  <img
                    src={formattedItem.image}
                    alt={formattedItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-[#446E6D]">
                  {formattedItem.title}
                </h4>
                {formattedItem.description && (
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {formattedItem.description}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {formattedItem.type}
                  </span>

                  {/* Show video indicator if project has video */}
                  {type === 'projects' && item.media?.type === 'video' && (
                    <span className="inline-flex items-center ml-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Video
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}