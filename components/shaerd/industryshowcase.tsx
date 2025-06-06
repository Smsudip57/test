"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define proper TypeScript interfaces
interface Industry {
  _id: string;
  Title: string;
  slug?: string;
  image: string;
  detail?: string;
  category?: {
    Title: string;
  };
}

interface IndustryShowcaseProps {
  service: Industry[];
}





const IndustryShowcase: React.FC<IndustryShowcaseProps> = ({ service: industries = [] }) => {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    console.log(active);
  }, [active]);

  const services = industries?.map((item:any) => item?.category).filter((value) => value) || [];
const uniqueIndustryTitles = services?.map((item:any) => item?.Title) || [];
  // const uniqueIndustryTitles = industries.length > 0
  //   ? Array.from(new Set(industries.map((industry: Industry) => industry.Title)))
  //   : [];
  
  // Filter industries based on selected title
  const filteredIndustries = active 
    ? industries.filter((industry: Industry) => industry?.category?.Title === active)
    : industries;

  return (
    <section className="" style={{ backgroundColor: "rgba(231,247,246,1)" }} id="services">
      {/* Navbar */}
      <div className="lg:w-full md:text-xl hidden lg:text-2xl text-[#282828] font-lora mb-10 font-extralight list-none lg:flex justify-around p-5 box-border uppercase cursor-pointer opacity-50 mt-6" role="navigation" aria-label="Industry categories">
        {uniqueIndustryTitles.map((title: string, index: number) => (
          <React.Fragment key={index}>
            <li
              className="py-0 hover:opacity-60 text-nowrap"
              onClick={() => setActive(title)}
              role="button"
              tabIndex={0}
              aria-pressed={active === title}
            >
              {title}
            </li>
            {index < uniqueIndustryTitles.length - 1 && 
              <li className="border-[1px] border-[#446E6D] opacity-50"></li>
            }
          </React.Fragment>
        ))}
      </div>

      {/* Image Cards Grid */}
      <div className="text-center pb-10 md:pb-24 px-4 sm:px-0 lg:px-[48px] z-10">
        <div className="flex flex-col justify-center sm:flex-wrap gap-4 lg:gap-5 sm:flex-row">
          <AnimatePresence>
            {filteredIndustries.map((industry: Industry, index: number) => (
              <motion.div
                key={industry._id || index}
                layout
                initial={{ opacity: 1 }}
                animate={{
                  opacity: active === "" || active === industry?.category?.Title ? 1 : 0.1,
                  scale: active === "" || active === industry.Title ? 1 : 0.95,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  type: "tween", 
                  duration: 0.5, 
                  ease: "easeInOut",
                  opacity: { duration: 0.5 }
                }}
                className="sm:basis-1/3 lg:basis-1/4 aspect-[16/9]"
              >
                <a href={`/industry/${industry.slug || industry._id}`} target="_blank" rel="noopener noreferrer">
                  <img
                    src={industry.image}
                    alt={industry.Title || "Industry image"}
                    className={`w-full p-1 cursor-default rounded-md overflow-hidden aspect-[16/9] border-[1px] shadow-md shadow-slate-500 transition-all duration-300 ${
                      active === industry.Title ? "bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1" : "border-[#76b4b1d0]"
                    }`}
                  />
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default IndustryShowcase;