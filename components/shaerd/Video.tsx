"use client";
import React, { useState, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  aspectRatio?: string; // "16/9", "4/3", etc.
  themeColor?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean; // Whether to show native controls
  onEnd?: () => void;
  playsInline?: boolean;
  onPlay?: () => void; // Optional click handler for the video
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  aspectRatio = "16/9",
  themeColor = "#446E6D",
  className = "",
  autoPlay = false,
  muted = false,
  loop = false,
  controls = false,
  onEnd,
  playsInline = true,
  onPlay
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    if (onEnd) onEnd();
  };

  // Convert hex color to rgba for opacity
  const hexToRGBA = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className={`relative w-full h-auto ${className}`} style={{ aspectRatio }}>
      <video 
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        playsInline={playsInline}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls && isPlaying}
      />
      
      {/* Play button overlay when paused */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer transition-opacity duration-300 hover:bg-opacity-20"
          onClick={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            togglePlay();
            if (onPlay) onPlay();
          }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: hexToRGBA(themeColor, 0.9) }}
          >
            <PlayArrowIcon style={{ fontSize: '3rem', color: 'white' }} />
          </div>
        </div>
      )}
      
      {/* Pause button when playing */}
      {isPlaying && (
        <div 
          className="absolute bottom-4 right-4 opacity-70 hover:opacity-100 transition-opacity duration-300"
          onClick={(e)=>{ e.preventDefault();
            e.stopPropagation();
            togglePlay();
            if (onPlay) onPlay();
          }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            style={{ backgroundColor: hexToRGBA(themeColor, 0.9) }}
          >
            <PauseIcon style={{ fontSize: '1.5rem', color: 'white' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;