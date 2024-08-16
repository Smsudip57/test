"use client"
import React, { useRef, useState } from 'react';

export default function Infinite() {





  return (
    <div className='z-20 w-full max-w-[1920px] mx-auto my-12 pt-20 ' id='industries'>
    <div className='carousel-container lg:w-[80%] max-w-[900px] mx-auto overflow-hidden box-border'>
    <div className='carousel-track flex gap-16 ' style={{animation: 'slide 10s linear infinite',width:"max-content" }}>
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10244.svg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10245.svg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10246.svg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10247.svg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10248.svg" />
      {/* Duplicate images for seamless looping */}
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10244.svg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10245.svg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10246.svg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10247.svg" />
      <img alt="brand" loading="lazy" width="100" height="100" decoding="async" style={{ color: 'transparent' }} src="/Rectangle 10248.svg" />
    </div>
</div>

  </div>

  );
}
