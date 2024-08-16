"use client"
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';


export default function CaseStudy() {





  return (
    <div className='z-20 w-full' id='case-study'>
  <div>
    <p className="text-[20px] font-medium text-seagreen-950 lg:mt-[131px] text-center font-graphik leading-[44px]">Case study</p>
    <p className="text-[36px] text-center font-lora font-bold leading-[44px] gree-900 lg:mt-2">Work to Inspire</p>
    <div className="lg:w-[781px] mx-auto">
      <p className="text-[20px] font-normal leading-[30px] text-center font-graphik lg:mt-6">
        Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
      </p>
    </div>
  </div>
  <div className="relative mx-2 flex mt-[50px] lg:mx-[136px]">
    <div className="2xl:w-[95%] mx-auto">
      
    <Swiper
        slidesPerView={3}
        spaceBetween={100}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-n',
          prevEl: '.swiper-button-p',
        }}
        modules={[ Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
        <div className="keen-slider__slide number-slide1 " style={{ transform: 'translate3d(0px, 0px, 0px)', maxWidth: '405.333px' }}>
        <div className="relative w-full h-[449px] rounded-xl overflow-hidden bg-[url('/cctv-security.png')] bg-cover bg-center bg-no-repeat bg-cctv">
          <div className="absolute bottom-[29px] left-[34px]">
            <p className="text-[24px] leading-[26px] font-semibold font-lora">Modern NextJS Portfolio</p>
            <p className="mt-[14px] font-graphik font-medium text-[18px] leading-6 pr-5">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            <div className="h-[31px] w-[132px]">
              <p className="font-graphik font-medium text-[18px] left-6 whitespace-nowrap overflow-hidden text-ellipsis">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            </div>
            <p className="font-graphik font-semibold text-[18px] mt-[24px] leading-[20px]">Read Full Case Study</p>
          </div>
        </div>
      </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className="keen-slider__slide number-slide1 " style={{ transform: 'translate3d(0px, 0px, 0px)', maxWidth: '405.333px' }}>
        <div className="relative w-full h-[449px] rounded-xl overflow-hidden bg-[url('/cctv-security.png')] bg-cover bg-center bg-no-repeat bg-cctv">
          <div className="absolute bottom-[29px] left-[34px]">
            <p className="text-[24px] leading-[26px] font-semibold font-lora">Modern NextJS Portfolio</p>
            <p className="mt-[14px] font-graphik font-medium text-[18px] leading-6 pr-5">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            <div className="h-[31px] w-[132px]">
              <p className="font-graphik font-medium text-[18px] left-6 whitespace-nowrap overflow-hidden text-ellipsis">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            </div>
            <p className="font-graphik font-semibold text-[18px] mt-[24px] leading-[20px]">Read Full Case Study</p>
          </div>
        </div>
      </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className="keen-slider__slide number-slide1 " style={{ transform: 'translate3d(0px, 0px, 0px)', maxWidth: '405.333px' }}>
        <div className="relative w-full h-[449px] rounded-xl overflow-hidden bg-[url('/cctv-security.png')] bg-cover bg-center bg-no-repeat bg-cctv">
          <div className="absolute bottom-[29px] left-[34px]">
            <p className="text-[24px] leading-[26px] font-semibold font-lora">Modern NextJS Portfolio</p>
            <p className="mt-[14px] font-graphik font-medium text-[18px] leading-6 pr-5">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            <div className="h-[31px] w-[132px]">
              <p className="font-graphik font-medium text-[18px] left-6 whitespace-nowrap overflow-hidden text-ellipsis">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            </div>
            <p className="font-graphik font-semibold text-[18px] mt-[24px] leading-[20px]">Read Full Case Study</p>
          </div>
        </div>
      </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className="keen-slider__slide number-slide1 " style={{ transform: 'translate3d(0px, 0px, 0px)', maxWidth: '405.333px' }}>
        <div className="relative w-full h-[449px] rounded-xl overflow-hidden bg-[url('/cctv-security.png')] bg-cover bg-center bg-no-repeat bg-cctv">
          <div className="absolute bottom-[29px] left-[34px]">
            <p className="text-[24px] leading-[26px] font-semibold font-lora">Modern NextJS Portfolio</p>
            <p className="mt-[14px] font-graphik font-medium text-[18px] leading-6 pr-5">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            <div className="h-[31px] w-[132px]">
              <p className="font-graphik font-medium text-[18px] left-6 whitespace-nowrap overflow-hidden text-ellipsis">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            </div>
            <p className="font-graphik font-semibold text-[18px] mt-[24px] leading-[20px]">Read Full Case Study</p>
          </div>
        </div>
      </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className="keen-slider__slide number-slide1 " style={{ transform: 'translate3d(0px, 0px, 0px)', maxWidth: '405.333px' }}>
        <div className="relative w-full h-[449px] rounded-xl overflow-hidden bg-[url('/cctv-security.png')] bg-cover bg-center bg-no-repeat bg-cctv">
          <div className="absolute bottom-[29px] left-[34px]">
            <p className="text-[24px] leading-[26px] font-semibold font-lora">Modern NextJS Portfolio</p>
            <p className="mt-[14px] font-graphik font-medium text-[18px] leading-6 pr-5">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            <div className="h-[31px] w-[132px]">
              <p className="font-graphik font-medium text-[18px] left-6 whitespace-nowrap overflow-hidden text-ellipsis">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            </div>
            <p className="font-graphik font-semibold text-[18px] mt-[24px] leading-[20px]">Read Full Case Study</p>
          </div>
        </div>
      </div>
        </SwiperSlide>
        <SwiperSlide>
        <div className="keen-slider__slide number-slide1 " style={{ transform: 'translate3d(0px, 0px, 0px)', maxWidth: '405.333px' }}>
        <div className="relative w-full h-[449px] rounded-xl overflow-hidden bg-[url('/cctv-security.png')] bg-cover bg-center bg-no-repeat bg-cctv">
          <div className="absolute bottom-[29px] left-[34px]">
            <p className="text-[24px] leading-[26px] font-semibold font-lora">Modern NextJS Portfolio</p>
            <p className="mt-[14px] font-graphik font-medium text-[18px] leading-6 pr-5">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            <div className="h-[31px] w-[132px]">
              <p className="font-graphik font-medium text-[18px] left-6 whitespace-nowrap overflow-hidden text-ellipsis">Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry.</p>
            </div>
            <p className="font-graphik font-semibold text-[18px] mt-[24px] leading-[20px]">Read Full Case Study</p>
          </div>
        </div>
      </div>
        </SwiperSlide>
        
      </Swiper>
    </div>
    <div className="absolute shadow-lg right-0 lg:-right-6 top-[45%] z-[99999999] bg-white w-[52px] h-[52px] rounded-[100%] flex justify-center items-center swiper-button-n cursor-pointer" >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
        <path fill="#000" fillRule="evenodd" d="M8.25 3.667 15.584 11 8.25 18.333 6.417 16.5l5.5-5.5-5.5-5.5L8.25 3.667Z" clipRule="evenodd"></path>
      </svg>
    </div>
    <div className="absolute shadow-lg left-0 lg:-left-6 top-[45%] z-10 bg-white w-[52px] h-[52px] rounded-[100%] flex justify-center items-center swiper-button-p cursor-pointer" >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
        <path fill="#000" fillRule="evenodd" d="M13.75 18.333 6.417 11l7.333-7.333L15.583 5.5l-5.5 5.5 5.5 5.5-1.833 1.833Z" clipRule="evenodd"></path>
      </svg>
    </div>
  </div>
</div>

  );
}
