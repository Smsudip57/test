import React from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function page() {
  return (
    <div className='min-h-screen  pt-20 xl:pt-0'>
        <div className='mx-auto mb-20 lg:mb-0 lg:h-[680px] bg-white max-w-[1536px] flex  items-center '>
            <div className=' flex flex-col lg:flex-row gap-6'>

            <div className='lg:basis-1/2 z-10 relative'>
            <div className='top-0 bg-white p-2 absolute right-0  mr-[60px] z-20'>
                <div className='w-full h-[366px] relative'>
            <img src='/img-20230815-wa00021692086402.webp' className='h-[366px]'/>
                    <div className='bg-white absolute z-30 aspect-[1/1] bottom-[-14%] right-[-7%] px-5 flex flex-col justify-center items-center gap-1 border-b-4 border-[#446E6D]'>
                    <span className='text-4xl font-semibold text-[#446E6D]'>8+</span>
                    <p className='uppercase font-semibold '>Experience</p>
                    </div>
                </div>
            </div>
            <div className='absolute h-[366px] w-1/2 left-0 top-0 bg-[#446E6D] z-10 bg-opacity-80'></div>
            <img src='/portrait-woman-customer-service-worker1688325158.webp' className='h-[366px] invisible xl:visible'/>
            <img src='/07.webp' className='absolute right-0 top-0 pr-[20px]'/>
            </div>
            <div className='lg:basis-1/2 z-20 w-[90%] mx-auto lg:w-full'>
            <div className='mt-16 lg:mt-10 flex flex-col lg:pr-28'>
                <span className='text-[#446E6D] mb-2'>About</span>
                <span className='text-5xl mb-7'>WEBME</span>
                <span className='text-gray-500'>
                WEBME Information Technology, Your trusted IT Consultancy Provider. With a passion for technology and a commitment to excellence, WEBME is here to guide your business through every step of its IT journey, ensuring seamless operations and transformative growth. WEBME mission is to bridge the gap between businesses and technology. By believing that technology should be an enabler, not a hindrance, and that&apos;s why WEBME strive to deliver tailor-made IT solutions that align with your unique needs. WEBME is here to guide you through the complex landscape of IT, ensuring that your technology supports your goals and drives Success. WEBME Your Virtual companion in the Digital World.
                </span>
                <button className='bg-[#446E6D] text-white py-2 px-4 flex items-center rounded font-semibold gap-2 cursor-pointer w-max mt-7'><span>Contact us <OpenInNewIcon fontSize='inherit'/></span></button>

            </div>
            </div>
            </div>

        </div>
        
    </div>
  )
}
