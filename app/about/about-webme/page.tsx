import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function page() {
  return (
    <div className="min-h-screen  lg:py-[150px] ">
      <div className="mx-auto mb-20 lg:mb-0 lg:h-[680px] bg-white max-w-[1536px] flex  items-center ">
        <div className=" flex flex-col lg:flex-row gap-6">
          <div className="lg:basis-1/2 z-10 relative">
            <div className="top-0 bg-white p-2 absolute right-0  mr-[60px] z-20">
              <div className="w-full h-[366px] relative">
                <img
                  src="/logo.svg"
                  className="h-[366px] aspect-[12/9] pt-14"
                />
                <div className="bg-white absolute z-30 aspect-[1/1] bottom-[-14%] right-[-7%] px-5 flex flex-col justify-center items-center gap-1 border-b-4 border-[#446E6D]">
                  <span className="text-4xl font-semibold text-[#446E6D]">
                    8+
                  </span>
                  <p className="uppercase font-semibold ">Experience</p>
                </div>
              </div>
            </div>
            <div className="absolute h-[366px] w-1/2 left-0 top-0 bg- z-10 bg-opacity-80"></div>
            <img src="" className="h-[366px] invisible xl:visible" />
            <img src="/07.webp" className="absolute right-0 top-0 pr-[20px]" />
          </div>
          <div className="lg:basis-1/2 z-20 w-[90%] mx-auto lg:w-full">
            <div className="mt-16 lg:mt-10 flex flex-col lg:pr-28">
              <span className="text-[#446E6D] mb-2">About</span>
              <span className="text-5xl mb-7">WEBME</span>
              <div className="text-gray-500">
                <p className="font-bold text-lg mb-2">
                  WEBME: Your Co-Pilot in the IT Journey
                </p>
                <p className="mb-4">
                  With a passion for technology and a commitment to excellence,
                  WEBME is here to guide you through every step of your IT
                  journey, ensuring seamless operations and transformative
                  growth. We believe that technology should be an enabler, not a
                  hindrance, and that&apos;s why we strive to deliver tailor-made IT
                  solutions that align with your unique needs.
                </p>

                <p className="mb-4">
                  WEBME Information Technology is here to guide you through the
                  complex landscape of IT, ensuring that your technology
                  supports your goals and drives success. WEBME, your virtual
                  companion in the digital world and your trusted IT consultancy
                  provider.
                </p>

                <p className="font-bold text-lg mb-2 mt-6">
                  WEBMEDIGITAL: Your IT Solutions Galaxy
                </p>
                <p className="mb-4">
                  Once you connect with WEBME, you&apos;ll have an all-in-one
                  solution WEBMEDIGITAL at your fingertips, eliminating the need
                  to rely on any other service and allowing you to focus
                  entirely on growing. Whether you&apos;re looking to enhance your
                  digital presence, streamline your operations, or ensure robust
                  support, we&apos;ve got you covered.
                </p>

                <p className="mb-2 mt-4">
                  <span className="font-bold">Work From Anywhere:</span> Empower
                  your team with the flexibility to work from anywhere, ensuring
                  productivity and collaboration no matter where they are.
                </p>

                <p className="mb-2">
                  <span className="font-bold">Expertise:</span> Leverage our
                  deep industry knowledge and technical expertise to drive your
                  business forward.
                </p>

                <p className="mb-2">
                  <span className="font-bold">Branding:</span> Strengthen your
                  brand with our innovative IT solutions that enhance your
                  digital footprint and market presence.
                </p>

                <p className="mb-2">
                  <span className="font-bold">Modern Workplace:</span> Transform
                  your workplace with cutting-edge technology that fosters
                  innovation and efficiency.
                </p>

                <p className="mb-2">
                  <span className="font-bold">Endless Support:</span> Enjoy
                  peace of mind with our continuous support, ensuring your IT
                  infrastructure is always running smoothly.
                </p>

                <p className="mb-2">
                  <span className="font-bold">Digital:</span> Embrace the
                  digital age with our comprehensive services that cover all
                  aspects of your IT needs.
                </p>

                <p className="mt-4">
                  Ready to transform your IT journey? Connect with WEBME and
                  become part of a community dedicated to a future of
                  excellence, innovation, and the freedom to focus on what
                  matters most.
                </p>
              </div>
              <button className="bg-[#446E6D] text-white py-2 px-4 flex items-center rounded font-semibold gap-2 cursor-pointer w-max mt-7">
                <span>
                  Contact us <OpenInNewIcon fontSize="inherit" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
