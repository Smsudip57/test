import Hero from "@/components/main/Hero";
import Projects from "@/components/main/Projects";
import Skills from "@/components/main/Skills";
import CaseStudy from "@/components/main/CaseStudy";
import Webme from "@/components/main/Webme";
import Infinite from "@/components/main/Infinite";
import Pricing from "@/components/main/Pricing";
import Contact from "@/components/main/Contact";
import WebParticles from "@/components/main/webParticles";
import Image from "next/image";

export default function Home() {
  return (
    <main className="h-full ">
      <div className="flex flex-col gap-20 bg-[url('/hero-bg.svg')] bg-no-repeat bg-cover">
        <div className="lg:w-[90%] w-full mx-auto overflow-hidden bg-[url('/hero-bg.svg')] bg-cover max-w-[1920px] ">
          <Hero />
        </div>
      </div>
      <div className="flex flex-col gap-20 lg:w-[90%] w-full  max-w-[1920px] mx-auto overflow-hidden ">
        <div className="bg-[rgba(231,247,246,1)] z-20">
        <Webme />
        </div>
        <CaseStudy />
        <Infinite />
        <div className="z-20 w-full">
        <Projects />
        <Pricing />
        <Contact />
        </div>

        {/* <Skills /> */}
        {/* <Encryption /> */}
        
      </div>
    </main>
  );
}
