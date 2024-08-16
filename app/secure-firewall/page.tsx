import React from 'react'
import StarsCanvas from '@/components/main/StarBackground'

export default function Firewall() {
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
                    <strong className='text-[44px] font-bold leading-[52px] font-sans'>Unlock the Power of Protection with Premier Network Security</strong>
                    <p className='pr-10 font-medium'>Embark on a journey to digital fortitude with Network Security, the cornerstone of modern business resilience.<br></br><br></br> In an era where cyber threats loom large, Network Security stands as the vanguard, shielding your enterprise’s lifeblood—its data. In today’s fast-paced digital world, safeguarding your business from cyber threats is more crucial than ever.  Network security is not just a tech requirement—it's a cornerstone of your business’s resilience and success.</p>
                </div>
                <div className='w-[50%] flex justify-center items-center z-30'>
                    <div className='flex justify-center flex-wrap items-center'>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/cisco.png' alt='cisco' className='w-full'/></div>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/fortinet.png' alt='cisco' className='w-full'/></div>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/paltoalo.jpg' alt='cisco' className='w-full'/></div>
                    <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl '><img src='/sophos.png' alt='cisco' className='w-full'/></div>
                    </div>
                </div>
            </div> 


        <div className=' w-[1280px] mx-auto flex mt-28   '>
                <div className=' flex flex-col basis-1/3 pt-10 mr-3 gap-10 z-30 '>
                    <h2 className='text-4xl font-semibold mb-5 font-sans'>CISCO Firewall Solutions</h2>
                    <p className='pr-10 font-medium'>Protect your business with industry-leading Cisco Firewall solutions. Our expert team ensures seamless implementation and top-notch consultancy services, tailored to your unique security needs.<br></br><br></br> Stay ahead of threats and safeguard your data with the best in network security.</p>
                </div>
                <div className=' flex flex-col basis-1/3 justify-center items-start gap-8 z-30 mx-3 p-10 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                <img src='/cisco-r.jpg' alt='cisco' className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>Cisco Secure Firewall 1010</h2>
                <div className=' font-medium flex flex-col gap-4'>
                    <li>Compact and Powerful: Ideal for small businesses, offering robust security in a compact form factor.</li>
                    <li>Advanced Threat Protection: Features next-gen IPS, URL filtering, and advanced malware protection.</li>
                    <li>Easy Management: Simplified management with Cisco Defense Orchestrator for streamlined operations.</li>
                </div>
                <button className=' text-lg font-semibold bg-[#446E6D] text-white rounded-lg py-1 px-5'>Start a chat</button>
                </div>
                <div className='basis-1/3 flex flex-col gap-8'>
                <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-10 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                <img src='/cisco-f.jpg' alt='cisco' className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>Cisco Firepower 1120</h2>
                </div>
                <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-10 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                     <img src='/cisco-m.jpg' alt='cisco' className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>Cisco Meraki MX67</h2>

                </div>
                </div>
            
            </div> 

            </div>
        </div>

       </div>
       
    </div>
  )
}
