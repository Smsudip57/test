"use client";
import React, { useState, useRef, useEffect } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Head from "next/head";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VideoPlayer from "@/components/shaerd/Video";
import ImageCarousel from "@/components/shaerd/ImageCarousel";
import { motion, AnimatePresence } from "framer-motion";
import CaseStudy from "@/components/main/CaseStudy";
import BlogSection from "@/components/shaerd/Blog";
import FaqSection from "@/components/shaerd/Faqs";
import KnowledgeBase from "@/components/shaerd/Knowledgebase";

// VideoPlayer Component

export default function Page({ project }) {
  const [openPoints, setOpenPoints] = useState(
    project?.section?.map(() => 0) || [] // Track first point (index 0) as open by default
  );
  const [f1, setf1] = useState(false);
  const [f2, setf2] = useState(false);
  const [f3, setf3] = useState(false);
  const [f4, setf4] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePoint = (sectionIndex, pointIndex) => {
    setOpenPoints((prev) =>
      prev.map((openPoint, i) =>
        i === sectionIndex
          ? openPoint === pointIndex
            ? null
            : pointIndex
          : openPoint
      )
    );
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Project not found
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen text-center relative font-sans">
      <title>
        {project?.Title
          ? `Webmedigital - ${project?.Title}`
          : "Webmedigital - Projects"}
      </title>
      <Head>
        <meta
          name="description"
          content={
            project?.detail ||
            "Explore this amazing project with a detailed showcase."
          }
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content={project?.Title || "Project Showcase"}
        />
        <meta
          property="og:description"
          content={
            project?.detail ||
            "Explore this amazing project with a detailed showcase."
          }
        />
        <meta
          property="og:image"
          content={project?.media?.url || "/default-image.jpg"}
        />
      </Head>

      <header className="flex min-h-screen max-w-[1920px] mx-auto">
        <section className="basis-1/2 min-h-full pt-16 flex flex-col justify-center items-start text-start pl-[10%] pr-[5%] gap-10">
          <h1 className="text-6xl lg:text-4xl font-semibold text-[#446E6D]">
            {project?.Title}
          </h1>
          <p className="text-xl font-sans">{project?.detail}</p>
          <div className="flex font-sans gap-5">
            <button className="py-2 px-5 bg-[#446E6D] rounded-sm text-white">
              Watch Demo
            </button>
            <button className="py-2 px-5 text-[#446E6D] border-[#446E6D] border-2 rounded-sm bg-white">
              Try for free
            </button>
          </div>
        </section>
        <section className="basis-1/2 min-h-full pt-16 flex flex-col">
          <div className="pt-[10%]">
            {project?.media?.type === "video" ? (
              <VideoPlayer
                src={project?.media?.url}
                themeColor="#446E6D"
                aspectRatio="16/9"
                onEnd={handleVideoEnd}
              />
            ) : (
              <img
                src={project?.media?.url}
                alt={project?.Title}
                className="w-full"
              />
            )}
          </div>
        </section>
      </header>

      {project?.section?.map((section, sectionIndex) => (
        <section
          key={sectionIndex}
          className={`${sectionIndex % 2 === 0 ? "my-24" : ""}`}
        >
          <div className="w-4/5 mx-auto flex justify-between gap-[15%]">
            <div
              className={`basis-1/2 w-full h-full pt-[10%] ${
                sectionIndex % 2 === 0 ? "order-1" : "order-2"
              }`}
            >
              {/* Using the ImageCarousel component */}
              <ImageCarousel images={section.image} title={section.title} />
            </div>
            <div
              className={`basis-1/2 h-full pt-16 items-start text-start ${
                sectionIndex % 2 === 0 ? "order-2" : "order-1"
              }`}
            >
              <h2 className="text-5xl lg:text-3xl font-semibold text-[#446E6D]">
                {section.title}
              </h2>
              <div className="text-xl font-sans mt-12 border-l-2 border-[#446E6D] flex flex-col gap-8">
                <PointComp points={section.points} />
              </div>
            </div>
          </div>
        </section>
      ))}

      <div className="w-[90%] mx-auto lg:w-full">
        <CaseStudy parent={project?.relatedServices} />
      </div>

      <div className="mx-auto min-h-screen flex justify-center items-center">
        <KnowledgeBase parent={project?.relatedServices}  />
      </div>

      {/* FAQ Section Component */}
      <FaqSection parent={project?.relatedServices}  />
      
    </div>
  );
}

const PointComp = ({ points }) => {
  return (
    <div className="text-xl font-sans border-l-2 border-[#446E6D] flex flex-col gap-8">
      {points.map((item, index) => (
        <PointItem key={index} item={item} index={index} />
      ))}
    </div>
  );
};

// Individual PointItem component with improved viewport detection and motion animations
const PointItem = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When element enters viewport, open it
          if (entry.isIntersecting) {
            // Add a small delay so users can see the opening animation
            setTimeout(() => {
              setIsOpen(true);
            }, 200 + index * 100); // Stagger the animations by index
          } else {
            // When element leaves viewport, close it immediately
            setIsOpen(false);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px 0px -100px 0px", // Only trigger when element is well into viewport
      }
    );

    // Start observing this element
    observer.observe(currentElement);

    // Cleanup function
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [index]);

  // Toggle open/closed state manually when clicked
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`w-full border-l-4 pl-6 cursor-pointer transition-all duration-300 ease-in-out ${
        isOpen ? "border-l-[#446E6D]" : "border-l-white"
      }`}
      onClick={toggleOpen}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.h3
        className="text-2xl font-semibold text-[#446E6D]"
        animate={{
          color: isOpen ? "#446E6D" : "#666666",
          scale: isOpen ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {item?.title}
      </motion.h3>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
              y: -10,
              scale: 0.95,
            }}
            animate={{
              height: "auto",
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
              y: -10,
              scale: 0.95,
            }}
            transition={{
              duration: 0.5,
              ease: [0.04, 0.62, 0.23, 0.98], // Custom easing for smooth feel
            }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-lg font-sans mt-4 text-stone-700"
            >
              {item?.detail}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
