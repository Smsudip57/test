"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VideoPlayer from "@/components/shaerd/Video";

interface Project {
  _id: any;
  Title: string;
  slug: string;
  detail: string;
  media?: {
    url: string;
    type: "image" | "video";
  };
  image?: string;
  relatedServices?: any[];
  relatedProducts?: any[];
  relatedChikfdServices?: any[];
  relatedIndustries?: any[];
  section?: any[];
}

export default function ProjectCarousel({
  data,
  title = "Projects",
}: {
  data?: Project[];
  title?: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setProjects(data);
    }
  }, [data]);

  const handleVideoPlay = () => {
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleVideoEnd = () => {
    if (swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="z-20 w-full flex flex-col" id="project-carousel">
      <div className="mx-auto text-center w-full lg:w-[1280px] my-20 lg:my-40 relative px-4 lg:px-0">
        <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6 uppercase">
          {title}
        </h1>
        <p className="text-[#393939] text-base lg:text-xl">
          Discover real-world implementations and successful project outcomes
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
          {projects.map((project, index) => (
            <SwiperSlide key={index}>
              <div className="w-full relative overflow-hidden rounded-2xl shadow-md">
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ zIndex: -1 }}
                >
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
                      {project.media?.type === "video" ? (
                        <VideoPlayer
                          src={project.media.url}
                          aspectRatio="16/9"
                          themeColor="#446E6D"
                          className="w-full h-full"
                          muted={false}
                          playsInline={true}
                          onEnd={handleVideoEnd}
                        />
                      ) : (
                        <img
                          src={project.media?.url || project.image}
                          alt={project.Title}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="basis-full lg:basis-1/2">
                    <div className="px-6 pb-16 lg:py-16 lg:pr-24 text-left">
                      <h2 className="font-bold text-2xl lg:text-3xl text-[#0B2B20] font-lora mb-6">
                        {project.Title}
                      </h2>
                      <p className="text-lg lg:text-xl text-[#393939] mb-8 line-clamp-[6]">
                        {project.detail}
                      </p>

                      {project.section && project.section.length > 0 && (
                        <div className="mb-8">
                          <h3 className="font-semibold text-lg mb-4 text-[#0B2B20]">
                            Key Highlights:
                          </h3>
                          <ul className="space-y-3">
                            {project.section.slice(0, 3).map((section, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-base"
                              >
                                <span className="text-[#446E6D] font-bold mt-1">
                                  •
                                </span>
                                <div>
                                  <strong className="text-[#0B2B20]">
                                    {section.title}
                                  </strong>
                                  {section.points &&
                                    section.points.length > 0 && (
                                      <p className="text-sm text-[#393939]">
                                        {section.points[0].title}
                                      </p>
                                    )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button className="mt-6 text-[#446E6D] border-[1px] border-[#446E6D] py-2 lg:py-3 lg:px-8 px-4 flex items-center rounded font-semibold cursor-pointer gap-2 text-sm lg:text-base hover:bg-[#446E6D] hover:text-white transition-all">
                        <Link
                          href={`/details/projects/${
                            project.slug || project.Title
                          }`}
                          className="flex items-center w-full h-full"
                        >
                          View Project{" "}
                          <OpenInNewIcon fontSize="inherit" className="ml-1" />
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute shadow-lg right-[-10px] lg:-right-6 transform top-1/2 translate-y-1/2 z-[99999999] bg-white w-[52px] h-[52px] rounded-full flex justify-center items-center swiper-button-n cursor-pointer hover:bg-gray-100 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
          >
            <path
              fill="#000"
              fillRule="evenodd"
              d="M8.25 3.667 15.584 11 8.25 18.333 6.417 16.5l5.5-5.5-5.5-5.5L8.25 3.667Z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>

        <div className="absolute shadow-lg left-[-10px] lg:-left-6 transform top-1/2 translate-y-1/2 z-10 bg-white w-[52px] h-[52px] rounded-full flex justify-center items-center swiper-button-p cursor-pointer hover:bg-gray-100 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
          >
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
