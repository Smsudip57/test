"use client";

import React,{useState, useEffect, } from "react";
import EastIcon from '@mui/icons-material/East';
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "@/utils/motion";
import SearchIcon from '@mui/icons-material/Search';
import { MyContext } from "@/context/context";
import Link from "next/link";

const HeroContent = () => {
  const [imageStyle, setImageStyle] = useState<number>(0);
  const data = "Your IT Solutions Galaxy";
  const data2 = "Search for Products, Services you wish to explore";
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [isTypingData1, setIsTypingData1] = useState(true);
  const {setChatBoxOpen} = React.useContext(MyContext);


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



  useEffect(() => {
    const handleTyping = () => {
      // Determine the active string based on which data we're typing
      const activeData = isTypingData1 ? data : data2;
      console.log(activeData);

      if (!deleting) {
        // Typing forward
        if (index < activeData.length) {
          setText((prev) => prev + activeData[index]);
          setIndex((prev) => prev + 1);
        } else {
          // When typing completes, start deleting after a delay
          setTimeout(() => setDeleting(true), 1000);
        }
      } else {
        // Deleting backward
        if (index > 0) {
          setText((prev) => prev.slice(0, -1));
          setIndex((prev) => prev - 1);
        } else {
          // When deletion completes, reset for the next text
          setDeleting(false);
          setIsTypingData1((prev) => !prev);
          setIndex(0); // Reset index to start typing from the beginning of the next text
        }
      }
    };

    const timeoutId = setTimeout(handleTyping, 100);
    return () => clearTimeout(timeoutId);
  }, [index, deleting, isTypingData1]);




  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="px-10 xl:px-20 min-h-screen z-[20] py-28"
    >
      <motion.div
          variants={slideInFromTop}
          className=""
          >
          <div className="bg-slate-300 h-28 w-full rounded-xl overflow-hidden"><img alt="logo" loading="lazy" width="100" height="36" decoding="async" data-nimg="1" className="w-full h-full object-cover" style={{color:"transparent"}} srcSet="/moving-car.gif" src="/moving-car.gif"/></div>
        </motion.div>
      <div className="flex flex-col lg:flex-row items-center justify-center ">
        
      <div className="w-full flex flex-col gap-5 justify-center m-auto text-start ">
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
          >
          <div className="z-99999 gap-7 mt-5 flex flex-col w-full"><p className="font-roboto font-bold leading-[60px] lg:leading-[84px] lg:text-[70px] text-[42px]" style={{fontFamily: "Roboto, sans-serif"}}><a className="bg-gradient-to-r from-[#00FFF3] to-[#FFE500] text-transparent inline-block bg-clip-text" href="/">WEBME,</a><span className="block text-black mt-4 pt-0.5">Your <span className="bg-[#282828] text-[#95E0D9] inline-block px-1.5">Co-Pilot</span> In The IT Journey</span></p></div>
          <div className="mt-6 ml-2">
            <div className=" flex gap-5 w-full">
          <button className='align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-base gap-3 items-center font-normal flex'>
            <Link href="#services">Let&#39;s Start<EastIcon fontSize='inherit'/></Link></button>
          <button className='align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-base gap-3 items-center font-normal flex' onClick={() => setChatBoxOpen(true)}>Book Free Consultancy<EastIcon fontSize='inherit'/></button>
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
        className="w-full h-full flex justify-center items-center"
      >
        {/* <Image
          src="/mainIconsdark.svg"
          alt="work icons"
          height={650}
          width={650}
          /> */}
        <div className="w-full md:w-full relative block ">
  <div className="mt-10">
    <div className="flex justify-center gap-2 sm:gap-5 mb-4">
      <span className="hidden">sudip</span>
      <a href="/modern workplace">
      <img alt="modern-workspacem " loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="roundedfull cursor-pointer moving-item" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px' }} src="/mwp.jpg"/></a>
      {/* <a href="/work-from-anywere"> */}
      {/* /erp.jpeg */}
      <a href="/workfrom anywhere">
      <img alt="erp" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="roundedfull cursor-pointer moving-item-2" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="/workfromi.jpg"/></a>
      {/* <a href="/secure-firewall"> */}
      <a href="/endless support">
      <img alt="network security" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="roundedfull cursor-pointer moving-item-3" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="/supporti.jpg"/></a>
      {/* Network Security.jpeg */}
    </div>
    <div className="flex justify-center gap-2 sm:gap-5 mb-4">
    <a href="/branding">
      <img alt="website" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="roundedfull cursor-pointer moving-item-4" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="/nseo.jpg"/></a>
      <a href="/branding">
      <img alt="seo" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="roundedfull cursor-pointer moving-item-5" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="/Website Development.jpg"/></a>
      <a href="/digital">
      <img alt="network security" loading="lazy" width="149" height="152" decoding="async" data-nimg="1" className="roundedfull cursor-pointer moving-item-3" style={{color:"transparent",width:imageStyle < 640 ? '100px':'149px', height:imageStyle < 640 ? '100px':'140px'}} src="/dimg.jpg"/></a>
    </div>
  </div>
  <div className="rounded-[70px] w-full  mx-auto border-[1.5px] gap-2 xs:gap-4 flex md:gap-5 border-[#0B2B20] p-1 justify-between bg-white border-box">
    <div className="flex gap-2.5 items-center">
      <img alt="search" loading="lazy" width="25" height="25" decoding="async" data-nimg="1" className="sm:ml-2 xs:w-6 xs:h-6 w-5 h-5" style={{color:"transparent"}} src="/search.svg"/>
      <input placeholder={text} className="text-[#101513] text-base xs:text-base leading-7 focus:outline-none"/>
    </div>
    <button className="bg-[#446E6D] font-medium text-white text-lg sm:text-base px-1.5 xs:px-3 md:px-[34px] py-2 md:py-[11.5px] font-graphik rounded-[39px] border-box"><span className="hidden sm:block">webmedigital</span><span className="sm:hidden aspect-square p-2"><SearchIcon fontSize="inherit"/></span></button>
  </div>
</div>

      </motion.div>
          </div>
    </motion.div>
  );
};

export default HeroContent;
