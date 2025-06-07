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

      <div className="mt-24 w-4/5 mx-auto flex gap-5">
        <div className="basis-1/2">
          <div className="mt-16 w-full relative overflow-hidden rounded-2xl shadow-md border-2 border-gray-200">
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
            <div className="w-full flex flex-col h-max items-start">
              <div className="basis-1/2 min-h-full w-full pt-16 px-28 lg:px-44">
                <img
                  src="/logo_mountain_gate.png"
                  className="w-full active:border-[5px] active:border-blue-500 rounded-full overflow-hidden"
                  alt="Mountain Gate logo"
                />
              </div>
              <div className="basis-1/2">
                <div className="px-10 pb-16 lg:py-16 lg:pr-24 text-left">
                  <div className="h-[16px] lg:h-[32px] mb-5">
                    <img
                      src="https://a.sfdcstatic.com/shared/images/pbc/icons/quotation-english.svg"
                      alt="quote"
                      className="h-full"
                    />
                  </div>
                  <span className="text-xl lg:text-3xl">
                    <strong>
                      The Odoo Application has transformed the way we manage
                      maintenance tasks. The automation has not only saved us
                      time but also improved the accuracy and efficiency of our
                      operations.
                    </strong>
                  </span>
                  <br></br>
                  <br></br>
                  <span className="text-xl">
                    <strong>Abhilash Dass</strong>
                  </span>
                  <p className="mt-2 text-lg lg:text-xl font-extralight">
                    Admin Manager, Mountain Gate Property Management
                  </p>
                  <button className="mt-10 text-[#446E6D] border-[1px] border-[#446E6D] py-2 lg:py-3 lg:px-8 px-4 flex items-center rounded font-semibold cursor-pointer gap-2 text-sm lg:text-base">
                    <span>
                      Read the story <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-1/2 h-full">
          <div className="mt-16 w-full h-full flex flex-col relative overflow-hidden rounded-2xl shadow-md border-2 border-gray-200">
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
            <div className="w-full flex flex-col items-center">
              <div className="basis-1/2 h-full w-full pt-16 px-28 lg:px-40">
                <img
                  src="/green-logo.png"
                  className="w-full active:border-[5px] active:border-blue-500 rounded-lg overflow-hidden"
                  alt="Green logo"
                />
              </div>
              <div className="basis-1/2">
                <div className="px-10 pb-16 lg:py-16 lg:pr-24 text-left">
                  <div className="h-[16px] lg:h-[32px] mb-5">
                    <img
                      src="https://a.sfdcstatic.com/shared/images/pbc/icons/quotation-english.svg"
                      alt="quote"
                      className="h-full"
                    />
                  </div>
                  <span className="text-xl lg:text-3xl">
                    <strong>
                      The implementation of Microsoft 365, our new website, and
                      Odoo ERP has transformed our operations. We now have a
                      unified system that enhances our productivity and customer
                      service. The support and expertise provided throughout the
                      process were exceptional.
                    </strong>
                  </span>
                  <br></br>
                  <br></br>
                  <span className="text-xl">
                    <strong>Rajesh Kumar</strong>
                  </span>
                  <p className="mt-2 text-lg lg:text-xl font-extralight">
                    Managing Director, GREENTECH GENERAL MAINT
                  </p>
                  <button className="mt-10 text-[#446E6D] border-[1px] border-[#446E6D] py-2 lg:py-3 lg:px-8 px-4 flex items-center rounded font-semibold cursor-pointer gap-2 text-sm lg:text-base">
                    <span>
                      Read the story <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full bg-bottom">
        <div className="flex flex-col justify-center lgmt-0 my-[65px] w-[90%] mx-auto lg:w-full pt-28">
          <div className="mx-auto text-center w-full lg:w-[1000px] z-20">
            <span className="text-2xl lg:text-4xl text-[#446E6D]">
              <strong>
                Stay on top of the newest trend, insights and discussions in the
                Facility Management sector.
              </strong>
            </span>
          </div>
          <div className="w-full xl:w-[1280px] mx-auto my-16 z-20">
            <div className="grid lg:grid-cols-4 gap-6 lg:gap-10">
              <div className="bg-white overflow-hidden rounded-xl shadow-xl flex flex-col">
                <img
                  src="https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Trends-in-Automotive.png?resize=1024,576"
                  className="w-full"
                  alt="Trends in Automotive"
                />
                <div className="p-8 h-full relative">
                  <p className="text-sm bg-[#6a949221] px-3 py-1 rounded-full w-max">
                    Report
                  </p>
                  <p className="text-xl mt-4 mb-8">
                    <strong>Trends in Automotive</strong>
                  </p>
                  <button className="absolute bottom-0 mb-8 mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointer">
                    <span className="font-bold">
                      Get the report <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white overflow-hidden rounded-xl shadow-xl flex flex-col">
                <img
                  src="https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/New-Automotive-Innovations-for-Connected-Vehicles-Captive-Finance.png?resize=1024,576"
                  className="w-full"
                  alt="Automotive Innovations"
                />
                <div className="p-8 h-full relative">
                  <p className="text-sm bg-[#6a949221] px-3 py-1 rounded-full w-max">
                    Webinar
                  </p>
                  <p className="text-xl mt-4 mb-16">
                    <strong>
                      New Automotive Innovations for Connected Vehicles and
                      Captive Finance
                    </strong>
                  </p>
                  <button className="absolute bottom-0 mb-8 mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointer">
                    <span className="font-bold">
                      Watch now <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white overflow-hidden rounded-xl shadow-xl flex flex-col">
                <img
                  src="https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Smarter-Savings-for-Automotive.png?resize=1024,576"
                  className="w-full"
                  alt="Smarter Savings"
                />
                <div className="p-8 h-full relative">
                  <p className="text-sm bg-[#6a949221] px-3 py-1 rounded-full w-max">
                    Guide
                  </p>
                  <p className="text-xl mt-4 mb-8">
                    <strong>Smarter Savings for Automotive</strong>
                  </p>
                  <button className="absolute bottom-0 mb-8 mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointer">
                    <span className="font-bold">
                      Get the guide <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white overflow-hidden rounded-xl shadow-xl flex flex-col">
                <img
                  src="https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Connected-Car-Disconnect_-65-of-U.S.-Drivers-Dont-Understand-1.png?resize=1024,576"
                  className="w-full"
                  alt="Connected Car"
                />
                <div className="p-8 h-full relative">
                  <p className="text-sm bg-[#6a949221] px-3 py-1 rounded-full w-max">
                    News
                  </p>
                  <p className="text-xl mt-4 mb-8">
                    <strong>
                      65% of U.S. Drivers Don&apos;t Understand Connected Cars
                    </strong>
                  </p>
                  <button className="absolute bottom-0 mb-8 mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointer">
                    <span className="font-bold">
                      Read the story <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button className="text-[#446E6D] w-max mx-auto border-[1px] border-[#446E6D] py-3 px-6 flex items-center rounded font-semibold cursor-pointer gap-2">
            <span>
              Read all resources <OpenInNewIcon fontSize="inherit" />
            </span>
          </button>
        </div>
      </div>

      <div className="relative bg-no-repeat bg-cover w-[90%] mx-auto xl:w-full bg-bottom">
        <div className="absolute top-0 left-0 w-full h-full hidden xl:block">
          <img
            src="https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/03/logo-grid-background-min.jpg?w=1024"
            className="w-full h-full"
            alt="Background"
          />
        </div>
        <div className="flex flex-col justify-center mt-[110px]">
          <div className="mx-auto text-center w-full lg:w-[1000px] z-20">
            <span className="text-2xl lg:text-4xl text-[#446E6D]">
              <strong>Begin your journey with us today!</strong>
            </span>
            <p className="text-base lg:text-lg mt-8">
              Get out-of-the-box automotive features and workflows that make it
              easy to explore new revenue opportunities, advance next-generation
              vehicle experiences, and innovate with AI and automation – all
              powered by the #1 automotive CRM.
            </p>
          </div>
          <div className="w-full xl:w-[1280px] mx-auto my-12 z-20">
            <div className="grid xl:grid-cols-3 gap-10 xl:mx-28">
              <div className="bg-white overflow-hidden rounded-xl shadow-xl flex flex-col">
                <div className="p-8 h-full relative">
                  <img
                    src="https://www.salesforce.com/content/dam/web/global/svg-icons/screen.svg"
                    className="text-sm bg-[#6a949221] p-3 rounded-full w-max"
                    alt="Screen icon"
                  />
                  <p className="text-xl mt-7">
                    <strong>Start your trial.</strong>
                  </p>
                  <p className="mt-3 mb-14">
                    Try Automotive Cloud free for 30 days. No credit card. No
                    installations.
                  </p>
                  <button className="absolute bottom-0 mb-8 mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointer">
                    <span className="font-bold">
                      Try for free <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>
              <div className="bg-white overflow-hidden rounded-xl shadow-xl flex flex-col">
                <div className="p-8 h-full relative">
                  <img
                    src="https://www.salesforce.com/content/dam/web/global/svg-icons/call.svg"
                    className="text-sm bg-[#6a949221] p-3 rounded-full w-max"
                    alt="Call icon"
                  />
                  <p className="text-xl mt-7">
                    <strong>Talk to an expert.</strong>
                  </p>
                  <p className="mt-3 mb-14">
                    Tell us a bit so the right person can reach out faster.
                  </p>
                  <button className="absolute bottom-0 mb-8 mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointer">
                    <span className="font-bold">
                      Request a call <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>
              <div className="bg-white overflow-hidden rounded-xl shadow-xl flex flex-col">
                <div className="p-8 h-full relative">
                  <img
                    src="https://a.sfdcstatic.com/shared/images/pbc/play.svg"
                    className="text-sm bg-[#6a949221] p-3 rounded-full w-max"
                    alt="Play icon"
                  />
                  <p className="text-xl mt-7">
                    <strong>Watch a demo.</strong>
                  </p>
                  <p className="mt-3 mb-14">
                    Get the latest research, industry insights, and product news
                    delivered straight to your inbox.
                  </p>
                  <button className="absolute bottom-0 mb-8 mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointer">
                    <span className="font-bold">
                      See demo <OpenInNewIcon fontSize="inherit" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-no-repeat bg-cover w-full bg-bottom">
        <div className="flex flex-col justify-center mt-[110px]">
          <div className="mx-auto text-center w-[90%] lg:w-[1000px] z-20">
            <span className="text-2xl lg:text-4xl">
              <strong>WEBME CRM for Automotive FAQ</strong>
            </span>
          </div>
          <div className="w-[90%] lg:w-[1000px] mx-auto mt-12 mb-52 z-20">
            <div className="flex flex-col gap-10 lg:mx-24">
              <div
                className={`w-full border-b-2 border-[#446e6d44]`}
                onClick={() => setf1((prev) => !prev)}
              >
                <button className="text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6">
                  <strong className="bg-white flex w-full text-left">
                    What is a CRM for the automotive industry?
                  </strong>
                  <span className="text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]">
                    {!f1 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.54"
                        height="13.54"
                        fill="none"
                        aria-hidden="true"
                        className="fill-black accordion__icon accordion__icon--plus"
                        viewBox="0 0 22 22"
                      >
                        <path
                          d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z"
                          className="icon__plus"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14.77"
                        height="14.77"
                        fill="none"
                        aria-hidden="true"
                        className="fill-black accordion__icon accordion__icon--minus"
                        viewBox="0 0 24 3"
                      >
                        <path
                          d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z"
                          className="icon__minus"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </span>
                </button>
                <p className={`${f1 ? "block" : "hidden"} mb-6`}>
                  Customer relationship management for the automotive industry
                  is a system for managing all of your company&apos;s
                  interactions with current and potential customers, as well as
                  critical information like driver, vehicle, retail, and
                  automotive financial data.
                </p>
              </div>
              <div
                className={`w-full border-b-2 border-[#446e6d44]`}
                onClick={() => setf2((prev) => !prev)}
              >
                <button className="text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6">
                  <strong className="bg-white flex w-full text-left">
                    How do I choose the best automotive CRM for my business?
                  </strong>
                  <span className="text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]">
                    {!f2 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.54"
                        height="13.54"
                        fill="none"
                        aria-hidden="true"
                        className="fill-black accordion__icon accordion__icon--plus"
                        viewBox="0 0 22 22"
                      >
                        <path
                          d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z"
                          className="icon__plus"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14.77"
                        height="14.77"
                        fill="none"
                        aria-hidden="true"
                        className="fill-black accordion__icon accordion__icon--minus"
                        viewBox="0 0 24 3"
                      >
                        <path
                          d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z"
                          className="icon__minus"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </span>
                </button>
                <p className={`${f2 ? "block" : "hidden"} mb-6`}>
                  First, determine what you want an automotive CRM to solve. An
                  automotive CRM should include functionality, such as vehicle
                  and driver information, automotive lead management, partner
                  performance management, inventory management, fleet
                  management, embedded analytics and AI, and more.
                </p>
              </div>
              <div
                className={`w-full border-b-2 border-[#446e6d44]`}
                onClick={() => setf3((prev) => !prev)}
              >
                <button className="text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6">
                  <strong className="bg-white flex w-full text-left">
                    What are the benefits of using a CRM for automotive?
                  </strong>
                  <span className="text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]">
                    {!f3 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.54"
                        height="13.54"
                        fill="none"
                        aria-hidden="true"
                        className="fill-black accordion__icon accordion__icon--plus"
                        viewBox="0 0 22 22"
                      >
                        <path
                          d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z"
                          className="icon__plus"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14.77"
                        height="14.77"
                        fill="none"
                        aria-hidden="true"
                        className="fill-black accordion__icon accordion__icon--minus"
                        viewBox="0 0 24 3"
                      >
                        <path
                          d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z"
                          className="icon__minus"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </span>
                </button>
                <p className={`${f3 ? "block" : "hidden"} mb-6`}>
                  An automotive CRM can help you get 360-degree visibility into
                  your customers and their households and vehicles, build a
                  robust sales pipeline, intelligently manage your vehicle and
                  parts product portfolio, and deliver meaningful service
                  experiences for drivers and households.
                </p>
              </div>
              <div
                className={`w-full border-b-2 border-[#446e6d44]`}
                onClick={() => setf4((prev) => !prev)}
              >
                <button className="text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6">
                  <strong className="bg-white flex w-full text-left">
                    Does my business need an automotive CRM?
                  </strong>
                  <span className="text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]">
                    {!f4 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13.54"
                        height="13.54"
                        fill="none"
                        aria-hidden="true"
                        className="fill-black accordion__icon accordion__icon--plus"
                        viewBox="0 0 22 22"
                      >
                        <path
                          d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z"
                          className="icon__plus"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14.77"
                        height="14.77"
                        fill="none"
                        aria-hidden="true"
                        className="fill-black accordion__icon accordion__icon--minus"
                        viewBox="0 0 24 3"
                      >
                        <path
                          d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z"
                          className="icon__minus"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </span>
                </button>
                <p className={`${f4 ? "block" : "hidden"} mb-6`}>
                  Consider an automotive CRM if you find that your
                  customer-facing interactions are misguided, that you&apos;re
                  missing upsell opportunities, or if you want to better serve
                  drivers and their households. An automotive CRM like
                  Automotive Cloud helps teams take action fast and delight
                  every customer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
