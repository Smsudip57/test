"use client";
import React, { useContext } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CircleUser from "@mui/icons-material/Circle";
import { MyContext } from "@/context/context";
import { useRouter } from "next/navigation";

export default function Page() {
  const context = useContext(MyContext);
  const router = useRouter();

  return (
    <div className="min-h-max py-20 lg:py-[150px]">
      <div className="mx-auto mb-20 lg:mb-0 bg-white max-w-[1536px]  flex-col items-center">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:basis-1/2 z-10 relative">
            <div className="top-0 bg-white p-2 absolute right-0 mr-[60px] z-20">
              <div className="w-full h-[366px] relative">
                <img
                  src="/logo.svg"
                  className="h-[366px] aspect-[12/9] pt-14"
                  alt="WEBME Logo"
                />
              </div>
            </div>
            <div className="absolute h-[366px] w-1/2 left-0 top-0 z-10 bg-opacity-80"></div>
            <img src="" className="h-[366px] invisible xl:visible" alt="" />
            <img
              src="/07.webp"
              className="absolute right-0 top-0 pr-[20px]"
              alt="Background decoration"
            />
          </div>

          <div className="lg:basis-1/2 z-20 w-[90%] mx-auto lg:w-full">
            <div className="mt-16 lg:mt-10 flex flex-col lg:pr-28">
              <span className="text-[#446E6D] mb-2 text-xl">About</span>

              

              <div className="text-gray-700 text-lg">
                {/* Section 1 */}
                <h2 className="font-bold text-2xl lg:text-3xl mb-4 text-[#446E6D]">
                  🚀 WEBME: Your Co-Pilot in the IT Journey
                </h2>
                <p className="mb-5">
                  With a passion for technology and a commitment to excellence,
                  WEBME Information Technology is your strategic partner through
                  every step of your digital transformation journey.
                </p>
                <p className="mb-5">
                  We are here to guide you through the complex landscape of IT.
                  We believe that technology should be an enabler, not a barrier
                  — and that&apos;s why we deliver tailor-made IT solutions that
                  align perfectly with your unique goals. From simplifying
                  operations to driving innovation, WEBME ensures seamless
                  functionality and transformative growth.
                </p>
             
                <p className="mb-8">
                  We&apos;re not just about solving problems. We&apos;re about building
                  futures powered by smart technology and guided expertise.
                </p>

                </div>
                </div>
          </div>
          
        </div>
        <div className="items-center relative z-40 max-w-4xl mx-auto">
            <div className="border-t border-b border-gray-200 my-8 py-1  "></div>

                {/* Section 2 */}
                <h2 className="font-bold text-2xl lg:text-3xl mb-4 text-[#446E6D]">
                  🧠 The WEBMEDIGITAL Concept
                </h2>
                <h3 className="font-semibold text-xl mb-4">
                  From Vision to Value, Powered by a Smart, Scalable,
                  Human-Centric Digital Operating System
                </h3>
                <p className="mb-5">
                  When you connect with WEBME, you unlock the power of
                  WEBMEDIGITAL — your all-in-one digital ecosystem.
                </p>
                <p className="mb-5">Whether you&apos;re aiming to:</p>

                <ul className="list-disc pl-8 mb-6 space-y-2">
                  <li>Build and scale your digital presence</li>
                  <li>
                    Protect your business with robust, integrated security
                  </li>
                  <li>Simplify your operations with smart, scalable systems</li>
                </ul>

                <p className="mb-5">WEBMEDIGITAL has you covered.</p>
                <p className="mb-8">
                  We eliminate the need to juggle multiple service providers —
                  giving you the freedom to focus entirely on growing.
                </p>

                <div className="border-t border-b border-gray-200 my-8 py-1"></div>

                {/* Section 3 */}
                <h2 className="font-bold text-2xl lg:text-3xl mb-6 text-[#446E6D]">
                  Complete IT Services That Evolve With You
                </h2>

                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      🌍 Work From Anywhere
                    </h3>
                    <p>
                      Empower your team to collaborate and stay productive from
                      any location with secure, scalable remote work solutions.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      🎯 Expertise That Moves You Forward
                    </h3>
                    <p>
                      Leverage our deep industry knowledge and technical
                      expertise to confidently overcome your IT challenges.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      🚀 Brand-Driven IT Strategy
                    </h3>
                    <p>
                      Boost your brand&apos;s digital footprint with innovative IT
                      solutions designed to amplify your presence and impact.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      🏢 Modern Workplace Transformation
                    </h3>
                    <p>
                      Upgrade your workplace with cutting-edge tools that
                      promote collaboration, efficiency, and digital agility.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      🔒 Endless Support
                    </h3>
                    <p>
                      Our relationship doesn&apos;t end after deployment. We provide
                      ongoing, proactive support to keep your IT systems running
                      24/7.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      💡 Digital Full-Spectrum Solutions
                    </h3>
                    <p>
                      We make sure that you stay future-ready in a digital-first
                      world.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-8"></div>

                {/* Call to Action */}
                <h2 className="font-bold text-2xl lg:text-3xl mb-4 text-[#446E6D]">
                  🌟 Ready to Transform Your IT Journey?
                </h2>
                <p className="mb-6">
                  Connect with WEBME and become part of a growing community
                  dedicated to excellence, innovation, and the freedom to focus
                  on what matters most.
                </p>
              </div>

              <button className="bg-[#446E6D] text-white flex items-center rounded-md font-semibold gap-2 cursor-pointer w-max mt-8 text-lg hover:bg-[#385b5a] transition-colors justify-center mx-auto">
                {context.user && !context.loading ? (
                   <button
                   className="lg:flex bg-[#446E6D] rounded py-3 px-7 font-semibold text-white text-sm"
                   onClick={() => {
                    if(context?.user?.role === "admin"){
                      router.push("/admin/dashboard");
                    }else{
                      router.push("/customer/dashboard");
                    }
                   }}
                 >
                   Connect<span className="invisible">-</span>
                   <span className="hidden lg:block"> WEBME</span>
                 </button>
                ) : (
                  !context.loading && (
                    <button
                      className="lg:flex bg-[#446E6D] rounded py-3 px-7 font-semibold text-white text-sm"
                      onClick={() => {
                        router.push("/signin");
                      }}
                    >
                      Connect<span className="invisible">-</span>
                      <span className="hidden lg:block"> WEBME</span>
                    </button>
                  )
                )}
              </button>
          </div>
      </div>
  );
}