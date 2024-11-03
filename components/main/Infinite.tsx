"use client"
import React, { useRef, useState } from 'react';

export default function Infinite() {





  return (
    <div className='z-20 w-full max-w-[1920px] mx-auto my-12 pt-20 text-center' id='industries'>
      <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6">STORE</h1>
      <p className="text-base lg:text-xl text-center mb-16 ">Handpicked Items for You.</p>
    <div className='carousel-container lg:w-[80%] max-w-[900px] mx-auto overflow-hidden box-border'>
    <div className='carousel-track flex gap-16 ' style={{animation: 'slide 10s linear infinite',width:"max-content" }}>
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite1.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite2.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite3.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite4.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite5.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite6.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite7.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite8.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite9.jpg" />
      {/* Duplicate images for seamless looping */}
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite1.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite2.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite3.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite4.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite5.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite6.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite7.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite8.jpg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/infinite9.jpg" />
    </div>
</div>

  </div>

  );
}
