"use client";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Videoplayer from "@/components/shaerd/Video";

interface Testimonial {
  _id: any;
  Testimonial: string;
  video: string;
  image?: string;
  postedBy?: string;
  role?: string;
  relatedService?: Object | any;
  relatedIndustries?: Object | null;
  relatedProduct?: Object | null;
  relatedChild?: Object | null;
}

export default function CaseStudy({ parent, child, product, data }: {
  parent?: any;
  child?: string;
  product?: string;
  industry?: string;
  data?: Testimonial[];
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("/api/testimonial/get");
        if (parent || child || product) {
          const filteredItems = res.data.testimonials.filter(
            (item: Testimonial) =>
              (parent && item.relatedService?._id === parent) ||
              (child && item.relatedProduct === child) ||
              (product && item.relatedChild === product)
          );
          setTestimonials(filteredItems);
        } else {
          setTestimonials(res.data.testimonials);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      }
    };
    if (data) {
      setTestimonials(data)
    } else {
      fetchTestimonials();
    }
  }, []);

  const handleVideoPlay = () => {
    // Pause autoplay when video starts playing
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
    }
  };

  const handleVideoEnd = () => {
    // Resume autoplay when video ends
    if (swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <div className="z-20 w-full flex flex-col" id="case-study">
      <div className="mx-auto text-center w-full lg:w-[1280px] my-20 lg:my-40 relative px-4 lg:px-0">
        <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6 uppercase">
          Customer Success Story
        </h1>
        <p className="text-[#393939] text-base lg:text-xl">
          Discover how businesses are revolutionizing customer success with
          WEBME.
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
                      {/* VideoPlayer with built-in controls */}
                      <Videoplayer
                        src={item.video}
                        aspectRatio="16/9"
                        themeColor="#446E6D"
                        className="w-full h-full"
                        // controls={true}
                        muted={false}
                        playsInline={true}
                        onEnd={handleVideoEnd}
                      />
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
                        style={{ minHeight: "calc(8 * 1.5em)" }}
                      >
                        <span className="font-semibold">
                          {item.Testimonial}
                        </span>
                      </span>
                      <br />
                      <br />
                      <div className="flex gap-3 items-center">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.postedBy || "Testimonial author"}
                            className="h-10 w-10 rounded-full object-cover"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        )}
                        <div>
                          <span className="font-medium text-xl">
                            {item.postedBy}
                          </span>
                          <p className="mt-1 text-lg lg:text-xl font-extralight">
                            {item.role}
                          </p>
                        </div>
                      </div>
                      <button className="mt-10 text-[#446E6D] border-[1px] border-[#446E6D] py-2 lg:py-3 lg:px-8 px-4 flex items-center rounded font-semibold cursor-pointer gap-2 text-sm lg:text-base hover:bg-[#446E6D] hover:text-white transition-all">
                        <span className="flex items-center">
                          Read the story{" "}
                          <OpenInNewIcon fontSize="inherit" className="ml-1" />
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
