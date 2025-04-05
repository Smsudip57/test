"use client";

import React, { useState, useEffect, useRef } from "react";
import EastIcon from "@mui/icons-material/East";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  animate,
  AnimatePresence,
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
import SearchComponent from "./component/heroSearchComponent";
import Image from "next/image";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const Advertiser = ({ data }: any) => {
  const [currentItems, setCurrentItems] = useState<any>([]);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Only proceed if we have valid data
    if (!data || !Array.isArray(data) || data.length === 0) return;

    // Get unique categories
    const categories: String[] = data.map((item: any) => item.masterTitle);
    const uniqueCategories = categories.filter(
      (item, index) => categories.indexOf(item) === index
    );

    // Initial selection
    const selectRandomItems = () => {
      if (uniqueCategories.length === 0) return;

      // Start animation transition
      setIsAnimating(true);

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * uniqueCategories.length);
        const randomCategory = uniqueCategories[randomIndex];

        setCurrentTitle(randomCategory as string);

        const filteredItems = data.filter(
          (item: any) => item.masterTitle === randomCategory
        );

        // Pick random 2 items from filteredItems
        const randomItems = filteredItems
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(2, filteredItems.length));

        setCurrentItems(randomItems);

        // Reset animation flag after items are updated
        setTimeout(() => {
          setIsAnimating(false);
        }, 100);
      }, 500); // Wait for exit animation to complete
    };

    // Initial call
    selectRandomItems();

    // Set up interval for updates
    const interval = setInterval(selectRandomItems, 5000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [data]); // Only depend on data

  return (
    <div className="overflow-hidden relative w-full">
      <motion.h2
        className="mx-auto w-max mb-4 text-primary text-2xl uppercase font-bold"
        key={currentTitle} // Key helps React identify when to animate
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {currentTitle || "Featured"}
      </motion.h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTitle + "-container"} // Unique key for container based on title
          className="flex justify-center items-strech"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentItems.map((item: any, index: number) => {
            return item?.masterTitle === "Customer Success Stories" ? (
              <motion.div
                key={index}
                data-index={index}
                className={` scroller-item min-w-max px-4 py-2 flex-shrink-0 inline-block`}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: index % 2 === 0 ? -50 : 50,
                }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? 50 : -50 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <div
                  className={`max-w-80 bg-white ${
                    item?.masterTitle === "Our Services"
                      ? "aspect-[16/9]"
                      : "aspect-square  "
                  } p-3 px-6 rounded-lg  text-left relative`}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ zIndex: 1 }}
                  >
                    <svg
                      width="full"
                      viewBox="0 0 1280 459"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="aspect-[1280/459]"
                    >
                      <path
                        d="M2462 -979C2462 -184.814 1812.81 459 1012 459C211.187 459 -438 -184.814 -438 -979C-438 -1773.19 211.187 -2417 1012
                            -2417C1812.81 -2417 2462 -1773.19 2462 -979Z"
                        fill="rgb(259, 240, 255)"
                      ></path>
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="h-[10px] mb-2">
                      <img
                        src="https://a.sfdcstatic.com/shared/images/pbc/icons/quotation-english.svg"
                        alt="quote"
                        className="h-full"
                      />
                    </div>
                    <span
                      className="text-xl lg:text-sm line-clamp-[9] "
                      style={{ minHeight: "calc(8 * 1.5em)" }}
                    >
                      <span className="font-medium break-words">
                        {item.Testimonial}
                      </span>
                    </span>
                    {/* <br /> */}
                    {/* <br /> */}
                    <div className="flex gap-3 mt-3 items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.postedBy || "Testimonial author"}
                          className="h-6 w-6 rounded-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      )}
                      <div>
                        <span className="font-medium text-sm">
                          {item.postedBy}
                        </span>
                        <p className="mt-[2px] text-lg lg:text-xs font-extralight">
                          {item.role}
                        </p>
                      </div>
                    </div>
                    <button className="mt-2 text-[#446E6D] border-[1px] border-[#446E6D] py-1  px-2 flex items-center rounded font-semibold cursor-pointer gap-2 text-[10px]  hover:bg-[#446E6D] hover:text-white transition-all">
                      <span className="flex items-center">
                        Read the story{" "}
                        <OpenInNewIcon fontSize="inherit" className="ml-1" />
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : item?.masterTitle === "Our Projects" ? (
              <motion.div
                key={index}
                data-index={index}
                className={` scroller-item min-w-max px-4 py-2 flex-shrink-0 inline-block`}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: index % 2 === 0 ? -50 : 50,
                }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? 50 : -50 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <div
                  className={`max-w-80 ${
                    index % 4 === 0
                      ? "bg-[#FFE8D7]"
                      : index % 3 === 0
                      ? "bg-[#FCE5F3]"
                      : index % 2 === 0
                      ? "bg-[#E5EDFD]"
                      : "bg-[#FFF8BB]"
                  } ${
                    item?.masterTitle === "Our Services"
                      ? "aspect-[16/9]"
                      : "aspect-square  "
                  } p-3 rounded-lg  text-left relative`}
                >
                  <div
                    className={`m-0.5  basis-[46%] lg:basis-[47.2%] rounded-xl`}
                    key={index}
                  >
                    {!(index % 2 === 0) && (
                      <img
                        alt="project-image"
                        loading="lazy"
                        width="0"
                        // height="239"
                        decoding="async"
                        data-nimg="1"
                        className="w-full rounded-lg aspect-[16/9] object-cover"
                        style={{ color: "transparent" }}
                        src={item?.image}
                      />
                    )}
                    <h1
                      className="font-medium text-sm text-[#0B2B20]  font-lora mb-[22px] line-clamp-2"
                      style={{ marginTop: !(index % 2 === 0) ? "24px" :""}}
                    >
                      {item?.Title}
                    </h1>
                    <p className="text-[#0B2B20] text-xs  mb-[10px] whitespace-pre-wrap line-clamp-3">
                      {item?.detail}
                    </p>
                    <button className="bg-[#0B2B20]  px-3 py-1 mb-6 text-[10px] rounded text-white"
                    style={{ marginBottom: !(index % 2 === 0) ? "0px" :""}}
                    >
                      <Link href={`/details/projects/${item?.Title}`}>
                        Know More
                      </Link>
                    </button>
                    {index % 2 === 0 && (
                      <img
                        alt="project-image"
                        loading="lazy"
                        width="0"
                        // height="239"
                        decoding="async"
                        data-nimg="1"
                        className="w-full rounded-lg aspect-[16/9] object-cover"
                        style={{ color: "transparent" }}
                        src={item?.image}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={index}
                data-index={index}
                className="scroller-item min-w-max px-4 py-2 flex-shrink-0 inline-block"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: index % 2 === 0 ? -50 : 50,
                }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? 50 : -50 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <Image
                  width={400}
                  height={200}
                  src={item?.image}
                  alt={item?.alt || "Service image"}
                  className={`w-80 ${
                    item?.masterTitle === "Our Services"
                      ? "aspect-[16/9]"
                      : "aspect-square  "
                  } object-cover rounded-lg shadow-lg bg-white`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-500">
                    {item?.title || item?.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const HeroContent = () => {
  const [imageStyle, setImageStyle] = useState<number>(0);

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
                <Advertiser data={services} />
              </div>
              {/* ))} */}
            </div>
            <SearchComponent />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroContent;
