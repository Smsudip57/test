'use client';
import axios from "axios";
import React, { useState, useEffect } from "react";


const Projects = ({ parent, child, product, industries: industriesProp }: {
  parent?: string;
  child?: string;
  product?: string;
  industries?: any[];
}) => {
  const [industries, setIndustries] = useState<any[]>([]);


  useEffect(() => {
    // Step 4A: Use prop data if available, otherwise fetch
    if (industriesProp && industriesProp.length > 0) {
      // const response = { data: { industries: industriesProp } };
      //  if (parent || child || product) {
      //           const filteredItems = response.data.industries.filter(
      //             (item: Testimonial) =>
      //               (parent && item.relatedService?._id === parent) ||
      //               (child && item.relatedProduct?._id === child) ||
      //               (product && item.relatedChild?._id === product)
      //           );
      //           setTestimonials(filteredItems);
      //         } else {
      //         }
      setIndustries(industriesProp);
      return;
    }

    const fetchIndustries = async () => {
      try {
        const response = await axios.get('/api/industry/get');
        //  if (parent || child || product) {
        //           const filteredItems = response.data.industries.filter(
        //             (item: Testimonial) =>
        //               (parent && item.relatedService?._id === parent) ||
        //               (child && item.relatedProduct?._id === child) ||
        //               (product && item.relatedChild?._id === product)
        //           );
        //           setTestimonials(filteredItems);
        //         } else {
        //         }
        setIndustries(response.data.industries);;
      } catch (error) {
        console.error('Failed to fetch industries:', error);
      }
    };

    if (!industriesProp) {
      console.log("feching industries from API (slower)");
      fetchIndustries();
    }
  }, [industriesProp]);



  return (
    <div
      className="flex flex-col items-center justify-center pb-20"
    >
      <section className="  px-4 sm:px-12 lg:px-[136px]">
        <div className="mx-auto mb-10 sm:mb-14 px-4 max-w-6xl text-center">
          {/* <h3 className="text-seagreen-950 mb-4 font-bold text-xl"></h3> */}
          <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6">INDUSTRIES</h1>
          <p className="text-base lg:text-xl text-center mb-4 ">Your Industry, Our Expertise: Customized IT Solutions for Every Sector.</p>
        </div>
        <div className="flex flex-col items-center py-0 mx-auto max-w-[1200px]">
          {/* <h1 className="text-2xl font-bold text-center mb-4">
        See how companies drive customer success in a whole new way with Einstein 1.
      </h1> */}
          {/* <button className="border-[#93a5a4] border-2 text-[#446E6D] font-semibold py-2 px-4 rounded mb-16">
        See all customer stories
      </button> */}
          <div className="flex flex-wrap gap-4 justify-center items-center place-items-center">
            {industries.map((item: any, index) => (
              <a href={`/industries/${item?.Title?.toLowerCase().split(" ").join(' ')}`} className="basis-[45%] lg:basis-[14.28%] flex justify-center items-center  shadow-lg border rounded-lg p-4" key={index}>
                <div className="">
                  <img src={item?.logo ? item?.logo : item?.image} alt={`Company logo ${index + 1}`} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Projects;
