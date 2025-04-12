"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import NewspaperIcon from '@mui/icons-material/Newspaper';

// Type definitions
interface SubPoint {
  title: string;
  description: string;
}

interface Section {
  title: string;
  content: string;
  points: SubPoint[];
}

interface ApiArticle {
  _id: string;
  title: string;
  introduction: string;
  mainSections: Section[];
  conclusion: string;
  tags: string[];
  relatedServices: {
    _id: string;
    title: string;
    [key: string]: any;
  } | null;
  relatedIndustries: Array<{ _id: string; title: string; [key: string]: any }>;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface UiPoint {
  title: string;
  explain: string;
  points?: UiPoint[];
}

interface UiArticle {
  title: string;
  explain: string;
  points: UiPoint[];
}

interface CategoryWithArticles {
  about: string;
  articles: UiArticle[];
}

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<CategoryWithArticles[]>([]);
  const [category, setCategory] = useState<string>('');
  const [single, setSingle] = useState<UiArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch knowledgebase data when component mounts
  useEffect(() => {
    const fetchKnowledgebase = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; knowledgebases: ApiArticle[] }>('/api/knowledgebase/get');
        
        if (response.data.success) {
          // Process and organize the data
          const organizedData = processKnowledgebaseData(response.data.knowledgebases);
          setBlogData(organizedData);
        } else {
          setError('Failed to fetch knowledgebase data');
        }
      } catch (err) {
        console.error('Error fetching knowledgebase:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgebase();
  }, []);

  // Function to process and organize knowledgebase data
  const processKnowledgebaseData = (knowledgebases: ApiArticle[]): CategoryWithArticles[] => {
    // Group articles by their related services (categories)
    const categoryMap: Record<string, CategoryWithArticles> = {};
    
    knowledgebases.forEach(article => {
      if (article.status !== 'published') return;
      
      // Get the category name from relatedServices
      let categoryName = 'Uncategorized';
      if (article.relatedServices && article.relatedServices.Title) {
        categoryName = article.relatedServices.Title;
      }
      
      // Create category if it doesn't exist
      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = {
          about: categoryName,
          articles: []
        };
      }
      
      // Format article for our UI structure
      const formattedArticle: UiArticle = {
        title: article.title,
        explain: article.introduction,
        points: []
      };
      
      // Add main sections
      if (article.mainSections && article.mainSections.length > 0) {
        article.mainSections.forEach(section => {
          const formattedSection: UiPoint = {
            title: section.title,
            explain: section.content,
            points: []
          };
          
          // Add points to section
          if (section.points && section.points.length > 0) {
            section.points.forEach(point => {
              formattedSection.points?.push({
                title: point.title,
                explain: point.description
              });
            });
          }
          
          formattedArticle.points.push(formattedSection);
        });
      }
      
      // Add conclusion as a section
      if (article.conclusion) {
        formattedArticle.points.push({
          title: 'Conclusion',
          explain: article.conclusion,
          points: []
        });
      }
      
      // Add article to its category
      categoryMap[categoryName].articles.push(formattedArticle);
    });
    
