import React from "react";
import ProjectCard from "../sub/ProjectCard";
import Link from "next/link";

const Projects = () => {
  return (
    <div
      className="flex flex-col items-center justify-center pb-20"
      id="projects"
    >
     <section className="mt-16 sm:mt-[100px] px-4 sm:px-12 lg:px-[136px]">
  <div className="mx-auto mb-10 sm:mb-14 px-4 max-w-2xl text-center">
    {/* <h3 className="text-seagreen-950 mb-4 font-bold text-xl">OUR PROJECTS</h3> */}
    <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6">OUR PROJECTS</h1>
    <p className="text-[#393939] text-base lg:text-xl">Innovative Solutions Brought to Life</p>
  </div>
  <div className="flex flex-col flex-wrap lg:flex-row gap-4 sm:gap-8 justify-center">
    <div className="m-0.5 p-4 sm:p-10 bg-[#FFF8BB] basis-[46%] lg:basis-[47.2%] rounded-xl">
      <h1 className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]">CAFM System for Mountain Gate Property ManagementClient</h1>
      <p className="text-[#0B2B20]  mb-[30px]">We developed a comprehensive CAFM system tailored to the needs of Mountain Gate Property Management. This project involved creating a robust platform to manage property portfolios efficiently, automate maintenance tasks, and streamline operations across multiple properties.

      </p>
      <button className="bg-[#0B2B20]  px-6 py-3 mb-7 rounded-lg text-white"><Link href="/details/projects/project-1">Know More</Link></button>
      <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover" style={{ color: 'transparent' }} src="/p1.jpg" />
    </div>
    <div className="m-0.5 p-4 sm:p-10 bg-[#E5EDFD] basis-[46%] lg:basis-[47.2%] rounded-xl">
      <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover mb-7" style={{ color: 'transparent' }} src="/p2.jpg" />
      <h1 className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]">Microsoft 365 Implementation for Alqodorat General Contracting
      Client</h1>
      <p className="text-[#0B2B20]  mb-[30px]">We successfully implemented Microsoft 365 for Alqodorat General Contracting to enhance their productivity, collaboration, and communication across the organization. This project aimed to provide a modern, integrated cloud-based solution that meets the company’s operational needs and supports its growth.
      </p>
      <button className="bg-[#0B2B20]  px-6 py-3 rounded-lg text-white"><Link href="/details/projects/project-2">Know More</Link></button>
    </div>
    <div className="m-0.5 p-4 sm:p-10 bg-[#FCE5F3] basis-[46%] lg:basis-[47.2%] rounded-xl">
      <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover mb-7" style={{ color: 'transparent' }} src="/p3.jpg" />
      <h1 className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]">Website Development for The Design District
      </h1>
      <p className="text-[#0B2B20]  mb-[30px]">We developed a state-of-the-art website for The Design District, aimed at enhancing their online presence and providing a seamless user experience. The project focused on creating a visually stunning and highly functional website that reflects the brand’s identity and meets the needs of their clients.
      </p>
      <button className="bg-[#0B2B20]  px-6 py-3 rounded-lg text-white"><Link href="/details/projects/project-3">Know More</Link></button>
    </div>
    <div className="m-0.5 p-4 sm:p-10 bg-[#FFE8D7] basis-[46%] lg:basis-[47.2%] rounded-xl">
      <h1 className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]">Transforming Efficiency: AL SAHRA Recruitement Services IT Revolution with WEBME
      </h1>
      <p className="text-[#0B2B20]  mb-[30px]">
AL SAHRA Recruitment Services, a prominent player in the recruitment and staffing industry, needed a robust and scalable IT infrastructure to support their expanding operations. They sought a comprehensive IT consultancy service to enhance their cloud capabilities, improve communication systems, and ensure top-notch security.
</p>
      <button className="bg-[#0B2B20]  px-6 py-3 mb-7 rounded-lg text-white"><Link href="/details/projects/project-4">Know More</Link></button>
      <img alt="project-image" loading="lazy" width="0" height="239" decoding="async" data-nimg="1" className="w-full rounded-lg h-[239px] object-cover" style={{ color: 'transparent' }} src="/p4.jpg" />
    </div>
  </div>
</section>

    </div>
  );
};

export default Projects;
