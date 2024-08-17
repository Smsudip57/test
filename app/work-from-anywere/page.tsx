import React from 'react'
import StarsCanvas from '@/components/main/StarBackground'

export default function Work() {
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
                <strong className='text-[44px] font-bold leading-[52px] font-sans'>Transform Your Business with Next-Gen ERP Solutions</strong>
                <p className='pr-10 font-medium'>In the complex world of business management, simplicity is the ultimate sophistication.<br></br><br></br>  ERP software—a game-changer that integrates every aspect of your operations into a single, seamless platform. In the constellation of business tools, ERP software shines as the supernova of operational excellence. It’s not just a system; it’s the nucleus of your enterprise, orchestrating a symphony of streamlined processes and integrated data.</p>
            </div>
            <div className='w-[50%] flex justify-center items-center z-30'>
                <div className='flex justify-center flex-wrap items-center'>
                <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/micro-d.jpg' alt='cisco' className='w-full'/></div>
                <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/odoo-erp.jpg' alt='cisco' className='w-full'/></div>
                <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/Oracle.jpg' alt='cisco' className='w-full'/></div>
                <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/s-sap-erp.png' alt='cisco' className='w-full'/></div>
                </div>
            </div>
        </div> 


    <div className=' w-[1280px] mx-auto flex mt-28   '>
            <div className=' flex flex-col basis-1/3 pt-10 mr-3 gap-10 z-30 '>
                <h2 className='text-4xl font-semibold mb-5 font-sans'>Unlock the full potential of your business with Odoo ERP – </h2>
                <p className='pr-10 font-medium'>the all-in-one management software that streamlines operations, boosts productivity, and drives growth. Whether you’re looking to implement Odoo from scratch or need expert consultancy to optimize your existing setup, our team of certified professionals is here to guide you every step of the way.<br></br><br></br>Ready to revolutionize your business?<br></br><br></br>Get Started Today!</p>
            </div>
            <div className=' flex flex-col basis-1/3 justify-center items-start gap-8 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
            {/* <img src='/cisco-r.jpg' alt='cisco' className='w-full rounded-md'/> */}
            {/* <img alt="logo" loading="lazy" width="100" height="36" decoding="async" data-nimg="1" className="w-full h-full object-cover" style={{color:"transparent"}} srcSet="/video_CRM.webm" src="/video_CRM.webm"/> */}
            <video src='/video_CRM.webm' className='border-[1px] border-gray-400' autoPlay loop></video>

            <h2 className='text-2xl font-semibold font-sans'>Odoo 17 CRM</h2>
            <div className=' font-medium flex flex-col gap-4'>
                <li>360-Degree Customer View: Centralize all customer interactions and data in one place.</li>
                <li>Automated Follow-Ups: Never miss a lead with automated follow-up emails and reminders.</li>
                <li>Pipeline Management: Visualize your sales pipeline and track progress with ease.</li>
                <li>Customizable Dashboards: Tailor your dashboard to display the metrics that matter most to your business.</li>
            </div>
            <button className=' text-lg font-semibold bg-[#446E6D] text-white rounded-lg py-1 px-5'>Start a chat</button>
            </div>
            <div className='basis-1/3 flex flex-col gap-8'>
            <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
            <img src='/Oracle.jpg' alt='cisco' className='w-full rounded-md'/>
            <h2 className='text-2xl font-semibold font-sans'>Oracle ERP</h2>
            </div>
            <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                 <img src='/s-sap-erp.png' alt='cisco' className='w-full rounded-md'/>
            <h2 className='text-2xl font-semibold font-sans'>Sap ERP</h2>

            </div>
            </div>
        
        </div> 

        </div>
    </div>

   </div>
   
</div>
  )
}
