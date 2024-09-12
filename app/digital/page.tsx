import React from 'react'
import StarsCanvas from '@/components/main/StarBackground'
import EastIcon from '@mui/icons-material/East';

export default function Modern() {
  return (
    <div className='w-full relative'>
        <div className='min-h-[690px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni'></div>
        <div className='min-h-screen w-full absolute'>
        <StarsCanvas /></div>
        {/* <p className='mt-48'>safdas</p> */}
       <div className='min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto '>
            <div className=''>
            <div className='w-full h-full py-[19vh]  '>
        <div className=' w-[1280px] mx-auto flex '>
                <div className='w-[50%] flex flex-col justify-center gap-10 z-30'>
                    <strong className='text-[40px] font-bold leading-[52px] font-sans'>Enhance Your Business with Modern Solutions – Secure and Flexible Work from Anywhere</strong>
                    <p className='pr-10 font-medium'>In the fast-paced world of modern business, staying ahead means embracing the latest in digital transformation.<br></br><br></br> Enter the Microsoft Modern Workplace—a suite of cutting-edge tools and technologies designed to empower your workforce and revolutionize the way you do business.</p>
                    <div className='flex gap-6'>
                    <button className='align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-sm'>Book Free Consultation</button>
                    <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Explore</span> <EastIcon fontSize='inherit '/></button>
                    </div>
                </div>
                <div className='w-[50%] flex justify-center items-center z-30'>
                    <div className='flex justify-center flex-wrap items-center'>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><a href='#details' className='cursor-pointer hover:mix-blend-plus-darker'><img src='/cctv.jpg' alt='cisco' className='w-full  hover:opacity-70'/></a></div>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><a href='#details' className='cursor-pointer hover:mix-blend-plus-darker'><img src='/iot.jpg' alt='cisco' className='w-full  hover:opacity-70'/></a></div>
                    {/* <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><a href='#details' className='cursor-pointer hover:mix-blend-plus-darker'><img src='/pbi.jpg' alt='cisco' className='w-full  hover:opacity-70'/></a></div>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><a href='#details' className='cursor-pointer hover:mix-blend-plus-darker'><img src='/micro-t.jpg' alt='cisco' className='w-full  hover:opacity-70'/></a></div> */}
                    </div>
                </div>
            </div> 


        <div className=' w-[1280px] mx-auto flex pt-28   ' id='details'>
                <div className=' flex flex-col basis-1/3 pt-10 mr-3 gap-10 z-30 '>
                    <h2 className='text-4xl font-semibold mb-5 font-sans'>Transform your business with Microsoft Modern Workplace – </h2>
                    <p className='pr-10 font-medium'>a beacon of innovation, security, and collaboration. It’s more than technology; it’s a commitment to a modernized, efficient, and secure future.</p>
                </div>
                <div className=' flex flex-col basis-1/3 justify-center items-start gap-8 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                <img src='/cctv.jpg' alt='cisco' className='w-full rounded-md'/>

                <h2 className='text-2xl font-semibold font-sans'>AI CCTV</h2>
                <div className=' font-medium flex flex-col gap-4'>
                  <p>
                  {/* In the digital era, where agility meets innovation, Microsoft Modern Workplace emerges as the cornerstone of business evolution.<br></br><br></br> It’s not just a suite of products; it’s a revolutionary workspace metamorphosis that propels your business into the future. */}
                  </p>
                  <p>No data yet</p>
                    {/* <li>360-Degree Customer View: Centralize all customer interactions and data in one place.</li>
                    <li>Automated Follow-Ups: Never miss a lead with automated follow-up emails and reminders.</li>
                    <li>Pipeline Management: Visualize your sales pipeline and track progress with ease.</li>
                    <li>Customizable Dashboards: Tailor your dashboard to display the metrics that matter most to your business.</li> */}
                </div>
                <button className=' text-lg font-semibold bg-[#446E6D] text-white rounded-lg py-1 px-5'>Start a chat</button>
                </div>
                <div className='basis-1/3 flex flex-col gap-8'>
                <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                <img src='/iot.jpg' alt='cisco' className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>IOT</h2>
                </div>
                {/* <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                     <img src='/pbi.jpg' alt='cisco' className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>Power Apps</h2>

                </div> */}
                </div>
            
            </div> 

            </div>
        </div>

       </div>
       
    </div>
  )
}
