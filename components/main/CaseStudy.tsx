"use client"
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function CaseStudy() {





  return (
    <div className='z-20 w-full flex flex-col' id='case-study'>
  <div className='mx-auto text-center w-[1280px] my-40 relative'>

  <h1 className="font-lora text-4xl text-green-900 font-bold mb-6 uppercase">Customer Success Story</h1>
  <p className="text-[#393939] text-xl">Discover how businesses are revolutionizing customer success with WEBME.</p>
            {/* <h1 className='text-4xl w-full text-center'>
              <strong>
              
              </strong>
            </h1> */}
      <Swiper
        slidesPerView={1}
        spaceBetween={100}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-n',
          prevEl: '.swiper-button-p',
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay,Pagination, Navigation]}
        className="mySwiper cursor-pointer"
      >
        <SwiperSlide>
      
          <div className='mt-16 w-full relative overflow-hidden rounded-2xl shadow-md border-2 border-gray-200'>
            <div className='absolute top-0 left-0 w-full h-full' style={{zIndex:-1}}>
            <svg width="1280" height="459" viewBox="0 0 1280 459" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2462 -979C2462 -184.814 1812.81 459 1012 459C211.187 459 -438 -184.814 -438 -979C-438 -1773.19 211.187 -2417 1012
                            -2417C1812.81 -2417 2462 -1773.19 2462 -979Z" fill="rgb(259, 240, 255)"></path>
                </svg>

            </div>
            <div className='w-full flex items-center'>
              <div className=' basis-1/2 h-full px-40 '>
                <img src='/logo_mountain_gate.png' className='w-full active:border-[5px] active:border-blue-500 rounded-lg overflow-hidden'></img>
              </div>
              <div className='basis-1/2'>
              <div className='py-16 pr-24 text-left' >
                <div className='h-[32px] mb-5'>
                  <img src="https://a.sfdcstatic.com/shared/images/pbc/icons/quotation-english.svg" alt="backqoute" className='h-full' />
                </div>
                <span className='text-3xl'>
                  <strong>
                  The Odoo Application has transformed the way we manage maintenance tasks. The automation has not only saved us time but also improved the accuracy and efficiency of our operations. We are extremely pleased with the results and the support provided throughout the implementation process.
                  </strong>
                </span>
                <br></br><br></br>
                <span className='text-xl'>
                  <strong>
                  Abhilash Dass 
                  </strong>
                </span>
                <p className='mt-2 text-xl font-extralight'>
                Admin Manager, Mountain Gate Property Management
                </p>
                <button className='mt-10 text-[#446E6D] border-[1px] border-[#446E6D] py-3 px-8 flex items-center rounded font-semibold cursor-pointer gap-2'><span>Read the story <OpenInNewIcon fontSize='inherit'/></span></button>

              </div>

              </div>

            </div>
          </div>
          </SwiperSlide>
          <SwiperSlide>
            
          <div className='my-16 w-full relative overflow-hidden rounded-2xl shadow-md border-2 border-gray-200'>
            <div className='absolute top-0 left-0 w-full h-full' style={{zIndex:-1}}>
            <svg width="1280" height="459" viewBox="0 0 1280 459" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2462 -979C2462 -184.814 1812.81 459 1012 459C211.187 459 -438 -184.814 -438 -979C-438 -1773.19 211.187 -2417 1012
                            -2417C1812.81 -2417 2462 -1773.19 2462 -979Z" fill="rgb(259, 240, 255)"></path>
                </svg>

            </div>
            <div className='w-full flex items-center'>
              <div className=' basis-1/2 h-full px-40 '>
                <img src='/green-logo.png' className='w-full active:border-[5px] active:border-blue-500 rounded-lg overflow-hidden'></img>
              </div>
              <div className='basis-1/2'>
              <div className='py-16 pr-24 text-left' >
                <div className='h-[32px] mb-5'>
                  <img src="https://a.sfdcstatic.com/shared/images/pbc/icons/quotation-english.svg" alt="backqoute" className='h-full' />
                </div>
                <span className='text-3xl'>
                  <strong>
                  The implementation of Microsoft 365, our new website, and Odoo ERP has transformed our operations. We now have a unified system that enhances our productivity and customer service. The support and expertise provided throughout the process were exceptional.
                  </strong>
                </span>
                <br></br><br></br>
                <span className='text-xl'>
                  <strong>
                  Rajesh Kumar
                  </strong>
                </span>
                <p className='mt-2 text-xl font-extralight'>
                Managing Director, GREENTECH GENERAL MAINT
                </p>
                <button className='mt-10 text-[#446E6D] border-[1px] border-[#446E6D] py-3 px-8 flex items-center rounded font-semibold cursor-pointer gap-2'><span>Read the story <OpenInNewIcon fontSize='inherit'/></span></button>

              </div>

              </div>

            </div>
          </div>

                            </SwiperSlide>
                            </Swiper>
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
