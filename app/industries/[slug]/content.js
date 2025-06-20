"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CaseStudy from "@/components/main/CaseStudy";
import BlogSection from "@/components/shaerd/Blog";
import FaqSection from "@/components/shaerd/Faqs";
import KnowledgeBase from "@/components/shaerd/Knowledgebase";
import Showcase from "@/components/shaerd/industryshowcase";

const service = [
  {
    Name: "Branding",
    image: "/nextjs.jpg",
    url: "/branding?search=webdev#details",
  },
  {
    Name: "Branding",
    image: "/expt.jpg",
    url: "/branding?search=appdev#details",
  },
  {
    Name: "Workfrom Anywhere",
    image: "/m365.jpg",
    url: "work-from-anywere?search=microsolft365#details",
  },
  {
    Name: "Workfrom Anywhere",
    image: "/micro-t.jpg",
    url: "/work-from-anywere?search=windowsvirtualdesktop#details",
  },
  {
    Name: "Modern Workplace",
    image: "/newerp.jpg",
    url: "/modern-workplace?search=erp#details",
  },
  {
    Name: "Modern Workplace",
    image: "/nnetwork.jpg",
    url: "/modern-workplace?search=networksecurity#details",
  },
  {
    Name: "Digital",
    image: "/cctv.jpg",
    url: "/digital?search=surveillancesystems#details",
  },
  {
    Name: "Digital",
    image: "/iot.jpg",
    url: "/digital?search=iotsystems#details",
  },
  {
    Name: "Endless Support",
    image: "/consult.png",
    url: "/endless-support#details",
  },
  {
    Name: "Endless Support",
    image: "/cs.jpg",
    url: "/endless-support#details",
  },
];

// Main Component (Default Export)
export default function FacultyManagement({ industry }) {
  const [services, setServices] = useState(industry?.relatedService);
  useEffect(() => {
    if (industry?.relatedService) {
      setServices({ services: industry?.relatedService });
    }
  }, [industry]);
  return (
    <div className="w-full h-full pt-[65px] lg:pt-0 relative z-20">
      <div className="w-full lg:w-4/5 mx-auto min-h-screen">
        <div className="w-[90%] lg:w-[80%] xl:w-[1280px] mx-auto pt-8 lg:pt-[65px] flex flex-col lg:flex-row justify-center gap-8 lg:gap-0">
          <div className="basis-1/2 flex flex-col justify-center lg:pr-[10%] z-20 gap-8 order-2 lg:order-1">
            <span className="text-2xl lg:text-4xl ">
              <strong>
                {industry?.Heading ||
                  "Transform Your Facility Management with Our IT Solutions Optimize Operations and Enhance Efficiency"}
              </strong>
            </span>
            <p className="text-base lg:text-lg whitespace-prewrap">
              {industry?.detail ||
                "In the dynamic world of facility management, staying ahead means embracing technology that streamlines operations and enhances efficiency. Our services provide tailored solutions to help facility management companies optimize their processes, reduce costs, and improve service delivery."}
            </p>
            <div className="flex gap-5">
              <button className="bg-[#446E6D] text-white py-2 px-4 flex items-center rounded font-semibold gap-2 cursor-pointer">
                <span>
                  Try for free <OpenInNewIcon fontSize="inherit" />
                </span>
              </button>
              <button className="text-[#446E6D] border-[1px] border-[#446E6D] py-2 px-4 flex items-center rounded font-semibold cursor-pointer gap-2">
                <span>
                  Explore <OpenInNewIcon fontSize="inherit" />
                </span>
              </button>
            </div>
          </div>
          <div className="basis-1/2 px-10 lg:p-28 order-1 lg:order-2">
            <img
              className="w-full rounded overflow-hidden"
              src={industry?.image || "/f-m-t.jpg"}
              alt="Industry"
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-center pt-[65px]">
          <div className="mx-auto text-center w-[90%] lg:w-4/5 xl:w-[1280px] z-20">
            <div className="w-full xl:w-[1000px] mx-auto">
              <span className="text-2xl lg:text-3xl text-[#446E6D]">
                <strong>
                  {industry?.Title || "100+"} Companies Achieve Outstanding
                  Results with WEBME
                </strong>
              </span>
            </div>

            <div className="my-20 grid lg:grid-cols-3 gap-6 lg:gap-9">
              <div className="w-full min-h-[20vh] bg-[url(https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Retail_Salesforce-for-Retail_Statistics-Card_Card-1_Version-1-1.png?w=800)] bg-cover shadow-lg rounded-2xl overflow-hidden p-14 border-2 border-gray-200 text-base grid gap-2">
                <span className="text-7xl">
                  <strong>
                    {industry?.Efficiency || "35"}
                    {"%"}
                  </strong>
                </span>
                <span className="text-2xl">
                  <strong>Increased operational efficiency*</strong>
                </span>
                <span className="mt-5 text-lg">
                  Our IT services streamlined their processes, reducing manual
                  tasks and improving overall efficiency by 35%.
                </span>
              </div>

              <div className="w-full min-h-[20vh] bg-[url(https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Retail_Salesforce-for-Retail_Statistics-Card_Card-1_Version-1-1.png?w=800)] bg-cover shadow-lg rounded-2xl overflow-hidden p-14 border-2 border-gray-200 text-base grid gap-2">
                <span className="text-7xl">
                  <strong>
                    {industry?.costSaving || "20"}
                    {"%"}
                  </strong>
                </span>
                <span className="text-2xl">
                  <strong>Cost Savings*</strong>
                </span>
                <span className="mt-5 text-lg">
                  By implementing our solutions, the company saw a significant
                  reduction in operational costs, saving them 20% annually.
                </span>
              </div>

              <div className="w-full min-h-[20vh] bg-[url(https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Retail_Salesforce-for-Retail_Statistics-Card_Card-1_Version-1-1.png?w=800)] bg-cover shadow-lg rounded-2xl overflow-hidden p-14 border-2 border-gray-200 text-base grid gap-2">
                <span className="text-7xl">
                  <strong>
                    {industry?.customerSatisfaction || "40"}
                    {"%"}
                  </strong>
                </span>
                <span className="text-2xl">
                  <strong>Enhanced Customer Satisfaction*</strong>
                </span>
                <span className="mt-5 text-lg">
                  With improved service delivery and faster response times,
                  customer satisfaction scores increased by 40%.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full  min-h-screen flex justify-center items-center">
        <div className="w-[90%]  mx-auto">
          {industry?.relatedService &&
            Array.isArray(industry?.relatedService) && (
              <Showcase service={industry?.relatedService} />
            )}
        </div>
      </div>
      <div className="w-[90%] mx-auto lg:w-full">
        <CaseStudy industry={industry?._id} />
      </div>

      {/* Blog Section Component */}
      <div className="mx-auto min-h-screen flex justify-center items-center">
        <BlogSection industry={industry?._id} />
      </div>
      <div className="mx-auto min-h-screen flex justify-center items-center">
        <KnowledgeBase industry={industry?._id} />
      </div>

      {/* FAQ Section Component */}
      <FaqSection industry={industry} />
    </div>
  );
}
