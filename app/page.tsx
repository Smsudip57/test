// app/page.js (or any file in the 'app' directory where you want this component)

import Hero from "@/components/main/Hero";
import Industies from "@/components/main/Industies";
import Projects from "@/components/main/Projects";
import Skills from "@/components/main/Skills";
import CaseStudy from "@/components/main/CaseStudy";
import Webme from "@/components/main/Webme";
import Infinite from "@/components/main/Infinite";
import Pricing from "@/components/main/Pricing";
import Contact from "@/components/main/Contact";
import WebParticles from "@/components/main/webParticles";
import axios from "axios";

export default async function Home() {
  // Fetch the service data server-side
  const serviceResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/service/getservice`, { 
    cache: 'no-store',  // Disable caching
    next: { revalidate: 0 } // Force revalidation on each request
  });
  const service = { data: await serviceResponse.json() };

  return (
    <main className="h-full ">
      <div className="flex flex-col gap-20 bg-[url('/hero-bg.svg')] bg-no-repeat bg-cover">
        <div className="lg:w-[90%] w-full mx-auto overflow-hidden bg-[url('/hero-bg.svg')] bg-cover max-w-[1920px] ">
          <Hero />
        </div>
      </div>
      <div className="flex flex-col gap-20 w-[95%] lg:w-[90%]   max-w-[1920px] mx-auto overflow-hidden ">
        <div className="bg-[rgba(231,247,246,1)] z-20">
          {/* Pass the service prop to the Webme component */}
          <Webme service={service.data} />
        </div>
        <CaseStudy />
        <div className="z-20 w-full">
          <Industies />
          <Projects />
          <Pricing />
          <Infinite />
          <Contact />
        </div>

        {/* <Skills /> */}
        {/* <Encryption /> */}
      </div>
    </main>
  );
}