    // Convert the map to an array
    return Object.values(categoryMap);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e: React.MouseEvent<HTMLDivElement> | React.FormEvent): void => {
    e.preventDefault();
    // Filter articles based on search query
    // Implement search functionality if needed
  };

  return (
    <div className='pt-16 min-h-screen' id="read more">
      <div className='w-full grid justify-center'>
        <p className='w-max text-4xl py-16 text-center text-[#446E6D] cursor-pointer hover:text-[#37c0bd] transition-colors duration-700 z-20' onClick={()=>{setCategory('');setSingle(null)}}>
          Knowledgebase
        </p>
      </div>

      {loading ? (
        <div className='w-[1320px] mx-auto text-center py-16'>
          <p className='text-xl'>Loading knowledgebase articles...</p>
        </div>
      ) : error ? (
        <div className='w-[1320px] mx-auto text-center py-16'>
          <p className='text-xl text-red-500'>{error}</p>
        </div>
      ) : (
        <div className='w-[1320px] mx-auto flex items-start z-20 gap-7 mb-[200px]'>
          <div className='basis-2/3 p-6 h-full flex flex-col z-20'>
            <span className={`text-3xl text-[#446E6D] font-semibold mb-8 ${single && 'hidden'}`}>
              {category && category}
              {!category && !single && "Article Topics"}
            </span>
            
            {/* Display all topics and their articles */}
            {!category && !single && (
              <div className='w-full flex flex-wrap'>
                {blogData.filter(item => item.articles && item.articles.length > 0).map((item, index) => (
                  <div key={index} className='basis-1/2'>
                    <p className='text-lg pb-5 font-semibold cursor-pointer' onClick={() => {setCategory(item.about); setSingle(null)}}>
                      {item.about}
                    </p>
                    <div className='w-full ml-5 flex flex-col text-gray-500'>
                      {item.articles && item.articles.map((article, idx) => (
                        <span 
                          className='mb-[10px] cursor-pointer' 
                          key={idx} 
                          onClick={() => {setSingle(article); setCategory('')}}
                        >
                          {article.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Display articles in selected category */}
            {category && !single && (
              <div className='w-full mb-16'>
                {blogData.filter(item => item.about === category).map((item, index) => (
                  <div key={index} className='mb-5'>
                    {item.articles && item.articles.length > 0 ? (
                      item.articles.map((article, idx) => (
                        <div className='border-b-2 border-gray-300 mb-5' key={idx}>
                          <p 
                            className='text-lg pb-5 font-semibold cursor-pointer' 
                            onClick={() => {setSingle(article); setCategory('')}}
                          >
                            {article.title}
                          </p>
                          <p className='text-gray-500 line-clamp-3 mb-5'>{article.explain}</p>
                        </div>
                      ))
                    ) : (
                      <p className="w-full text-center text-xl text-white py-3 bg-[#446E6D] z-20">
                        No Article Found in {category} Topic
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Display single article */}
            {single && !category && (
              <div className='w-full'>
                <p className='text-gray-500 line-clamp-3 mb-6'>{single.explain}</p>
                <div className='w-full wl-5'>
                  {single.points && single.points.map((item, index) => (
                    <div key={index}>
                      {item.title && <p className='text-xl pb-8 pt-3 font-semibold cursor-pointer'>{item.title}</p>}
                      {item.explain && <p className='text-gray-500 line-clamp-3 mb-6'>{item.explain}</p>}
                      {item.points && item.points.map((points, idx) => (
                        <div key={idx}>
                          <p className='text-gray-800 line-clamp-3 mb-6 font-semibold'>{points.title}</p>
                          <p className='text-gray-500 line-clamp-3 mb-6'>{points.explain}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className='basis-1/3 h-full z-20'>
            {/* Search box */}
            <div className='w-full p-6 bg-[#F5F5F5] mb-6'>
              <div className='w-full max-w-[300px] flex border-2 border-gray-300 text-gray-500 rounded overflow-hidden text-md items-center'>
                <input 
                  className='w-full py-3 pl-4' 
                  name='search' 
                  placeholder='Search...' 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <div 
                  className='w-[65px] py-3 h-full grid justify-center items-center hover:bg-[#37c0bd] bg-[#446E6D] transition duration-700 cursor-pointer' 
                  style={{height:'100%'}}
                  onClick={handleSearch}
                >
                  <SearchIcon className="text-bold text-white"/>
                </div>
              </div>
            </div>
            
            {/* Topics sidebar */}
            <div className='w-full mb-6 p-6 bg-[#F5F5F5] text-[#0a1121]' style={{fontFamily:'Nunito,sans-serif'}}>
              <p className='mb-6 text-lg font-bold w-full'>Topics</p>
              {blogData.map((item, index) => (
                <p 
                  className='w-full mb-2 text-gray-500 flex items-center hover:text-[#37c0bd] transition-colors duration-700 cursor-pointer' 
                  onClick={() => {setCategory(item.about); setSingle(null)}} 
                  key={index}
                >
                  <ArrowForwardIosIcon fontSize='inherit' className='font-semibold'/>{item.about}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}