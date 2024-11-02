import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#393939] text-white px-4 sm:px-12 lg:px-24 pt-12 flex relative z-50">
    <div className="w-[90%] lg:w-[80%] max-w-[1536px] mx-auto">
         {/* className="bg-[#393939] text-white px-4 sm:px-12 lg:px-24 pt-12" */}
  <div className="flex flex-col sm:flex-row justify-between gap-10 md:gap-5 xl:gap-20 pb-4 sm:pb-12 pr-6 sm:pr-0">
    <div className="gap-5 flex flex-col lg:w-[33%]">
      <img
        alt="WebMe"
        loading="lazy"
        width="100"
        height="36"
        decoding="async"
        data-nimg="1"
        className="ms-1 text-white mix-blend-screen"
        // style={{ color: 'transparent' }}
        src="/logo_1.svg"
        />
      <p className="font-graphik font-normal leading-5 text-[14px]">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text.
      </p>
    </div>
    <div className="hidden md:flex items-center sm:justify-center w-[33%]">
      <div className="flex flex-col gap-5">
        <h2 className="font-inter text-[14px] leading-4 font-semibold uppercase">Company</h2>
        <div className="flex flex-col gap-4">
          <a href="">
            <p className="font-normal">About Us</p>
          </a>
          <a href="">
            <p className="font-normal">Services</p>
          </a>
          <a href="">
            <p className="font-normal">Testimonials</p>
          </a>
          <a href="">
            <p className="font-normal">Pricing</p>
          </a>
          <a href="">
            <p className="font-normal">Case Study</p>
          </a>
        </div>
      </div>
    </div>
    <div className="hidden sm:flex flex-col gap-5 lg:w-[33%]">
      <h1 className="font-lora font-bold text-2xl">Newsletter</h1>
      <p className="font-graphik font-normal leading-[18px] text-[15px]">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>
      <div className="gap-[10px] flex">
        <input
          placeholder="Work Email Address"
          type="text"
          className="border border-[#091948] bg-white text-sm rounded-lg px-[10px] lg:px-[18px] py-1.5 lg:py-[12px]"
          />
        <button className="bg-[#C1EBE7] px-[10px] lg:px-[18px] py-1.5 lg:py-[12px] rounded-lg drop-shadow-md shadow-[#A4ACB9] font-graphik text-sm text-[#393939]">
          Subscribe
        </button>
      </div>
    </div>
    {/* <div className="flex md:hidden items-center">
      <div className="flex flex-col gap-5">
        <h2 className="font-inter text-[14px] leading-4 font-semibold uppercase">Company</h2>
        <div className="flex flex-col gap-4">
          <a href="">
            <p className="font-normal">About Us</p>
          </a>
          <a href="">
            <p className="font-normal">Services</p>
          </a>
          <a href="">
            <p className="font-normal">Testimonials</p>
          </a>
          <a href="">
            <p className="font-normal">Pricing</p>
          </a>
          <a href="">
            <p className="font-normal">Case Study</p>
          </a>
        </div>
      </div>
    </div> */}
    <div className="flex sm:hidden flex-col gap-5">
      <h1 className="font-lora font-bold text-2xl">Newsletter</h1>
      <p className="font-graphik font-normal leading-[18px] text-[15px]">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>
      <div className="gap-[10px] flex">
        <input
          placeholder="Work Email Address"
          type="text"
          className="border border-[#091948] bg-white text-sm rounded-lg px-[10px] lg:px-[18px] py-1.5 lg:py-[12px]"
          />
        <button className="bg-[#C1EBE7] px-[10px] lg:px-[18px] py-1.5 lg:py-[12px] rounded-lg drop-shadow-md shadow-[#A4ACB9] font-graphik text-sm text-[#393939]">
          Subscribe
        </button>
      </div>
    </div>
  </div>
  <div className="flex flex-col sm:flex-row gap-5 justify-between border-t border-[#7C7C7C] py-5 items-center">
    <div className="flex gap-2 sm:gap-5 md:gap-10 font-inter font-medium text-[14px] leading-4">
      <a href="">Instagram</a>
      <a href="">Twitter</a>
      <a href="">Facebook</a>
      {/* <a href="">Telegram</a> */}
      <a href="">LinkedIn</a>
    </div>
    <div className="font-inter font-normal text-xs">© 2024 WebMe</div>
  </div>
    </div>
          </div>
  )
}

export default Footer