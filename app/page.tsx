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
import { fetchAllHomePageData } from "@/lib/ssr-fetch";

export default async function Home() {
  const pageData: any = await fetchAllHomePageData();

  return (
    <main className="h-full ">
      <div className="flex flex-col gap-20 bg-[url('/hero-bg.svg')] bg-no-repeat bg-cover relative z-20">
        <div className="lg:w-[90%] w-full mx-auto bg-[url('/hero-bg.svg')] bg-cover max-w-[1920px] ">
          <Hero pageData={pageData} />
        </div>
      </div>
      <div className="flex flex-col gap-20 w-[95%] lg:w-[90%]   max-w-[1920px] mx-auto overflow-hidden ">
        <div className="bg-[rgba(231,247,246,1)] z-10">
          {/* Pass the service prop to the Webme component */}
          <Webme service={pageData} />
        </div>
        <CaseStudy />
        <div className="z-20 w-full">
          <Industies industries={pageData.industries} />
          <Projects projects={pageData.projects} />
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
