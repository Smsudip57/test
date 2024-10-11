import React from "react";
const industries = [
  "Automotive",
  "Construction",
  "Facility Management",
  "Legal & Administrative",
  "Mechanical & Engineering",
  "Healthcare and Pharmaceuticals",
  "Retail",
  "Logistics and Transportation",
  "Manufacturing",
  "Food & Agriculture",
  "Interior and Fitout",
  "Real Estate"
]


const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center pb-20"
      id="projects"
    >
     <section className="  px-4 sm:px-12 lg:px-[136px]">
  <div className="mx-auto mb-10 sm:mb-14 px-4 max-w-6xl text-center">
    {/* <h3 className="text-seagreen-950 mb-4 font-bold text-xl"></h3> */}
    {/* <h1 className="font-lora text-4xl  font-bold mb-6">INDUSTRIES</h1> */}
    <p className="text-4xl font-bold text-center mb-4 text-green-900">Your Industry, Our Expertise: Customized IT Solutions for Every Sector.</p>
  </div>
  <div className="flex flex-col items-center py-0 mx-auto max-w-[1200px]">
      {/* <h1 className="text-2xl font-bold text-center mb-4">
        See how companies drive customer success in a whole new way with Einstein 1.
      </h1> */}
      <button className="border-[#93a5a4] border-2 text-[#446E6D] font-semibold py-2 px-4 rounded mb-16">
        See all customer stories
      </button>
      <div className="flex flex-wrap gap-4 justify-center items-center place-items-center">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="basis-1/6 flex justify-center items-center  shadow-lg border rounded-lg p-8">
            <img src="https://wp.sfdcdigital.com/en-eu/wp-content/uploads/sites/11/2023/08/Swissbit-logo.png?resize=300,85" alt={`Company logo ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
</section>

    </div>
  );
};

export default Projects;
