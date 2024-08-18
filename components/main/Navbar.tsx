"use client"
import { Socials } from "@/constants";
import Image from "next/image";
import React,{useState, useEffect} from "react";

const Navbar = () => {
  const [scrolled,setscrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY>65){
        setscrolled(true)
        console.log(true)
      }else{
        setscrolled(false)
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 


  
  return (
    <div className={`w-full h-[65px] fixed top-0 shadow-lg  ${scrolled ? "bg-white shadow-[#8cdcdd]/30":''} backdrop-blur-md z-50`}>
      <div className="md:w-[90%] lg:w-[80%] h-full flex flex-row items-center justify-between m-auto">
        <a
          href="/#about-me"
          className="h-auto w-auto flex flex-row items-center"
        >
          <Image
            src="/logo.svg"
            alt="logo"
            width={17}
            height={17}
            className="cursor-pointer hover:animate-slowspin"
          />

          <span className="font-bold ml-[10px] hidden md:block text-[#4E6D6D]">
            WEBME
          </span>
        </a>

        <div className="h-full flex items-center justify-between gap-10 uppercase ">
          {/* <div className="flex items-center justify-between w-full h-auto mr-[15px] px-[20px] py-[10px] rounded-full text-black"> */}
            <a href="/#about-me" className="cursor-pointer hover:opacity-70 hidden 2xl:block">
              ABOUT
            </a>
            <a href="/#services" className="cursor-pointer hover:opacity-70">
              Services
            </a>
            <a href="/#testimonials" className="cursor-pointer hover:opacity-70">
            Testimonials
            </a>
            <a href="/#pricing" className="cursor-pointer hover:opacity-70">
            Pricing
            </a>
            <a href="/#industries" className="cursor-pointer hover:opacity-70 hidden 2xl:block">
            Industries
            </a>
            <a href="/#case-study" className="cursor-pointer hover:opacity-70">
            Case study
            </a>
            <a href="/#store" className="cursor-pointer hover:opacity-70 hidden xl:block">
            Store
            </a>
          {/* </div> */}
        </div>

        <div className="">
        <button className=" lg:flex bg-[#446E6D] rounded-md py-3 px-7 font-semibold text-white text-sm ">Connect<span className="invisible">-</span><span className="hidden lg:block"> WEBME</span></button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
