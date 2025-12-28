"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CalendarIcon, BookOpen, Bookmark } from 'lucide-react';

// Define proper interfaces for the knowledge base data structure
interface KnowledgeBaseArticle {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  points?: Array<{ title: string; description: string }>;
  relatedServices?: string | string[];
  relatedIndustries?: string | string[];
  relatedProducts?: string | string[];
  relatedChikfdServices?: string | string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Proper typing for API response
interface KnowledgeBaseResponse {
  knowledgebases: KnowledgeBaseArticle[];
}

// Properly typed props for the component
interface KnowledgeBaseSectionProps {
  industry?: string;
  child?: string;
  product?: string;
  data?: KnowledgeBaseArticle[];
}

const KnowledgeBaseSection: React.FC<KnowledgeBaseSectionProps> = ({ industry, child, product, data }) => {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        setLoading(true);
        const response = await axios.get<KnowledgeBaseResponse>(`/api/knowledgebase/get`);
        
        if (industry || child || product) {
          // Filter by related fields if provided, handling both string and array types
          const filteredArticles = response.data.knowledgebases.filter((item: KnowledgeBaseArticle) => {
            // Check if any of the relationships match
            const matchesIndustry = industry && (
              (Array.isArray(item.relatedIndustries) 
                ? item.relatedIndustries.includes(industry)
                : item.relatedIndustries === industry)
            );
              
            const matchesProduct = child && (
              (Array.isArray(item.relatedProducts) 
                ? item.relatedProducts.includes(child)
                : item.relatedProducts === child)
            );
              
            const matchesChildService = product && (
              (Array.isArray(item.relatedChikfdServices) 
                ? item.relatedChikfdServices.includes(product)
                : item.relatedChikfdServices === product)
            );
              
            return matchesIndustry || matchesProduct || matchesChildService;
          });
            
          setArticles(filteredArticles);
        } else {
          setArticles(response.data.knowledgebases);
        }
      } catch (error) {
        console.error("Error fetching knowledge base articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (data) {
      setArticles(data);
      setLoading(false);
    } else {
      fetchKnowledgeBase();
    }
  }, [industry, child, product, data]); // Fixed dependency array to include all filter parameters
  
  // Function to estimate read time (1 min per 200 words)
  const calculateReadTime = (text: string | undefined): number => {
    if (!text) return 3; // Default read time
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };
  
  return (
    <div className='relative w-full bg-bottom'>
      <div className='flex flex-col justify-center mt24 lgmt-0 my-[65px] w-[90%] mx-auto lg:w-full'>
        <div className='mx-auto text-center w-full lg:w-[1000px] z-20'>
          <span className='text-2xl lg:text-4xl text-[#446E6D]'>
            <strong>
              KNOWLEDGE BASE
            </strong>
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
          <div className='w-full xl:w-[1280px] mx-auto my-16 z-20'>
            <div className='grid lg:grid-cols-4 gap-6 lg:gap-10'>
              {articles.map((article, index) => (
                <div 
                  key={article._id || index} 
                  className='bg-white overflow-hidden rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] group'
                >
                  {/* Image container with 16:7 aspect ratio */}
                  <div className='aspect-[16/7] w-full relative overflow-hidden'>
                    {article.image ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <img 
                          src={article.image} 
                          className='w-full h-full object-cover absolute top-0 left-0 transition-transform duration-500 group-hover:scale-105' 
                          alt={article.title || 'Knowledge Base article'} 
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.src = 'https://placehold.co/600x262/446E6D/ffffff?text=WEBME+Knowledge+Base';
                          }}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#446E6D]/80 to-[#446E6D]">
                        <span className="text-white font-semibold text-lg">WEBME Knowledge Base</span>
                      </div>
                    )}
                    
                    {/* Category label that overlaps the image */}
                    <div className='absolute top-4 left-4 z-20'>
                      <span className='text-xs font-medium bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[#446E6D] shadow-sm'>
                        <Bookmark className="inline-block w-3 h-3 mr-1" />
                        Knowledge Base
                      </span>
                    </div>
                  </div>

                  <div className='p-6 flex-1 flex flex-col'>
                    {/* Publication date or timestamp if available */}
                    {article.createdAt && (
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <CalendarIcon size={14} className="mr-1" />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        
                        <span className="mx-2">•</span>
                        <BookOpen size={14} className="mr-1" />
                        <span>{calculateReadTime(article.description)} min read</span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h3 className='text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#446E6D] transition-colors'>
                      {article.title || 'Untitled Article'}
                    </h3>
                    
                    {/* Description/excerpt */}
                    <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                      {article.description || 'Read this knowledge base article to learn more about our products and services.'}
                    </p>
                    
                    {/* Read button with animated arrow */}
                    <div className="mt-auto">
                      <a 
                        href={`/about/knowledgebase/${article?.slug ? article.slug : article._id}`} 
                        className='inline-flex items-center text-[#446E6D] font-semibold transition-all group-hover:translate-x-1'
                      >
                        <span>Read article</span>
                        <OpenInNewIcon fontSize='inherit' className="ml-1 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {articles.length === 0 && !loading && (
                <div className="col-span-full py-10 text-center text-gray-500">
                  <div className="p-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-lg">No knowledge base articles found for this industry.</p>
                    <p className="text-sm mt-2">Check back later for new content.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <a href="/about/knowledgebase" className='text-[#446E6D] w-max mx-auto border border-[#446E6D] py-3 px-6 flex items-center rounded-md font-semibold cursor-pointer gap-2 hover:bg-[#446E6D] hover:text-white transition-all duration-300'>
          <span>View all knowledge base articles</span>
          <OpenInNewIcon fontSize='inherit' />
        </a>
      </div>
    </div>
  );
};

export default KnowledgeBaseSection;