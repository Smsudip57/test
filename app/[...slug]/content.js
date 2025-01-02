"use client";
import React, { useState, useEffect } from "react";
import StarsCanvas from "@/components/main/StarBackground";
import { useSearchParams } from "next/navigation";
import EastIcon from "@mui/icons-material/East";
import Projects from "@/components/main/Projects";
import Industies from "@/components/main/Industies";
import CaseStudy from "@/components/main/CaseStudy";
import Link from "next/link";
import Head from "next/head"; // Import Head for SEO

export default function Firewall({ services, products, slug, Mainservice }) {
  const [main, setmain] = useState(0);
  const [others, setothers] = useState([]);
  const [servicebasedProducts, setservicebasedProducts] = useState([]);

  useEffect(() => {
    const val = window.location.href.split("?")?.[1];
    const search = val ? val.split("=")?.[1]?.toLowerCase() : "";
    const index = services?.findIndex((item) =>
      decodeURIComponent(search).includes(item?.Title?.toLowerCase())
    );
    setmain(index !== -1 ? index : 0);
  }, [services]);

  useEffect(() => {
    const selectedService = services?.[main];
    if (selectedService) {
      setservicebasedProducts(
        products?.filter((product) => product?.category === selectedService?._id)
      );
    }
  }, [main, services, products]);

  return (
    <div className="w-full relative">
      <Head>
        <title>{Mainservice?.title} - Our Services</title>
        <meta
          name="description"
          content={Mainservice?.description || "Discover our services and products."}
        />
        <meta name="robots" content="index, follow" />
        
      </Head>

      <div className="min-h-[650px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni z-[-10]"></div>
      <div className="min-h-screen w-full absolute">
        <StarsCanvas />
      </div>
      <div className="w-full relative">
      <div className="min-h-full w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni z-[-10]"></div>
      <div className="w-full lg:w-[90%] max-w-[1920px] mx-auto">
        <div className="w-full h-full py-[19vh]">
          <div className="w-[90%] xl:w-[1280px] mx-auto flex flex-col xl:flex-row">
            <div className="xl:w-[50%] flex flex-col justify-around gap-10 z-30 order-2 xl:order-1">
              <h1 className="text-2xl xl:text-[36px] font-bold xl:leading-[45px] font-sans">
                {Mainservice?.title}
              </h1>
              <p className="pr-10 font-medium whitespace-pre-wrap">
                {Mainservice?.description}
              </p>
              <div className="flex gap-6">
                <button className="align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded hover:opacity-70 text-sm">
                  Book Free Consultation
                </button>
                <button className="align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base">
                  <span className="mr-1">Explore</span>
                  <EastIcon fontSize="inherit" />
                </button>
              </div>
            </div>

            <div className="xl:w-[50%] flex justify-center items-center z-30 order-1 xl:order-2">
              <div className="flex justify-center mb-12 xl:flex-wrap items-center">
                {services?.map((product, index) => (
                  <div
                    className="text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md text-3xl"
                    key={index}
                    onClick={() => {
                      setmain(index);
                    }}
                  >
                    <a
                      href="#details"
                      className="cursor-pointer hover:mix-blend-plus-darker"
                    >
                      <img
                        src={product?.image}
                        alt={`Image of ${product?.Title}`} 
                        className="w-full hover:opacity-70"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
          </div>
          </div>
          <div className="min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto">
        <div className="w-full h-full">

          <div
            className="w-[90%] xl:w-[1280px] mx-auto flex flex-col xl:flex-row pt-16 gap-6"
            id="details"
          >
            <div className="flex flex-col basis-1/3 justify-between items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]">
              <div className="flex flex-col justify-center items-start gap-10">
                <img
                  src={services?.[main]?.image}
                  alt={`Image of ${services?.[main]?.Title}`} 
                  className="w-full rounded-md"
                />
                <h2 className="text-2xl font-semibold font-sans">
                  {services?.[main]?.Title}
                </h2>
                <div className="w-full flex flex-col gap-4 pr-3 whitespace-pre-wrap">
                  {services?.[main]?.deltail}
                </div>
              </div>

              <div className="flex justify-center gap-6 my-16">
                <button className="text-sm hover:opacity-70 bg-[#446E6D] text-white rounded py-2 px-4">
                  Get it today!
                </button>
                <button className="align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base">
                  <Link href={`/details/products/${services?.[main]?.Title}`}>
                    <span className="mr-1">Discover</span>
                    <EastIcon fontSize="inherit" />
                  </Link>
                </button>
              </div>
            </div>

            {servicebasedProducts?.map((item, index) => (
              <div
                className="flex flex-col basis-1/3 justify-between items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]"
                key={index}
              >
                <div className="flex flex-col justify-center items-start gap-10">
                  <img
                    src={item?.image}
                    alt={`Image of ${item?.Title}`}
                    className="w-full rounded-md"
                  />
                  <h2 className="text-2xl font-semibold font-sans">
                    {item?.Title}
                  </h2>
                  <div className="w-full flex flex-col gap-4 pr-3 whitespace-pre-wrap">
                    {item?.detail}
                  </div>
                </div>

                <div className="flex justify-center gap-6 my-16">
                  <button className="text-sm hover:opacity-70 bg-[#446E6D] text-white rounded py-2 px-4">
                    Get it today!
                  </button>
                  <button className="align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base">
                    <Link href={`/details/products/${services?.[main]?.Title}`}>
                      <span className="mr-1">Discover</span>
                      <EastIcon fontSize="inherit" />
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Projects />
          <Industies />
          <div className="w-[90%] xl:w-full mx-auto">
            <CaseStudy />
          </div>
        </div>
      </div>
    </div>
  );
}
