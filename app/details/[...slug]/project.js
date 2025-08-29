"use client";
import React, { useState } from "react";
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
  const [f1, setf1] = useState(false);
  const [f2, setf2] = useState(false);
  const [f3, setf3] = useState(false);
  const [f4, setf4] = useState(false);

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
              className={`basis-1/2 w-full h-full pt-[10%] ${sectionIndex % 2 === 0 ? "order-1" : "order-2"
                }`}
            >
              {/* Using the ImageCarousel component */}
              <ImageCarousel images={section.image} title={section.title} />
            </div>
            <div
              className={`basis-1/2 h-full pt-16 items-start text-start ${sectionIndex % 2 === 0 ? "order-2" : "order-1"
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
        <KnowledgeBase parent={project?.relatedServices} />
      </div>

      {/* FAQ Section Component */}
      <FaqSection parent={project?.relatedServices} />

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

// Clean PointItem component using Framer Motion's whileInView - no glitches!
const PointItem = ({ item, index }) => {
  const [isManuallyToggled, setIsManuallyToggled] = useState(false);

  // Manual toggle function for click interaction
  const handleClick = () => {
    setIsManuallyToggled(prev => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`w-full border-l-4 pl-6 cursor-pointer transition-all duration-300 ease-in-out ${true ? "border-l-[#446E6D]" : "border-l-white"
        }`}
      onClick={handleClick}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Title with viewport-triggered animations */}
      <motion.h3
        initial={{ color: "#666666", scale: 1 }}
        whileInView={{
          color: "#446E6D",
          scale: 1.05,
          transition: { duration: 0.4, delay: index * 0.1 }
        }}
        whileHover={{ scale: 1.08 }}
        viewport={{
          threshold: 0.3,
          margin: "0px 0px -50px 0px",
          once: false // Allow re-triggering
        }}
        className="text-2xl font-semibold transition-colors duration-300"
      >
        {item?.title}
      </motion.h3>

      {/* Content that expands when in viewport */}
      <motion.div
        initial={{ height: 0, opacity: 0, y: -10 }}
        whileInView={
          isManuallyToggled
            ? { height: "auto", opacity: 1, y: 0 } // If manually toggled, stay open
            : {
              height: "auto",
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                delay: index * 0.1 + 0.2,
                ease: [0.04, 0.62, 0.23, 0.98]
              }
            }
        }
        exit={{
          height: 0,
          opacity: 0,
          y: -10,
          transition: { duration: 0.4, ease: "easeInOut" }
        }}
        viewport={{
          threshold: 0.2,
          margin: "0px 0px -80px 0px",
          once: false
        }}
        className="overflow-hidden"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: index * 0.1 + 0.4 }
          }}
          viewport={{ threshold: 0.2, once: false }}
          className="text-lg font-sans mt-4 mb-6 text-stone-700 leading-relaxed"
        >
          {item?.detail}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
