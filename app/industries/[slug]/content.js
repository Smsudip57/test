"use client";
import React, { useState, useEffect, useRef } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CaseStudy from "@/components/main/CaseStudy";
import ProjectCarousel from "@/components/main/ProjectCarousel";
import Contact from "@/components/main/Contact";
import BlogSection from "@/components/shaerd/Blog";
import FaqSection from "@/components/shaerd/Faqs";
import KnowledgeBase from "@/components/shaerd/Knowledgebase";
import Showcase from "@/components/shaerd/industryshowcase";
import Projects from "@/components/main/Projects";

// Main Component (Default Export)
export default function FacultyManagement({
  industry,
  services: allServices,
  products,
}) {
  const [services, setServices] = useState();
  useEffect(() => {
    if (
      industry?.relatedChikfdServices &&
      Array.isArray(industry.relatedChikfdServices) &&
      allServices &&
      products
    ) {
      const relatedChildList = industry.relatedChikfdServices.map((item) => {
        if (!item?.category) return item;

        const categoryIds = item.category;
        const targetProductsCat = products?.find(
          (product) => categoryIds?.toString() === product?._id?.toString()
        )?.category;

        if (!targetProductsCat) return item;

        const targetService = allServices?.find(
          (service) =>
            targetProductsCat?.toString() === service?._id?.toString()
        );

        return {
          ...item,
          parentService: targetService,
        };
      });

      // Remove duplicates based on _id
      const uniqueServices = relatedChildList.filter(
        (item, index, self) =>
          index === self.findIndex((s) => s?._id === item?._id)
      );

      setServices(uniqueServices);
    }
  }, [industry, allServices, products]);

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
      </div>{" "}
      {industry?.relatedChikfdServices?.length > 0 &&
        Array.isArray(industry?.relatedChikfdServices) && (
          <div className="w-full  min-h-screen flex justify-center items-center">
            <div className="w-[90%]  mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl lg:text-4xl font-bold text-green-900">
                  Webme Originals: Products tailored for{" "}
                  {industry?.Title || "The Industry"}
                </h2>
              </div>
              <Showcase service={industry?.relatedChikfdServices} />
            </div>
          </div>
        )}
      {industry?.relatedProjects?.length > 0 && (
        <ProjectCarousel
          data={industry?.relatedProjects}
          title="Webme at Work: Impactful projects that matter"
        />
      )}
      {industry?.relatedSuccessStory?.length > 0 && (
        <div className="w-[90%] mx-auto lg:w-full">
          <CaseStudy data={industry?.relatedSuccessStory} />
        </div>
      )}
      {/* Blog Section Component */}
      <div className="mx-auto min-h-screen flex justify-center items-center">
        <BlogSection data={industry?.relatedBlogs} />
      </div>
      <div className="mx-auto min-h-screen flex justify-center items-center">
        <KnowledgeBase data={industry?.relatedKnowledgeBase} />
      </div>
      {/* Contact Section Component */}
      <Contact />
      {/* FAQ Section Component */}
      <FaqSection data={industry?.relatedFaqs} />
    </div>
  );
}
