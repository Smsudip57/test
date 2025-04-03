"use client";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader } from "lucide-react";

interface Testimonial {
  _id: any;
  Testimonial: string;
  video: string;
  image?: string;
  postedBy?: string;
  role?: string;
  relatedService?: Object | null;
  relatedIndustries?: Object | null;
  relatedUsers?: Object | null;
}

export default function CaseStudy() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [videoError, setVideoError] = useState<{ [key: string]: boolean }>({});
  const [isMuted, setIsMuted] = useState(true);
  const [controlsVisible, setControlsVisible] = useState<{ [key: string]: boolean }>({});
  
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const swiperRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

  const showControls = (id: string) => {
    // Clear any existing timeout
    if (controlsTimeoutRef.current[id]) {
      clearTimeout(controlsTimeoutRef.current[id]!);
      controlsTimeoutRef.current[id] = null;
    }
    setControlsVisible(prev => ({ ...prev, [id]: true }));
  };

  const hideControls = (id: string) => {
    // Set a timeout to hide controls after 2.5 seconds
    controlsTimeoutRef.current[id] = setTimeout(() => {
      setControlsVisible(prev => ({ ...prev, [id]: false }));
    }, 2500);
  };

  const togglePlay = (id: string) => {
    if (!videoRefs.current[id]) return;
    
    // Pause all other videos
    Object.keys(videoRefs.current).forEach((videoId) => {
      if (videoId !== id && videoRefs.current[videoId] && !videoRefs.current[videoId]?.paused) {
        videoRefs.current[videoId]?.pause();
      }
    });
    
    // Toggle current video
    if (videoRefs.current[id]?.paused) {
      videoRefs.current[id]?.play();
      setPlayingVideoId(id);
      
      // Disable autoplay when video is playing
      if (swiperRef.current) {
        swiperRef.current.autoplay.stop();
      }
    } else {
      videoRefs.current[id]?.pause();
      setPlayingVideoId(null);
      
      // Re-enable autoplay when video is paused
      if (swiperRef.current) {
        swiperRef.current.autoplay.start();
      }
    }
  };

  const toggleMute = () => {
    Object.keys(videoRefs.current).forEach((videoId) => {
      if (videoRefs.current[videoId]) {
        videoRefs.current[videoId]!.muted = !isMuted;
      }
    });
    setIsMuted(!isMuted);
  };

  const enterFullscreen = (id: string) => {
    if (!videoRefs.current[id]) return;
    
    const video = videoRefs.current[id];
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    }
  };

  const handleVideoLoading = (id: string, isLoading: boolean) => {
    setIsLoading(prev => ({ ...prev, [id]: isLoading }));
  };

  const handleVideoError = (id: string) => {
    setVideoError(prev => ({ ...prev, [id]: true }));
    handleVideoLoading(id, false);
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("/api/testimonial/get");
        setTestimonials(res.data.testimonials);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  // Cleanup videos when sliding
  useEffect(() => {
    const handleSlideChange = () => {
      if (playingVideoId && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId]?.pause();
        setPlayingVideoId(null);
      }
    };

    if (swiperRef.current) {
      swiperRef.current.on('slideChange', handleSlideChange);
    }

    return () => {
      if (swiperRef.current) {
        swiperRef.current.off('slideChange', handleSlideChange);
      }
    };
  }, [playingVideoId]);

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      Object.values(controlsTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  return (
    <div className="z-20 w-full flex flex-col" id="case-study">
      <div className="mx-auto text-center w-full lg:w-[1280px] my-20 lg:my-40 relative px-4 lg:px-0">
        <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6 uppercase">
          Customer Success Story
        </h1>
        <p className="text-[#393939] text-base lg:text-xl">
          Discover how businesses are revolutionizing customer success with WEBME.
        </p>

        <Swiper
          slidesPerView={1}
          spaceBetween={100}
          loop={true}
          navigation={{
            nextEl: ".swiper-button-n",
            prevEl: ".swiper-button-p",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper shadow mt-16 rounded-2xl"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="w-full relative overflow-hidden rounded-2xl shadow-md">
                <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
                  <svg
                    width="1280"
                    height="459"
                    viewBox="0 0 1280 459"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2462 -979C2462 -184.814 1812.81 459 1012 459C211.187 459 -438 -184.814 -438 -979C-438 -1773.19 211.187 -2417 1012
                            -2417C1812.81 -2417 2462 -1773.19 2462 -979Z"
                      fill="rgb(259, 240, 255)"
                    ></path>
                  </svg>
                </div>
                <div className="w-full flex flex-col lg:flex-row items-center">
                  <div className="basis-full lg:basis-1/2 h-full w-full p-6 lg:p-16 lg:pr-6">
                    <div className="relative h-max w-full rounded-lg overflow-hidden aspect-video">
                      {/* Loading overlay */}
                      {isLoading[item._id] && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                          <Loader className="w-10 h-10 text-white animate-spin" />
                        </div>
                      )}
                      
                      {/* Error overlay */}
                      {videoError[item._id] && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
                          <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-white">Video failed to load</p>
                        </div>
                      )}
                      
                      {/* Video container */}
                      <div 
                        className="relative w-full h-full"
                        onMouseEnter={() => showControls(item._id)}
                        onMouseLeave={() => hideControls(item._id)}
                      >
                        <video
                          ref={(el) => {
                            if (el) {
                              videoRefs.current[item._id] = el;
                            }
                          }}
                          src={item.video}
                          className="w-full h-full object-cover rounded-lg"
                          muted={isMuted}
                          preload="metadata"
                          onLoadStart={() => handleVideoLoading(item._id, true)}
                          onLoadedData={() => handleVideoLoading(item._id, false)}
                          onError={() => handleVideoError(item._id)}
                          onPause={() => {
                            if (playingVideoId === item._id) {
                              setPlayingVideoId(null);
                            }
                          }}
                        />

                        {/* Video controls overlay */}
                        <div 
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                            controlsVisible[item._id] || playingVideoId === item._id ? 'opacity-100' : 'opacity-0'
                          }`}
                          onClick={() => togglePlay(item._id)}
                        >
                          <div className="relative flex items-center justify-center">
                            <div className={`bg-black bg-opacity-50 rounded-full p-4 transition-all transform ${
                              controlsVisible[item._id] || playingVideoId === item._id ? 'scale-100' : 'scale-0'
                            }`}>
                              {playingVideoId === item._id ? (
                                <Pause className="w-8 h-8 text-white" />
                              ) : (
                                <Play className="w-8 h-8 text-white" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Video controls bottom bar */}
                        <div className={`absolute bottom-0 left-0 right-0 flex justify-between items-center p-3 bg-gradient-to-t from-black to-transparent transition-opacity duration-300 ${
                          controlsVisible[item._id] || playingVideoId === item._id ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMute();
                            }}
                            className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
                          >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              enterFullscreen(item._id);
                            }}
                            className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
                          >
                            <Maximize className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="basis-full lg:basis-1/2">
                    <div className="px-6 pb-16 lg:py-16 lg:pr-24 text-left">
                      <div className="h-[16px] lg:h-[32px] mb-5">
                        <img
                          src="https://a.sfdcstatic.com/shared/images/pbc/icons/quotation-english.svg"
                          alt="quote"
                          className="h-full"
                        />
                      </div>
                      <span 
                        className="text-xl lg:text-2xl line-clamp-[9]"
                        style={{ minHeight: 'calc(8 * 1.5em)' }}
                      >
                        <span className="font-semibold">{item.Testimonial}</span>
                      </span>
                      <br />
                      <br />
                      <div className="flex gap-3 items-center">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.postedBy || "Testimonial author"}
                            className="h-10 w-10 rounded-full object-cover" 
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        )}
                        <div>
                          <span className="font-medium text-xl">{item.postedBy}</span>
                          <p className="mt-1 text-lg lg:text-xl font-extralight">{item.role}</p>
                        </div>
                      </div>
                      <button className="mt-10 text-[#446E6D] border-[1px] border-[#446E6D] py-2 lg:py-3 lg:px-8 px-4 flex items-center rounded font-semibold cursor-pointer gap-2 text-sm lg:text-base hover:bg-[#446E6D] hover:text-white transition-all">
                        <span className="flex items-center">
                          Read the story <OpenInNewIcon fontSize="inherit" className="ml-1" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute shadow-lg right-[-10px] lg:-right-6 transform top-1/2 translate-y-1/2 z-[99999999] bg-white w-[52px] h-[52px] rounded-full flex justify-center items-center swiper-button-n cursor-pointer hover:bg-gray-100 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
            <path
              fill="#000"
              fillRule="evenodd"
              d="M8.25 3.667 15.584 11 8.25 18.333 6.417 16.5l5.5-5.5-5.5-5.5L8.25 3.667Z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>

        <div className="absolute shadow-lg left-[-10px] lg:-left-6 transform top-1/2 translate-y-1/2 z-10 bg-white w-[52px] h-[52px] rounded-full flex justify-center items-center swiper-button-p cursor-pointer hover:bg-gray-100 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
            <path
              fill="#000"
              fillRule="evenodd"
              d="M13.75 18.333 6.417 11l7.333-7.333L15.583 5.5l-5.5 5.5 5.5 5.5-1.833 1.833Z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}