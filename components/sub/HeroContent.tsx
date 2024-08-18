"use client";

import React,{useState, useEffect} from "react";
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/utils/motion";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

const HeroContent = () => {
  const [imageStyle, setImageStyle] = useState<number>(0);

  useEffect(() => {
    // Function to update window width
    const handleResize = () => {
      setImageStyle(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col lg:flex-row items-center justify-center px-10 xl:px-20 min-h-screen z-[20]"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start ">
        <motion.div
          variants={slideInFromTop}
          className=""
        >
          <div className="bg-slate-300 h-28 w-full max-w-[420px] rounded-xl overflow-hidden"><img alt="logo" loading="lazy" width="100" height="36" decoding="async" data-nimg="1" className="w-full h-full object-cover" style={{color:"transparent"}} srcSet="/moving-car.gif" src="/moving-car.gif"/></div>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
        >
          <div className="z-99999 gap-7 mt-5 flex flex-col w-full"><p className="font-roboto font-bold leading-[60px] lg:leading-[84px] lg:text-[70px] text-[42px]" style={{fontFamily: "Roboto, sans-serif"}}><a className="bg-gradient-to-r from-[#00FFF3] to-[#FFE500] text-transparent inline-block bg-clip-text" href="">WEBME,</a><span className="block text-black mt-4 pt-0.5">Your <span className="bg-[#282828] text-[#95E0D9] inline-block px-1.5">Co-Pilot</span> In The IT Journey</span></p></div>
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
        className="w-full h-full flex justify-center items-center"
      >
        {/* <Image
          src="/mainIconsdark.svg"
          alt="work icons"
          height={650}
          width={650}
        /> */}
        <div className="w-full md:w-full relative block py-36">
  <div className="mt-10">
    <div className="flex justify-center gap-2 sm:gap-5 mb-4">
      <a href="modern-workplace">
      <img alt="modern-workspacem " loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="rounded-full cursor-pointer moving-item" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px' }} src="/mwp.jpeg"/></a>
      <a href="work-from-anywere">
      <img alt="erp" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="rounded-full cursor-pointer moving-item-2" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="/erp.jpeg"/></a>
      <a href="secure-firewall">
      <img alt="network security" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="rounded-full cursor-pointer moving-item-3" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="/Network Security.jpeg"/></a>
    </div>
    <div className="flex justify-center gap-5 mb-12">
    <a href="branding">
      <img alt="website" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="rounded-full cursor-pointer moving-item-4" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="SEO.jpeg"/></a>
      <a href="branding">
      <img alt="seo" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="rounded-full cursor-pointer moving-item-5" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="/Website Development.jpeg"/></a>
    </div>
  </div>
  <div className="rounded-[70px] w-full 2xl:w-[60%] mx-auto border-[1.5px] gap-2 xs:gap-4 flex md:gap-5 border-[#0B2B20] p-1 justify-between bg-white border-box">
    <div className="flex gap-2.5 items-center">
      <img alt="search" loading="lazy" width="25" height="25" decoding="async" data-nimg="1" className="sm:ml-2 xs:w-6 xs:h-6 w-5 h-5" style={{color:"transparent"}} src="/search.svg"/>
      <input placeholder="IT Solutions Galaxy" className="text-[#101513] text-xs xs:text-base leading-7 focus:outline-none"/>
    </div>
    <button className="bg-[#446E6D] font-medium text-white text-xs xs:text-base px-1.5 xs:px-3 md:px-[34px] py-2 md:py-[11.5px] font-graphik rounded-[39px] border-box">Webmedigital</button>
  </div>
</div>

      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
