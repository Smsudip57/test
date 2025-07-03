"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Webme = ({ service: apiservice }: any) => {
  const [active, setActive] = useState("");

  useEffect(() => {
    console.log(apiservice);
  }, [apiservice]);

  // List of services
  // const services = [
  //   { key: "b", img: "/nextjs.jpg", link: "/branding?search=webdev#details" },
  //   { key: "w", img: "/m365.jpg", link: "/workfrom anywhere?search=microsolft365#details" },
  //   { key: "en", img: "/consult.png", link: "/endless support#details" },
  //   { key: "m", img: "/nnetwork.jpg", link: "/modern workplace?search=networksecurity#details" },
  //   { key: "m", img: "/newerp.jpg", link: "/modern workplace?search=erp#details" },
  //   { key: "b", img: "/expt.jpg", link: "/branding?search=appdev#details" },
  //   { key: "d", img: "/cctv.jpg", link: "/digital?search=surveillancesystems#details" },
  //   { key: "d", img: "/iot.jpg", link: "/digital?search=iotsystems#details" },
  //   { key: "w", img: "/micro-t.jpg", link: "/workfrom anywhere?search=windowsvirtualdesktop#details" },
  // ];
  // console.log(apiservice);
  const services = apiservice?.services
    ? apiservice?.services?.map((service: any) => {
        let link = `/${
          service?.slug ? service.slug : service?.Title?.toLowerCase()
        }#details`;
        return {
          key:
            service?.category?.trim()?.toLowerCase() === "endless support"
              ? "en"
              : service.category.charAt(0).toLowerCase(),
          img: service.image,
          link: link,
        };
      })
    : [];

  // console.log(services)

  // console.log(services);

  // Reorder list: bring related items to the top
  const sortedServices = [...services].sort((a, b) => {
    if (!active) return 0; // No sorting if no active hover
    if (a.key === active && b.key !== active) return -1; // Move related items up
    if (b.key === active && a.key !== active) return 1; // Move unrelated items down
    return 0; // Keep original order for others
  });

  return (
    <section
      className=""
      style={{ backgroundColor: "rgba(231,247,246,1)" }}
      id="services"
    >
      {/* Navbar */}
      <div className="lg:w-full md:text-xl hidden lg:text-2xl text-[#282828] font-lora mb-10 font-extralight list-none lg:flex justify-around p-5 box-border uppercase cursor-pointer opacity-50 mt-6">
        {[
          { key: "w", label: "Workfrom Anywhere" },
          { key: "ex", label: "Expertise" },
          { key: "b", label: "Branding" },
          { key: "m", label: "Modern Workplace" },
          { key: "en", label: "Endless Support" },
          { key: "d", label: "Digital" },
        ].map((item, index) => (
          <React.Fragment key={item.key}>
            <li
              className="py-0 hover:opacity-60 text-nowrap"
              onClick={() => setActive(item.key)}
              // onMouseLeave={() => setActive("")}
            >
              {item.label}
            </li>
            {index < 5 && (
              <li className="border-[1px] border-[#446E6D] opacity-50"></li>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Title Animation */}
      <div className="text-center pb-10 md:pb-24 px-4 sm:px-0 lg:px-[48px] z-10">
        <div className="mb-5 sm:mb-10 md:px-20 lg:px-89 px-5">
          <div className="relative cursor-pointer">
            <div className="mx-auto w-full text-2xl md:text-xl lg:text-4xl text-[#446E6D] font-lora my-8 lg:my-0 lg:mb-16 font-bold flex justify-center items-center">
              <p className="upper">
                <span
                  className={`uppercase transition-all duration-300 ${
                    active === "w" ? "text-[#D5E928]" : ""
                  }`}
                >
                  W
                </span>
                <span
                  className={`uppercase transition-all duration-300 ${
                    active === "ex" ? "text-[#D5E928]" : ""
                  }`}
                >
                  E
                </span>
                <span
                  className={`uppercase transition-all duration-300 ${
                    active === "b" ? "text-[#D5E928]" : ""
                  }`}
                >
                  B
                </span>
                <span
                  className={`uppercase transition-all duration-300 ${
                    active === "m" ? "text-[#D5E928]" : ""
                  }`}
                >
                  M
                </span>
                <span
                  className={`uppercase transition-all duration-300 ${
                    active === "en" ? "text-[#D5E928]" : ""
                  }`}
                >
                  E
                </span>
                <span
                  className={`transition-all duration-300 ${
                    active === "d" ? "text-[#D5E928]" : ""
                  }`}
                >
                  DIGITAL
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Image Cards Grid */}
        <div className="flex flex-col justify-center sm:flex-wrap gap-4 lg:gap-5 sm:flex-row">
          <AnimatePresence>
            {sortedServices.map((item, index) => (
              <motion.div
                key={item.key + index}
                layout // Enables smooth movement transition
                initial={{ opacity: 1 }}
                animate={{
                  opacity: active === "" || active === item.key ? 1 : 0.1,
                  scale: active === "" || active === item.key ? 1 : 0.95, // Fade unrelated items
                  // y: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "tween",
                  duration: 0.5,
                  ease: "easeInOut",
                  opacity: {
                    duration: active === "" || active === item.key ? 0.5 : 0.5,
                  }, // Longer fade for unrelated
                }}
                className="sm:basis-1/3 lg:basis-1/4 aspect-[16/9] "
              >
                <Link href={item.link} prefetch={false}>
                  <Image
                    src={item.img}
                    alt={`Service: ${item.key}`}
                    width={400}
                    height={225}
                    priority={index < 4}
                    unoptimized={true}
                    className={`w-full p-1 rounded-md overflow-hidden aspect-[16/9] border-[1px] shadow-md shadow-slate-500 transition-all duration-300 ${
                      active === item.key
                        ? "bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1"
                        : "border-[#76b4b1d0]"
                    }`}
                  />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Webme;
