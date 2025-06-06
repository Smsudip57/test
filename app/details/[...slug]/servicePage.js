"use client";
import React, { useEffect, useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Head from "next/head";
import axios from "axios";
import CaseStudy from "@/components/main/CaseStudy";
import BlogSection from "@/components/shaerd/Blog";
import FaqSection from "@/components/shaerd/Faqs";
import KnowledgeBase from "@/components/shaerd/Knowledgebase";

export default function Page({ details: Service }) {
  const [f1, setf1] = useState(false);
  const [f2, setf2] = useState(false);
  const [f3, setf3] = useState(false);
  const [f4, setf4] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get("/api/servicedetails/get");
        if (response?.data) {
          // console.log(response?.data?.servicedetails)
          // console.log(Service)
          setdetails(
            response?.data?.servicedetails?.find(
              (item) => item?.relatedServices?._id === Service?._id
            )
          );
        }
      } catch (error) {}
    };
    fetchdata();
  }, []);

  return (
    <div className="min-h-screen min-w-screen text-center relative font-sans">
      <title>
        {Service?.Title
          ? `Webmedigital - ${Service?.Title}`
          : "Webmedigital - Projects"}
      </title>
      <Head>
        <meta
          name="description"
          content={
            Service?.description ||
            "Explore this amazing details?.Service with a detailed showcase."
          }
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content={Service?.Title || "Project Showcase"}
        />
        <meta
          property="og:description"
          content={
            Service?.moreDetail ||
            "Explore this amazing details?.Service with a detailed showcase."
          }
        />
        <meta
          property="og:image"
          content={Service?.image || "/default-image.jpg"}
        />
        {/* <meta property="og:url" content={window.location.href} /> */}
      </Head>

      <header className="flex min-h-screen">
        <section className="basis-1/2 min-h-full pt-16 flex flex-col justify-center items-start text-start px-[10%] gap-10">
          <h1 className="text-6xl lg:text-4xl font-semibold text-[#446E6D]">
            {Service?.Title}
          </h1>
          <p className="text-xl font-sans">{Service?.moreDetail}</p>
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
            <img src={Service?.image} alt="Service overview" />
          </div>
        </section>
      </header>

      {Service?.sections?.map((item, index) => (
        <section key={index} className={`${index % 2 === 0 ? "my-24" : ""}`}>
          <div className="w-4/5 mx-auto flex justify-between gap-[15%]">
            <div
              className={`basis-1/2 w-full h-full pt-[10%] ${
                index % 2 === 0 ? "order-1" : "order-2"
              }`}
            >
              <img src={item?.image} alt={item?.title} className="w-full" />
            </div>
            <div
              className={`basis-1/2 h-full pt-16 items-start text-start ${
                index % 2 === 0 ? "order-2" : "order-1"
              }`}
            >
              <h2 className="text-5xl lg:text-3xl font-semibold text-[#446E6D]">
                {item?.title}
              </h2>
              <PointComp points={item?.points} />
            </div>
          </div>
        </section>
      ))}

      <div className="w-[90%] mx-auto lg:w-full">
        <CaseStudy />
      </div>

      <div className="mx-auto min-h-screen flex justify-center items-center">
        <KnowledgeBase child={Service?._id} product={Service?._id} />
      </div>

      {/* FAQ Section Component */}
      <FaqSection child={Service} product={Service?._id} />
    </div>
  );
}

const PointComp = ({ points }) => {
  const [open, setopen] = useState(0);

  return (
    <div className="text-xl font-sans mt-12 border-l-2 border-[#446E6D] flex flex-col gap-8">
      {points.map((item, index) => (
        <div
          key={index}
          className={`w-full border-l-4 pl-6 cursor-pointer ${
            open === index ? "border-l-[#446E6D]" : "border-l-white"
          }`}
          onClick={() => setopen(index)}
        >
          <h3 className="text-2xl font-semibold text-[#446E6D]">
            {item?.title}
          </h3>
          <p
            className={`text-lg font-sans mt-4 text-stone-700 ${
              open === index ? "block" : "hidden"
            }`}
          >
            {item?.detail}
          </p>
        </div>
      ))}
    </div>
  );
};
