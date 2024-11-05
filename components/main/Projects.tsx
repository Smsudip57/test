import React from "react";
import ProjectCard from "../sub/ProjectCard";

const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center pb-20"
      id="projects"
    >
     <section className="mt-16 sm:mt-[100px] px-4 sm:px-12 lg:px-[136px]">
  <div className="mx-auto mb-10 sm:mb-14 px-4 max-w-2xl text-center">
    {/* <h3 className="text-seagreen-950 mb-4 font-bold text-xl">OUR PROJECTS</h3> */}
    <h1 className="font-lora text-2xl lg:text-2xl lg:text-4xl text-green-900 font-bold mb-6">OUR PROJECTS</h1>
    <p className="text-[#393939] text-base lg:text-xl">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the indusdf standard dummy text.</p>
  </div>
  <div className="flex flex-col flex-wrap lg:flex-row gap-4 sm:gap-8 justify-center">
    <div className="m-0.5 p-4 sm:p-10 bg-[#FFF8BB] basis-[46%] lg:basis-[47.2%] rounded-xl">
      <h1 className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]">Lorem Ipsum is simply dummy text</h1>
      <p className="text-[#0B2B20]  mb-[30px]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dsdsf standard dummy text. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <button className="bg-[#0B2B20]  px-6 py-3 mb-7 rounded-lg text-white">Know More</button>
      <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover" style={{ color: 'transparent' }} src="/pexels-fauxels-3183153.jpg" />
    </div>
    <div className="m-0.5 p-4 sm:p-10 bg-[#E5EDFD] basis-[46%] lg:basis-[47.2%] rounded-xl">
      <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover mb-7" style={{ color: 'transparent' }} src="/pexels-fauxels-3183153.jpg" />
      <h1 className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]">Lorem Ipsum is simply dummy text</h1>
      <p className="text-[#0B2B20]  mb-[30px]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dsdsf standard dummy text. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <button className="bg-[#0B2B20]  px-6 py-3 rounded-lg text-white">Know More</button>
    </div>
    <div className="m-0.5 p-4 sm:p-10 bg-[#FCE5F3] basis-[46%] lg:basis-[47.2%] rounded-xl">
      <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover mb-7" style={{ color: 'transparent' }} src="/pexels-fauxels-3183153.jpg" />
      <h1 className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]">Lorem Ipsum is simply dummy text</h1>
      <p className="text-[#0B2B20]  mb-[30px]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dsdsf standard dummy text. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <button className="bg-[#0B2B20]  px-6 py-3 rounded-lg text-white">Know More</button>
    </div>
    <div className="m-0.5 p-4 sm:p-10 bg-[#FFE8D7] basis-[46%] lg:basis-[47.2%] rounded-xl">
      <h1 className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]">Lorem Ipsum is simply dummy text</h1>
      <p className="text-[#0B2B20]  mb-[30px]">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dsdsf standard dummy text. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <button className="bg-[#0B2B20]  px-6 py-3 mb-7 rounded-lg text-white">Know More</button>
      <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover" style={{ color: 'transparent' }} src="/pexels-fauxels-3183153.jpg" />
    </div>
  </div>
</section>

    </div>
  );
};

export default Projects;
