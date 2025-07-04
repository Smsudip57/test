"use client";
import React, { useEffect, useState, useRef } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Head from "next/head";
import axios from "axios";
import CaseStudy from "@/components/main/CaseStudy";
import BlogSection from "@/components/shaerd/Blog";
import FaqSection from "@/components/shaerd/Faqs";
import KnowledgeBase from "@/components/shaerd/Knowledgebase";
import Projects from "@/components/main/Projects";
import Industies from "@/components/main/Industies";
import { motion, AnimatePresence } from "framer-motion";
import Contact from "@/components/main/Contact";


export default function Page({ details: Service }) {
  const [f1, setf1] = useState(false);
  const [f2, setf2] = useState(false);
  const [f3, setf3] = useState(false);
  const [f4, setf4] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("/api/servicedetails/get");
        if (response?.data) {
          // console.log(response?.data?.servicedetails)
          // console.log(Service)
          setdetails(
            response?.data?.servicedetails?.find(
              (item) => item?.relatedServices?._id === Service?._id
            )
          );
        }
      } catch (error) {}
    };
    fetchdata();
  }, []);

  return (
    <div className="min-h-screen min-w-screen text-center relative font-sans">
      <title>
        {Service?.Title
          ? `Webmedigital - ${Service?.Title}`
          : "Webmedigital - Projects"}
      </title>
      <Head>
        <meta
          name="description"
          content={
            Service?.description ||
            "Explore this amazing details?.Service with a detailed showcase."
          }
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content={Service?.Title || "Project Showcase"}
        />
        <meta
          property="og:description"
          content={
            Service?.moreDetail ||
            "Explore this amazing details?.Service with a detailed showcase."
          }
        />
        <meta
          property="og:image"
          content={Service?.image || "/default-image.jpg"}
        />
        {/* <meta property="og:url" content={window.location.href} /> */}
      </Head>

      <header className="flex min-h-screen">
        <section className="basis-1/2 min-h-full pt-16 flex flex-col justify-center items-start text-start px-[10%] gap-10">
          <h1 className="text-6xl lg:text-4xl font-semibold text-[#446E6D]">
            {Service?.Title}
          </h1>
          <p className="text-xl font-sans">{Service?.moreDetail}</p>
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
            <img src={Service?.image} alt="Service overview" />
          </div>
        </section>
      </header>

      {Service?.sections?.map((item, index) => (
        <section key={index} className={`${index % 2 === 0 ? "my-24" : ""}`}>
          <div className="w-4/5 mx-auto flex justify-between gap-[15%]">
            <div
              className={`basis-1/2 w-full h-full pt-[10%] ${
                index % 2 === 0 ? "order-1" : "order-2"
              }`}
            >
              <img src={item?.image} alt={item?.title} className="w-full" />
            </div>
            <div
              className={`basis-1/2 h-full pt-16 items-start text-start ${
                index % 2 === 0 ? "order-2" : "order-1"
              }`}
            >
              <h2 className="text-5xl lg:text-3xl font-semibold text-[#446E6D]">
                {item?.title}
              </h2>
              <PointComp points={item?.points} />
            </div>
          </div>
        </section>
      ))}

      <div className="w-[90%] mx-auto lg:w-full">
        <CaseStudy child={Service?._id} />
      </div>

       <div
            aria-labelledby="related-projects-heading flex"
            className="mt-20 relative z-30 text-left"
          >
            <h2 id="related-projects-heading" className="sr-only">
              Related Projects
            </h2>
            <Projects product={Service?._id} child={Service?._id} />
          </div>

      <div className="mx-auto min-h-screen flex justify-center items-center">
        <KnowledgeBase child={Service?._id} product={Service?._id} />
      </div>

      {/* FAQ Section Component */}
      <FaqSection child={Service?._id} product={Service?._id} />
      <section aria-labelledby="industries-heading" className="mt-16 relative z-20">
            <h2 id="industries-heading" className="sr-only">
              Industries We Serve
            </h2>
            <Industies product={Service?._id} />
          </section>
          <section aria-labelledby="industries-heading" className="mt-16">
            <Contact />
          </section>
    </div>
  );
}

// Main PointComp component
const PointComp = ({ points }) => {
  return (
    <div className="text-xl font-sans mt-12 border-l-2 border-[#446E6D] flex flex-col gap-8">
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
        threshold: 0.7, // Trigger when 30% of the element is visible
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
