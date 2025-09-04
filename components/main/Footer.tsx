"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import path from "path";
import { MyContext } from "@/context/context";

const Footer = () => {
  const pathname:any = usePathname();
  const router = useRouter();
  const context = React.useContext(MyContext);
  const { customToast } = useContext(MyContext);

  // const [isAdminPath, setIsAdminPath] = useState(false);
  const [loaded, setloaded] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      customToast({ success: false, message: "Please enter your email address" });
      return;
    }

    if (!email.includes("@")) {
      customToast({ success: false, message: "Please enter a valid email address" });
      return;
    }

    // Success case
    customToast({ success: true, message: "Thank you for subscribing to our newsletter!" });
    setEmail("");
  };

  if (
    pathname.includes("/admin") ||
    pathname.includes("/signin") ||
    pathname.includes("/signup") ||
    pathname.includes("/forgot-password")
  ) {
    return null;
  }

  return (
    <div className="bg-[#393939] text-white px-4 sm:px-12 lg:px-24 pt-12 flex relative z-30">
      <div className="w-[90%] lg:w-[80%] max-w-[1536px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-10 md:gap-5 xl:gap-20 pb-4 sm:pb-12 pr-6 sm:pr-0">
          <div className="gap-5 flex flex-col lg:w-[25%]">
            <img
              alt="WebMe"
              loading="lazy"
              width="100"
              height="36"
              decoding="async"
              data-nimg="1"
              className="ms-1 text-white mix-blend-screen"
              src="/logo_1.svg"
            />
            <p className="font-graphik font-normal leading-5 text-[14px]">
              WEBME Information Technology, Your trusted IT Consultancy
              Provider. With a passion for technology and a commitment to
              excellence, WEBME is here to guide your business through every
              step of its IT journey, ensuring seamless operations and
              transformative growth. WEBME mission is to bridge the gap between
              businesses and technology.
            </p>
          </div>
          <div className="hidden md:flex sm:justify-center w-[25%]">
            <div className="flex flex-col gap-5">
              <h2 className="font-inter text-[14px] leading-4 font-semibold uppercase">
                Company
              </h2>
              <div className="flex flex-col gap-4">
                <a href="/about/about-webme">
                  <p className="font-normal">About Us</p>
                </a>
                <a href="/#services">
                  <p className="font-normal">Services</p>
                </a>
                <a href="/customer-success-stories">
                  <p className="font-normal">Customer Success Story</p>
                </a>
                <a href="/#pricing">
                  <p className="font-normal">Pricing</p>
                </a>
                <a href="/#projects">
                  <p className="font-normal">Projects</p>
                </a>
                <a href="/about/terms-&-conditions">
                  <p className="font-normal">Terms & Conditions</p>
                </a>
                <a href="/about/privacy-policy">
                  <p className="font-normal">Privacy Policy</p>
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:flex sm:justify-center w-[25%]">
            <div className="flex flex-col gap-5">
              <h2 className="font-inter text-[14px] leading-4 font-semibold uppercase">
                Resources
              </h2>
              <div className="flex flex-col gap-4">
                <a href="/about/faq">
                  <p className="font-normal">FAQ</p>
                </a>
                <a href="/about/blog">
                  <p className="font-normal">Blog</p>
                </a>
                <a href="/about/knowledgebase">
                  <p className="font-normal">Knowledge Base</p>
                </a>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col gap-5 lg:w-[33%]">
            <h1 className="font-lora font-bold text-2xl">Newsletter</h1>
            <p className="font-graphik font-normal leading-[18px] text-[15px]">
              Latest Insights Delivered to You
            </p>
            <div className="gap-[10px] flex">
              <input
                placeholder="Work Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#091948] bg-white text-sm text-black rounded-lg px-[10px] lg:px-[18px] py-1.5 lg:py-[12px] flex-1"
              />
              <button
                onClick={handleSubscribe}
                className="bg-[#C1EBE7] px-[10px] lg:px-[18px] py-1.5 lg:py-[12px] rounded-lg drop-shadow-md shadow-[#A4ACB9] font-graphik text-sm text-[#393939] hover:bg-[#A4D3CF] transition-colors duration-200"
              >
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex sm:hidden flex-col gap-5">
            <h1 className="font-lora font-bold text-2xl">Newsletter</h1>
            <p className="font-graphik font-normal leading-[18px] text-[15px]">
              Latest Insights Delivered to You
            </p>
            <div className="gap-[10px] flex">
              <input
                placeholder="Work Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#091948] bg-white text-sm text-black rounded-lg px-[10px] lg:px-[18px] py-1.5 lg:py-[12px] flex-1"
              />
              <button
                onClick={handleSubscribe}
                className="bg-[#C1EBE7] px-[10px] lg:px-[18px] py-1.5 lg:py-[12px] rounded-lg drop-shadow-md shadow-[#A4ACB9] font-graphik text-sm text-[#393939] hover:bg-[#A4D3CF] transition-colors duration-200"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 justify-between border-t border-[#7C7C7C] py-5 items-center">
          <div className="flex gap-2 sm:gap-5 md:gap-10 font-inter font-medium text-[14px] leading-4">
            <a href="https://www.instagram.com/webmestore/" target="_blank">
              {" "}
              Instagram
            </a>
            <a href="https://x.com/webmedigital" target="_blank">
              Twitter
            </a>
            <a href="https://www.facebook.com/webmestore/" target="_blank">
              Facebook
            </a>
            <a href="https://www.linkedin.com/in/webmedigital" target="_blank">
              LinkedIn
            </a>
          </div>
          <div className="flex items-center gap-3 font-inter font-normal text-xs">
            <span>© 2024 WebMe</span>
            <span className="hidden sm:inline">•</span>
            <a
              href="/about/terms-&-conditions"
              className="hover:underline sm:hidden md:inline"
            >
              Terms & Conditions
            </a>
            <span className="hidden md:inline">•</span>
            <a
              href="/about/privacy-policy"
              className="hover:underline sm:hidden md:inline"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
