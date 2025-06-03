"use client";
import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ImageCarouselProps {
  images: string[];
  title?: string;
  height?: string | number;
  autoSlideInterval?: number;
  pauseDuration?: number;
  themeColor?: string;
  showArrows?: boolean;
  showIndicators?: boolean;
  className?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  onImageChange?: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  title = "Image Carousel",
  height = '400px',
  autoSlideInterval = 3000,
  pauseDuration = 5000,
  themeColor = "#446E6D",
  showArrows = true,
  showIndicators = true,
  className = "",
  aspectRatio = "16/9",
  objectFit = 'cover',
  onImageChange
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle slide transition
  const goToSlide = (index: number, slideDirection: 'left' | 'right') => {
    if (index === activeIndex) return;
    setDirection(slideDirection);
    setActiveIndex(index);
    if (onImageChange) onImageChange(index);
  };

  const nextSlide = () => {
    if (!images || !Array.isArray(images) || images.length <= 1) return;
    const newIndex = (activeIndex + 1) % images.length;
    goToSlide(newIndex, 'left');
  };

  const prevSlide = () => {
    if (!images || !Array.isArray(images) || images.length <= 1) return;
    const newIndex = (activeIndex - 1 + images.length) % images.length;
    goToSlide(newIndex, 'right');
  };

  const handleIndicatorClick = (index: number) => {
    if (index === activeIndex) return;
    goToSlide(index, index > activeIndex ? 'left' : 'right');
  };

  // Pause auto-sliding on user interaction
  const handleUserInteraction = () => {
    setPaused(true);
    
    // Resume auto-sliding after pauseDuration seconds of inactivity
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setPaused(false);
    }, pauseDuration);
  };

  // Set up auto-sliding
  useEffect(() => {
    if (!images || !Array.isArray(images) || images.length <= 1 || paused) return;
    
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images, activeIndex, paused, autoSlideInterval]);

  // Clean up timeouts and intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle no images or empty array
  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-md w-full flex items-center justify-center text-gray-400 ${className}`} style={{ height }}>
        No images available
      </div>
    );
  }

  // For single image, just display it without carousel
  if (images.length === 1) {
    return (
      <div className={`relative rounded-md shadow-md overflow-hidden ${className}`} style={{ height, aspectRatio }}>
        <img 
          src={images[0]} 
          alt={`${title}`}
          className={`w-full h-full object-${objectFit}`}
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative rounded-md shadow-md overflow-hidden ${className}`} 
      style={{ height, aspectRatio }}
      onMouseEnter={handleUserInteraction}
      onClick={handleUserInteraction}
    >
      <div className="relative w-full h-full overflow-hidden">
        {images.map((src, index) => (
          <div 
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
              index === activeIndex ? 'z-10' : 'z-0'
            }`}
            style={{ 
              transform: index === activeIndex 
                ? 'translateX(0)' 
                : direction && index === (direction === 'left' 
                  ? (activeIndex - 1 + images.length) % images.length 
                  : (activeIndex + 1) % images.length)
                  ? `translateX(${direction === 'left' ? '-100%' : '100%'})`
                  : index < activeIndex 
                    ? 'translateX(-100%)' 
                    : 'translateX(100%)'
            }}
          >
            <img 
              src={src}
              alt={`${title} - image ${index + 1}`}
              className={`w-full h-full object-${objectFit}`}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button 
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity duration-200 z-20"
            onClick={(e) => {
              e.stopPropagation();
              handleUserInteraction();
              prevSlide();
            }}
          >
            <ArrowBackIosIcon style={{ fontSize: '1rem', color: themeColor }} />
          </button>
          <button 
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md opacity-70 hover:opacity-100 transition-opacity duration-200 z-20"
            onClick={(e) => {
              e.stopPropagation();
              handleUserInteraction();
              nextSlide();
            }}
          >
            <ArrowForwardIosIcon style={{ fontSize: '1rem', color: themeColor }} />
          </button>
        </>
      )}
      
      {/* Slide indicators */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, index) => (
            <button 
              key={index}
              className={`w-2 h-2 rounded-full ${activeIndex === index ? `bg-[${themeColor}]` : 'bg-gray-300'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleUserInteraction();
                handleIndicatorClick(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;