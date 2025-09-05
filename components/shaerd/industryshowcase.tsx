"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import VideoPlayer from "@/components/shaerd/Video";

// Define interfaces for type safety
interface ServiceType {
  _id: string;
  Name?: string;
  Title: string;
  slug?: string;
}

interface MediaType {
  type: "image" | "video";
  url: string;
}

interface ProjectType {
  _id: string;
  Title: string;
  slug?: string;
  relatedServices: string;
  media: MediaType;
}

// Enhanced project type with key property
interface EnhancedProjectType extends ProjectType {
  key: string;
}

interface WebmeProps {
  service: ServiceType[];
}

const Webme: React.FC<WebmeProps> = ({ service: apiservice }) => {
  const [active, setActive] = useState<string>("");

  // Extract unique parent services
  const uniqueParentServices = apiservice
    ?.map((item: any) => item?.parentService)
    ?.filter((service, index, self) =>
      service && self.findIndex(s => s?.Name === service?.Name || s?.Title === service?.Title) === index
    ) || [];


  // Reorder list: bring related items to the top
  const sortedServices: any = Array.isArray(apiservice)
    ? [...apiservice].sort((a: any, b: any) => {
      if (!active) return 0; // No sorting if no active hover
      if (a?.parentService?.Name === active && b?.parentService?.Name !== active) return -1; // Move related items up
      if (b?.parentService?.Name === active && a?.parentService?.Name !== active) return 1; // Move unrelated items down
      return 0; // Keep original order for others
    })
    : [];

  return (
    <section
      className="rounded-lg"
      style={{ backgroundColor: "rgba(231,247,246,1)" }}
      id="services"
    >
      {/* Navbar */}
      <div className="lg:w-full md:text-xl hidden lg:text-2xl text-[#282828] font-lora mb-10 font-extralight list-none lg:flex justify-evenly p-5 box-border uppercase cursor-pointer opacity-50 mt-6">
        {uniqueParentServices?.map((item, index) => (
          <React.Fragment key={item?._id || index}>
            <li
              className="py-0 hover:opacity-60 text-nowrap"
              onClick={() => setActive(item?.Name ? item.Name : item.Title)}
            >
              {item?.Name ? item.Name : item.Title}
            </li>
            {index !== uniqueParentServices.length - 1 && (
              <li className="border-[1px] border-[#446E6D] opacity-50"></li>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Title Animation */}
      <div className="text-center pb-10 md:pb-24 px-4 sm:px-0 lg:px-[48px] z-10">
        {/* Image Cards Grid */}
        <div className="flex flex-col justify-center sm:flex-wrap gap-4 lg:gap-5 sm:flex-row">
          <AnimatePresence>
            {sortedServices.map((item: any, index:any) => (
              <motion.div
                key={item.key + index}
                layout // Enables smooth movement transition
                initial={{ opacity: 1 }}
                animate={{
                  opacity: active === "" || active === item?.parentService?.Name ? 1 : 0.1,
                  scale: active === "" || active === item?.parentService?.Name ? 1 : 0.95, // Fade unrelated items
                }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "tween",
                  duration: 0.5,
                  ease: "easeInOut",
                  opacity: {
                    duration: active === "" || active === item.key ? 0.5 : 0.5,
                  }, // Longer fade for unrelated
                }}
                className="sm:basis-1/3 lg:basis-1/4 aspect-[16/9]"
              >
                {item?.media?.type === "video" ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden cursor-pointer">
                    <a
                      href={`/details/projects/${item?.slug ? item.slug : item.Title
                        }`}
                      className=""
                    >
                      <VideoPlayer
                        src={item?.media?.url}
                        themeColor="#446E6D"
                        controls={true}
                      />
                    </a>
                  </div>
                ) : (
                  <a
                    href={`/details/products/${item?.slug ? item.slug : item.Title
                      }`}
                  >
                    <img
                      src={item?.image}
                      alt={item.Title}
                      className={`w-full p-1 rounded-md overflow-hidden aspect-[16/9] border-[1px] shadow-md shadow-slate-500 transition-all duration-300 ${active === item.key
                          ? "bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1"
                          : "border-[#76b4b1d0]"
                        }`}
                    />
                  </a>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Webme;
