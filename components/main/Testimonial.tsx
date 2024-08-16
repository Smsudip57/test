"use client";
import React from "react";

const Testimonial = () => {
  return (
    <section
      id="testimonials"
      className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden py-20"
    >
        <div className="w-full h-full py-4 bg-[#66A3A6] sm:px-12 lg:py-20 lg:px-[136px]">
  <div className="pt-5 lg:pt-0">
    <p className="text-[20px] text-white font-graphik font-medium leading-[22px] text-center">TESTIMONIALS</p>
    <p className="font-lora text-[36px] text-white font-bold leading-[44px] text-center lg:mt-[15px]">What our client says about us</p>
    <div className="px-4 mt-5 mb-5 md:mb-0 md:px-0 flex flex-col md:flex-row md:justify-center gap-7 lg:gap-[60px] lg:mt-[66px]">
      <div className="flex justify-center md:min-w-[300px] lg:max-w-[394px] lg:max-h-[355px]">
        <img src="/testimonial.png" width="100%" alt="testimonial" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="font-graphik italic text-[16px] text-white font-medium md:w-[400px] lg:text-[26px] lg:leading-10 lg:w-[640px]">
          “El diseño estratégico aporta la orientación que todo proyecto necesita. Tanto si se trata de una idea embrionaria, una startup, o una gran corporación, el negocio se beneficiará de una innovación no cosmética, sino 100% enfocada hacia el crecimiento”
        </p>
        <p className="font-graphik font-medium text-[#FFF176] text-[12px] mt-2 md:text-[14px] md:mt-3 lg:text-[20px] lg:leading-[26px] lg:mt-[17px]">
          - Shriya Gupta, Found Deliverables Agency
        </p>
      </div>
    </div>
  </div>
</div>

      
    </section>
  );
};

export default Testimonial;
