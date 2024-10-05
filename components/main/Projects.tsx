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
  <div className="mx-auto mb-10 sm:mb-14 px-4 max-w-2xl text-center">
    <h3 className="text-seagreen-950 mb-4 font-bold text-xl">INDUSTRIES</h3>
    <h1 className="font-lora text-4xl text-green-900 font-bold mb-6">YOUR INDUSTRY</h1>
    <p className="text-[#393939] text-xl">Our Expertise: Customized IT Solutions for Every Sector.</p>
  </div>
  <div className="flex flex-col flex-wrap lg:flex-row gap-4 sm:gap-8 justify-center">
    {
      industries.map((industry, index) => (
        <div className={`m-0.5 p-4 sm:p-10 ${((index%3 === 0&&index!==6&&index !==9)||index === 4||index === 7||index === 8||index === 11) ?"bg-[#FFF8BB]":"bg-[#E5EDFD]"} basis-[46%] lg:basis-[47.2%] rounded-xl`} key={index}>
          {index%2 !== 0 &&  <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="mb-[24px] w-full rounded-lg h-[239px] object-cover" style={{ color: 'transparent' }} src="/pexels-fauxels-3183153.jpg" />}
      <h1 className="font-bold text-4xl text-[#0B2B20]  font-lora mb-[22px]">{industry}</h1>
      <p className="text-[#0B2B20]  mb-[30px]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dsdsf standard dummy text. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <button className="bg-[#0B2B20]  px-6 py-3 mb-7 rounded-lg text-white">Try it now</button>
      {index%2 === 0 &&  <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover" style={{ color: 'transparent' }} src="/pexels-fauxels-3183153.jpg" />}
    </div>
      ))
    }
  </div>
</section>

    </div>
  );
};

export default Projects;
