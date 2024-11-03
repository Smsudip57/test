import React from "react";
import HeroContent from "../sub/HeroContent";
import WebParticles from "./webParticles";

const Hero = () => {
  return (
    <div className="relative flex flex-col h-full w-full pt-32 lg:pt-0 lg:mb-48" id="about-me">
      <WebParticles />
      {/* <video
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-[-340px]  h-full w-full left-0 z-[1] object-cover "
      >
        <source src="/blackhole.webm" type="video/webm" />
      </video> */}
      <HeroContent />
    </div>
  );
};

export default Hero;
