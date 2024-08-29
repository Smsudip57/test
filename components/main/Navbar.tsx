"use client"
import { Socials } from "@/constants";
import Image from "next/image";
import React,{useState, useEffect,useRef} from "react";
import AddReactionIcon from '@mui/icons-material/AddReaction';

const Navbar = () => {
  const [scrolled,setscrolled] = useState(false);
  const [animated, setAnimated] = useState('');
  const [completed, setCompleted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const industries = [
    "Automotive",
    "Construction",
    "Faculty Management",
    "General Maintenance",
    "Healthcare and Pharmaceuticals",
    "Retail",
    "Logistics and Transportation",
    "Manufacturing",
    "Agriculture",
    "Interior and Fitout",
    "Real Estate"
  ];
  const slider = useRef(null);

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
    <div className="w-full relative">
    <div className={`w-full h-[65px] fixed top-0 shadow-lg  ${scrolled ? "bg-white shadow-[#8cdcdd]/30":''} backdrop-blur-md z-50`} onMouseLeave={() => {if(animated && completed ) {setAnimated('leftslider2') ; setCompleted(false);setClicked(false)}}}>
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
            <a  className="cursor-pointer hover:opacity-70 hidden 2xl:block" onClick={() => {setAnimated('leftslider1');setTimeout(() => {
              setCompleted(true)
            }, 500);setClicked(true)}}>
            Industries
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
            <a href="/customer-success-stories" className="cursor-pointer hover:opacity-70">
            Customer Success Story
            </a>
            <a href="/#store" className="cursor-pointer hover:opacity-70 hidden xl:block">
            Store
            </a>
          {/* </div> */}
        </div>

        <div className="">
        <button className=" lg:flex bg-[#446E6D] rounded py-3 px-7 font-semibold text-white text-sm ">Connect<span className="invisible">-</span><span className="hidden lg:block"> WEBME</span></button>
        </div>
      </div>
    </div>
    <div className={`w-[30%] min-h-screen fixed z-40 mt-[65px] overflow-hidden bg-white boder-l-[1px] border-[#446E6D] ${animated ?'flex':'hidden'}`} style={{animation:`${animated} 0.5s ease-in-out forwards`  }} onMouseEnter={() => {if(clicked  ){setAnimated('leftslider1');setTimeout(() => {
              setCompleted(true)
            }, 500);}}} onMouseLeave={() => {if(animated && completed ) {setAnimated('leftslider2') ; setCompleted(false);setClicked(false)}}} ref={slider}>
    <div className="w-full h-full pl-[10vw]">
      <h1 className="mt-16 mb-4">
      <strong className="text-[40px] font-bold leading-[52px] font-mono">
      Industries
      </strong>
      </h1>
      {
        industries.map((item,i) => (

      <p className=" text-base text-nowrap font-semibold flex items-center text-[#747474] cursor-pointer hover:text-[#265353] pl-4 rounded-md py-3 hover:bg-[#e7f7f68f] justify-start gap-3 box-border opani" key={i} onClick={()=>{
        window.location.href = `/industries/${item.split(' ').join('-').toLowerCase()}`
        // const url = 
        }}>
      <AddReactionIcon fontSize="inherit"/>{item}
      </p>))
      }
    </div>
    </div>
            </div>
  );
};

export default Navbar;
