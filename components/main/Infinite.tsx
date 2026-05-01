"use client"
import React, { useRef, useState } from 'react';
import Image from 'next/image';

export default function Infinite() {





  return (
    <div className='z-20 w-full max-w-[1920px] mx-auto my-12 pt-20 text-center hidden' id='industries'>
      <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6">STORE</h1>
      <p className="text-base lg:text-xl text-center mb-16 ">Handpicked Items for You.</p>
    <div className='carousel-container lg:w-[80%] max-w-[900px] mx-auto overflow-hidden box-border'>
    <div className='carousel-track flex gap-16 ' style={{animation: 'slide 10s linear infinite',width:"max-content" }}>
      <Image alt="brand" src="/infinite1.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite2.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite3.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite4.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite5.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite6.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite7.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite8.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite9.jpg" width={100} height={100} />
      {/* Duplicate images for seamless looping */}
      <Image alt="brand" src="/infinite1.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite2.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite3.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite4.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite5.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite6.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite7.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite8.jpg" width={100} height={100} />
      <Image alt="brand" src="/infinite9.jpg" width={100} height={100} />
    </div>
</div>

  </div>

  );
}
