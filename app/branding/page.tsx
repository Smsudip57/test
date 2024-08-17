import React from 'react'
import StarsCanvas from '@/components/main/StarBackground'

export default function Branding() {
  return (
    <div className='w-full relative'>
        <div className='min-h-[70ch] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni'></div>
        <div className='min-h-screen w-full absolute'>
        <StarsCanvas /></div>
        {/* <p className='mt-48'>safdas</p> */}
       <div className='min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto '>
            <div className=''>
            <div className='w-full h-full py-48 '>
        <div className=' w-[1280px] mx-auto flex '>
                <div className='w-[50%] flex flex-col justify-center gap-10 z-30'>
                    <strong className='text-[44px] font-bold leading-[52px] font-sans'>Elevate Your Brand with Exceptional Website Development</strong>
                    <p className='pr-10 font-medium'>In today’s digital-first world, your website is the heart of your business.<br></br><br></br> At [Your Company Name], we create stunning, high-performing websites that captivate your audience and drive your business forward. In the bustling bazaar of the digital world, your website is your storefront, your billboard, and your business card rolled into one. It’s the heartbeat of your online presence and the digital handshake that greets every potential customer.</p>
                </div>
                <div className='w-[50%] flex justify-center items-center z-30'>
                    <div className='flex justify-center flex-wrap items-center'>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/ew.jpg' alt='cisco' className='w-full'/></div>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/seo1.jpg' alt='cisco' className='w-full'/></div>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/rwd.jpg' alt='cisco' className='w-full'/></div>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/wd.jpg' alt='cisco' className='w-full'/></div>
                    </div>
                </div>
            </div> 


        <div className=' w-[1280px] mx-auto flex mt-28   '>
                <div className=' flex flex-col basis-1/3 pt-10 mr-3 gap-10 z-30 '>
                    <h2 className='text-4xl font-semibold mb-5 font-sans'>Crafting Your Digital Gateway: – </h2>
                    <p className='pr-10 font-medium'>Website development isn’t just about building a site; it’s about crafting a portal to possibilities. A website is more than just a web address.<br></br><br></br> It’s a 24/7 ambassador, tirelessly working to showcase your products and services to a global audience. It’s the silent salesman that never sleeps, the brand beacon that shines bright in the crowded online marketplace.</p>
                </div>
                <div className=' flex flex-col basis-1/3 justify-center items-start gap-8 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                <img src='/seo2.jpg' alt='cisco' className='w-full rounded-md'/>

                <h2 className='text-2xl font-semibold font-sans'>SEO (Search Engine Optimization) </h2>
                <div className=' font-medium flex flex-col gap-4'>
                  <p>
                  SEO (Search Engine Optimization) is essential for enhancing your website&apos;s visibility in the crowded online marketplace.<br></br><br></br> SEO increases traffic by optimizing your site, enhancing engagement, and building credibility. It’s about more than rankings—it&apos;s key for long-term success..
                  </p>
                    {/* <li>360-Degree Customer View: Centralize all customer interactions and data in one place.</li>
                    <li>Automated Follow-Ups: Never miss a lead with automated follow-up emails and reminders.</li>
                    <li>Pipeline Management: Visualize your sales pipeline and track progress with ease.</li>
                    <li>Customizable Dashboards: Tailor your dashboard to display the metrics that matter most to your business.</li> */}
                </div>
                <button className=' text-lg font-semibold bg-[#446E6D] text-white rounded-lg py-1 px-5'>Start a chat</button>
                </div>
                <div className='basis-1/3 flex flex-col gap-8'>
                <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                <img src='/ew.jpg' alt='cisco' className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>Ecommerce Website</h2>
                </div>
                <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                     <img src='/rwd.jpg' alt='cisco' className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>Real Estate Website</h2>

                </div>
                </div>
            
            </div> 

            </div>
        </div>

       </div>
       
    </div>
  )
}
