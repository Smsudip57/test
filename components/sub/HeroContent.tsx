"use client";

import React, { useState, useEffect, useRef } from "react";
import EastIcon from "@mui/icons-material/East";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  animate,
} from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/utils/motion";
import SearchIcon from "@mui/icons-material/Search";
import { MyContext } from "@/context/context";
import Link from "next/link";
import axios from "axios";

const InfiniteScroller = ({ data }: any) => {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [currentTitle, setCurrentTitle] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const displayItems = [...data, ...data];
  useEffect(() => {
    if (!data || data.length === 0) return;

    if (containerRef.current) {
      const firstItem = containerRef.current.children[0] as HTMLElement;
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth;
        const totalItems = data.length;
        setWidth(itemWidth * totalItems);
      }
    }

    if (data.length > 0 && data[0].masterTitle) {
      setCurrentTitle(data[0].masterTitle);
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(
          (entry) => entry.isIntersecting && entry.intersectionRatio > 0.5
        );

        if (visibleEntries.length > 0) {
          const index = Number(
            visibleEntries[0].target.getAttribute("data-index")
          );
          const item = displayItems[index];
          if (item && item.masterTitle !== currentTitle) {
            setCurrentTitle(item.masterTitle);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0.5],
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [data]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, displayItems?.length);
    itemRefs.current.forEach((ref, index) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [displayItems]);

  useEffect(() => {
    if (width === 0) return;

    const controls = animate(x, -width, {
      type: "tween",
      duration: 60,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });

    return controls.stop;
  }, [width, x]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden relative w-full">
      <h2 className="mx-auto w-max mb-4 text-primary font-semibold text-2xl">
        {currentTitle || "Title"}
      </h2>
      <motion.div
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ x }}
      >
        {displayItems.map((item: any, index: number) => {
          const setRef = (el: HTMLDivElement | null) => {
            itemRefs.current[index] = el;
          };

          return (
            <div
              key={index}
              data-index={index}
              ref={setRef}
              className="scroller-item min-w-max px-4 py-2 flex-shrink-0 inline-block"
            >
              <img
                src={item?.image}
                alt={item?.alt || "Service image"}
                className="w-80 aspect-[16/9] object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

const HeroContent = () => {
  const [imageStyle, setImageStyle] = useState<number>(0);
  const data = "Your IT Solutions Galaxy";
  const data2 = "Search for Products, Services you wish to explore";
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [isTypingData1, setIsTypingData1] = useState(true);
  const { setChatBoxOpen } = React.useContext(MyContext);
  const [services, setServices] = useState<any>([]);

  useEffect(() => {
    // Function to update window width
    const handleResize = () => {
      setImageStyle(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const activeData = isTypingData1 ? data : data2;

      if (!deleting) {
        if (index < activeData.length) {
          setText((prev) => prev + activeData[index]);
          setIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setDeleting(true), 1000);
        }
      } else {
        if (index > 0) {
          setText((prev) => prev.slice(0, -1));
          setIndex((prev) => prev - 1);
        } else {
          setDeleting(false);
          setIsTypingData1((prev) => !prev);
          setIndex(0);
        }
      }
    };

    const timeoutId = setTimeout(handleTyping, 100);
    return () => clearTimeout(timeoutId);
  }, [index, deleting, isTypingData1]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [
          servicesResponse,
          testimonialsResponse,
          industriesResponse,
          projectsResponse,
        ] = await Promise.all([
          axios.get("/api/service/getservice", {
            params: { populate: "category" },
          }),
          axios.get("/api/testimonial/get"),
          axios.get("/api/industry/get"),
          axios.get("/api/project/get"),
        ]);

        const dataSources = [
          { title: "Our Services", data: servicesResponse.data.services },
          {
            title: "Customer Success Stories",
            data: testimonialsResponse.data.testimonials,
          },
          { title: "Industries", data: industriesResponse.data.industries },
          { title: "Our Projects", data: projectsResponse.data.data },
        ];

        const formattedData = dataSources.reduce(
          (allItems: any, { title, data }: any) => {
            if (Array.isArray(data)) {
              const itemsWithMasterTitle = data.map((item) => ({
                masterTitle: title,
                ...item,
                image: item?.image,
              }));

              return [...allItems, ...itemsWithMasterTitle];
            }
            return allItems;
          },
          []
        );
        console.log(formattedData);
        setServices(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally set an error state here
      }
    };

    fetchServices();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="px-10 xl:px-20 min-h-screen z-[20] sm:py-28"
    >
      <motion.div variants={slideInFromTop} className="">
        <div className="bg-slate-300 h-28 w-full rounded-xl overflow-hidden">
          <img
            alt="logo"
            loading="lazy"
            width="100"
            height="36"
            decoding="async"
            data-nimg="1"
            className="w-full h-full object-cover"
            style={{ color: "transparent" }}
            srcSet="/moving-car.gif"
            src="/moving-car.gif"
          />
        </div>
      </motion.div>
      <div className="flex flex-col lg:flex-row items-center justify-center ">
        <div className="w-full flex flex-col gap-5 justify-center m-auto text-start ">
          <motion.div
            variants={slideInFromLeft(0.5)}
            className="flex flex-col gap-6 mt-6 text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
          >
            <div className="z-99999 gap-7 mt-5 flex flex-col w-full">
              <p
                className="font-roboto font-bold leading-[60px] lg:leading-[84px] lg:text-[70px] text-[42px]"
                style={{ fontFamily: "Roboto, sans-serif" }}
              >
                <a
                  className="bg-gradient-to-r from-[#00FFF3] to-[#FFE500] text-transparent inline-block bg-clip-text"
                  href="/"
                >
                  WEBME,
                </a>
                <span className="block text-black mt-4 pt-0.5">
                  Your{" "}
                  <span className="bg-[#282828] text-[#95E0D9] inline-block px-1.5">
                    Co-Pilot
                  </span>{" "}
                  In The IT Journey
                </span>
              </p>
            </div>
            <div className="mt-6 ml-2">
              <div className=" flex gap-5 w-full">
                <button className="align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-base gap-3 items-center font-normal flex">
                  <Link href="#services">
                    Let&#39;s Start
                    <EastIcon fontSize="inherit" />
                  </Link>
                </button>
                <button
                  className="align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-base gap-3 items-center font-normal flex"
                  onClick={() => setChatBoxOpen(true)}
                >
                  Book Free Consultancy
                  <EastIcon fontSize="inherit" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
        I&apos;m a Full Stack Software Engineer with experience in Website,
        Mobile, and Software development. Check out my projects and skills.
        </motion.p> */}
          {/* <motion.a
          variants={slideInFromLeft(0.8)}
          className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]"
        >
          Learn More!
          </motion.a> */}
        </div>

        <motion.div
          variants={slideInFromRight(0.8)}
          className="w-full sm:w-[50%] h-full flex justify-center items-center"
        >
          {/* <Image
          src="/mainIconsdark.svg"
          alt="work icons"
          height={650}
          width={650}
          /> */}
          <div className="w-full md:w-full relative block ">
            <div className="mt-10">
              <div className="w-full mb-4">
                {/* {services?.map((item: any, index: number) => ( */}
                <InfiniteScroller data={services} />
              </div>
              {/* ))} */}
            </div>
            <div className="rounded-[70px] w-full  mx-auto border-[1.5px] gap-2 xs:gap-4 flex md:gap-5 border-[#0B2B20] p-1 justify-between bg-white border-box">
              <div className="flex gap-2.5 items-center">
                <img
                  alt="search"
                  loading="lazy"
                  width="25"
                  height="25"
                  decoding="async"
                  data-nimg="1"
                  className="sm:ml-2 xs:w-6 xs:h-6 w-5 invisible sm:visible"
                  style={{ color: "transparent" }}
                  src="/search.svg"
                />
                <input
                  placeholder={text}
                  className="text-[#101513] text-base xs:text-base leading-7 focus:outline-none"
                />
              </div>
              <button className="bg-[#446E6D] font-medium text-white text-lg sm:text-base px-1.5 xs:px-3 md:px-[34px] py-2 md:py-[11.5px] font-graphik rounded-[39px] border-box">
                <span className="hidden sm:block">webmedigital</span>
                <span className="sm:hidden aspect-square p-2">
                  <SearchIcon fontSize="inherit" />
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroContent;
