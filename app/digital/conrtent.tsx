"use client"
import React,{useState, useEffect} from 'react'
import StarsCanvas from '@/components/main/StarBackground'
import { useSearchParams } from 'next/navigation';
import EastIcon from '@mui/icons-material/East';
import Projects from '@/components/main/Projects';
import Industies from '@/components/main/Industies';
import CaseStudy from '@/components/main/CaseStudy';
interface DataItem {
    id: number;
    image: string;
    title: string;
    description: string[];
}


export default function Firewall() {
    const [main, setmain] = useState(0)
    const [others, setothers] = useState<DataItem[]>([]);
    const products = {
        cisco:{
            image:'/cctv.jpg',
            description:{
                title:'Transform your business digitally –',
                intro:'a beacon of innovation, security, and collaboration. It’s more than technology; it’s a commitment to a modernized, efficient, and secure future.',
                question:'',
                importance:[
                    // "High Performance: Benefit from scalable performance and low latency with purpose-built security processors.",
                    // "Advanced Threat Protection: Stay protected with real-time threat intelligence and AI-powered security.",
                    // "Comprehensive Security: Enjoy features like intrusion prevention, web filtering, and SSL inspection.",
                    // "Seamless Integration: Easily integrates with your existing IT infrastructure for a unified security approach.",
                    // "Expert Support: Our certified professionals provide end-to-end support for all your security needs."
                ]
            },
            data:[
                {
                    id:0,
                    image:'/cctv.jpg',
                    title:'AI-Enabaled Surveillance Systems',
                    description:[
                        "Step into the future of security with AI-enabled Surveillance Systems.|| ||These advanced systems leverage artificial intelligence to provide unparalleled protection and efficiency. With features like real-time video analytics, facial recognition, and behavior analysis, AI-powered surveillance can detect and respond to potential threats instantly. Whether it’s identifying suspicious activities, tracking objects of interest, or providing detailed insights, these systems ensure comprehensive monitoring and enhanced safety. Experience the next level of security with intelligent, automated, and highly accurate surveillance solutions designed to keep your environment secure 24/7."
                    ]
                },
                {
                    id:1,
                    image:'/hik.jpg',
                    title:'AI-Enabled Surveillance CCTV Cameras',
                    description:[
                        "Hikvision’s Dedicated DeepinView cameras are advanced surveillance solutions equipped with AI-powered deep learning algorithms. Here are some key features:|| || ||AI-Powered Analytics||Dual Sensor Technology||Smart Event Detection||High Image Quality"
                    ]
                },
                {
                    id:2,
                    image:'/bmc.jpg',
                    title:'AI-Enabled Authentication Systems',
                    description:[
                        "AI-enabled authentication systems leverage advanced technologies to enhance security and user experience. Here are some key features with detailed descriptions: || ||Biometric Authentication|| ||Description: Utilizes unique biological traits such as fingerprints, facial recognition, and voice patterns.|| ||Details: These systems capture and store biometric data, which is then used to verify the user’s identity. For example, facial recognition systems use AI algorithms to analyze facial features and match them with stored data.|| ||Benefits: Provides high security and convenience, as biometric traits are difficult to replicate."
                    ]
                },
            ]
        },
        fortinet:{
            image:'/iot.jpg',
            description:{
                title:'Transform your business digitally –',
                intro:'a beacon of innovation, security, and collaboration. It’s more than technology; it’s a commitment to a modernized, efficient, and secure future.',
                question:'',
                importance:[
                    // "High Performance: Benefit from scalable performance and low latency with purpose-built security processors.",
                    // "Advanced Threat Protection: Stay protected with real-time threat intelligence and AI-powered security.",
                    // "Comprehensive Security: Enjoy features like intrusion prevention, web filtering, and SSL inspection.",
                    // "Seamless Integration: Easily integrates with your existing IT infrastructure for a unified security approach.",
                    // "Expert Support: Our certified professionals provide end-to-end support for all your security needs."
                ]
            },
            data:[
                {
                    id:0,
                    image:'/iot.jpg',
                    title:' Connect, Automate, and Innovate with IoT Systems',
                    description:[
                        "Unlock the full potential of your business with our cutting-edge IoT Systems.|| ||Seamlessly connect devices, automate processes, and gather real-time data to drive smarter decisions and enhance efficiency. From smart homes to industrial automation, our IoT solutions provide unparalleled control and insight, transforming the way you operate. Experience the future of connectivity with intelligent systems that adapt to your needs, optimize performance, and propel your business into the digital age."
                    ]
                },
                {
                    id:1,
                    image:'/sop.jpg',
                    title:'Smart Office Solutions',
                    description:[
                        "Integrates IoT devices to create a connected and efficient office environment.|| ||Details: Includes smart lighting, climate control, and security systems. These solutions use sensors and automation to optimize energy usage, enhance security, and improve overall workplace comfort.|| ||Benefits: Reduces operational costs, increases energy efficiency, and provides a comfortable and secure working environment."
                    ]
                },
                {
                    id:2,
                    image:'/rop.jpg',
                    title:'Smart Retail Solutions',
                    description:[
                        "Implements IoT technology to enhance the retail experience.|| ||Details: Includes smart shelves, inventory management systems, and customer behavior analytics. These solutions help retailers manage stock levels, understand customer preferences, and optimize store layouts.|| ||Benefits: Improves inventory accuracy, enhances customer satisfaction, and boosts sales."
                    ]
                },
               
            ]
        },
        // paloalto:{
        //     image:'/paltoalo.jpg',
        //     description:{
        //         title:'Elevate Your Security with Palo Alto Networks',
        //         intro:'Transform your network security with Palo Alto Networks. ||Known for their cutting-edge technology and innovative solutions, Palo Alto Networks provides comprehensive protection against the most advanced cyber threats. Whether you need implementation or consultancy, our expert team is ready to deliver customized solutions that ensure your network remains secure and resilient.',
        //         question:'Why Choose Palo Alto Networks?',
        //         importance:[
        //             "Next-Generation Security: Leverage advanced threat prevention and real-time threat intelligence.",
        //             "Comprehensive Protection: Benefit from integrated firewall, intrusion prevention, and URL filtering.",
        //             "Scalable Solutions: Perfect for businesses of all sizes, offering flexibility and growth potential.",
        //             "Expert Support: Our certified professionals provide end-to-end support for all your security needs."
        //         ]
        //     },
        //     data:[
        //         {
        //             id:0,
        //             image:'/pa-220.png',
        //             title:'PA-220',
        //             description:[
        //                 "Compact and Powerful: Delivers enterprise-grade security in a small form factor, perfect for small offices1.",
        //                 "Advanced Threat Prevention: Protects against known and unknown threats with real-time updates from WildFire1.",
        //                 "Easy Management: Simplified deployment and management through the intuitive web interface1.",
        //                 "Cost-Effective: Provides robust security features at an affordable price, ideal for SMBs."
        //             ]
        //         },
        //         {
        //             id:1,
        //             image:'/PA820.png',
        //             title:'PA-820',
        //             description:[
        //                 "High Performance: Offers up to 940 Mbps firewall throughput, ensuring fast and secure network traffic2.",
        //                 "Comprehensive Security: Includes firewall, VPN, and intrusion prevention in a single device2.",
        //                 "Scalable Solution: Suitable for growing businesses, offering flexibility and scalability as your network expands2.",
        //                 "User-Friendly Interface: Intuitive management through Panorama, ensuring easy monitoring and control2."
        //             ]
        //         },
        //         {
        //             id:2,
        //             image:'/prisma-Access-logo.png',
        //             title:'Prisma Access',
        //             description:[
        //                 "Cloud-Delivered Security: Provides secure access to applications and data from anywhere, ideal for remote work environments3.",
        //                 "Zero Trust Network Access: Ensures secure connections with identity-based access controls3.",
        //                 "Seamless Integration: Easily integrates with existing IT infrastructure for a unified security approach3.",
        //                 "Scalable and Flexible: Perfect for businesses of all sizes, offering flexibility and growth potential3."
        //             ]
        //         },
        //     ]
        // },
        // sophos:{
        //     image:'/sophos.png',
        //     description:{
        //         title:'Secure Your Business with Sophos Networks',
        //         intro:'Empower your network with Sophos Networks’ advanced security solutions. ||Known for their innovative and comprehensive protection, Sophos Networks offers robust security against the most sophisticated cyber threats. Whether you need implementation or consultancy, our expert team is ready to provide customized solutions that ensure your network remains secure and efficient.',
        //         question:'Why Choose Sophos Networks?',
        //         importance:[
        //             "Next-Gen Security: Benefit from advanced threat protection and real-time threat intelligence.",
        //             "Comprehensive Coverage: Enjoy features like firewall, endpoint protection, and email security.",
        //             "Scalable Solutions: Perfect for businesses of all sizes, offering flexibility and growth potential.",
        //             "Expert Support: Our certified professionals provide end-to-end support for all your security needs."
        //         ]
        //     },
        //     data:[
        //         {
        //             id:0,
        //             image:'/xg.jpg',
        //             title:'Sophos XG Firewall',
        //             description:[
        //                 "Advanced Threat Protection: Combines deep learning and AI to detect and block the latest threats1.",
        //                 "Synchronized Security: Integrates seamlessly with Sophos Central for unified threat management1.",
        //                 "Easy Management: Intuitive interface and powerful reporting tools for simplified administration1.",
        //                 "High Performance: Delivers robust performance with low latency, ideal for SMB environments1."
        //             ]
        //         },
        //         {
        //             id:1,
        //             image:'/intercept.jpg',
        //             title:'Sophos Intercept X',
        //             description:[
        //                 "Next-Gen Endpoint Protection: Uses deep learning to prevent malware and ransomware attacks.",
        //                 "Exploit Prevention: Blocks exploit techniques used by attackers to gain control of systems.",
        //                 "Active Adversary Mitigations: Detects and stops active attacks in real-time.",
        //                 "Centralized Management: Managed through Sophos Central for streamlined security operations."
        //             ]
        //         },
        //         {
        //             id:2,
        //             image:'/sophos-central.webp',
        //             title:'Sophos Central',
        //             description:[
        //                 "Unified Security Platform: Manages all your Sophos products from a single, cloud-based console.",
        //                 "Automated Threat Response: Automatically responds to incidents, reducing the need for manual intervention.",
        //                 "Scalable and Flexible: Grows with your business, offering scalable security solutions.",
        //                 "Comprehensive Reporting: Provides detailed insights and reports for better decision-making."
        //             ]
        //         },
        //     ]
        // },
    }
    const [data, setdata] = useState(products.cisco.data);
    const [details, setdetails] = useState(products.cisco.description);
    
    useEffect(() => {
        const val = window.location.href.split("?")[1];
        const search = val? val.split("=")[1]:"";
        if (search.includes('surveillancesystems')) {
            setdata(Object.values(products)[0].data);
            setdetails(Object.values(products)[0].description);
        } else if (search.includes('iotsystems')) {
            setdata(Object.values(products)[1].data);
            setdetails(Object.values(products)[1].description);
        }
    }, []);
    
    useEffect(() => {
        setothers(data.filter((item, index) => index !== main));
    }, [main,data])
    
    



  return (
    <div className='w-full relative'>
        <div className='min-h-[650px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni z-[-10]'></div>
        <div className='min-h-screen w-full absolute'>
        <StarsCanvas /></div>
        {/* <p className='mt-48'>safdas</p> */}
       <div className='min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto '>
            <div className=''>
            <div className='w-full h-full py-[19vh]  '>
        <div className=' w-[90%] xl:w-[1280px] mx-auto flex flex-col xl:flex-row '>
                <div className='xl:w-[50%] flex flex-col justify-around gap-10 z-30 order-2 xl:order-1'>
                    <strong className='text-2xl xl:text-[36px] font-bold xl:leading-[45px] font-sans'>Transform Your World with Cutting-Edge Digital Solutions</strong>
                    <p className='pr-10 font-medium'>Step into the future with our comprehensive Digital services! <br></br><br></br>From advanced Surveillance Systems that ensure security and peace of mind, to innovative IoT solutions that connect and automate your environment, we provide the technology that empowers your business. Experience seamless integration, enhanced efficiency, and unparalleled control with our state-of-the-art digital offerings</p>
                    <div className='flex gap-6'>
                    <button className='align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-sm'>Book Free Consultation</button>
                    <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Explore</span> <EastIcon fontSize='inherit'/></button>
                    </div>
                </div>
                <div className='xl:w-[50%] flex justify-center items-center z-30 order-1 xl:order-2'>
                    <div className='flex justify-center mb-12 xl:flex-wrap items-center'>
                    {
                    Object.values(products).map((product,index) =>( <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl ' key={index} onClick={() => {setdata(product.data); setdetails(product.description)}}><a href='#details' className='cursor-pointer hover:mix-blend-plus-darker'><img src={product.image} alt='cisco' className='w-full  hover:opacity-70'/></a></div>))
                    }
                    </div>
                </div>
            </div> 


            <div className=' w-[90%] xl:w-[1280px] mx-auto flex flex-col xl:flex-row pt-36 gap-6    ' id='details'>
                {/* <div className=' flex flex-col basis-1/3 py-10 mr-3 gap-10 z-30 '>
                    <h2 className='text-4xl font-semibold mb-5 font-sans'>{details.title}</h2>
                    <p className='pr-10 '>{details.intro.split("||")[0]}<br></br><br></br>{details.intro.split("||")[1]}</p>
                    <strong>{details.question}</strong>
                    <div className='w-full  flex flex-col gap-4 pl-3 pr-10 text-sm'>
                    {
                        details.importance.map((item, index) => {
                            return <li key={index} className='box-border'><strong>{item.split(':')[0]}:</strong> {item.split(':')[1]}</li>
                        })
                    }
                </div>  
                
                </div> */}
                {
                    data.map((item, index) =>( 
                        <div className=' flex flex-col basis-1/3 justify-between items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]' key={index}>

                        {<div className=' flex flex-col  justify-center items-start gap-10 '>
                        <img src={item.image} alt={item.title} className='w-full rounded-md'/>
                        <h2 className='text-2xl font-semibold font-sans'>{item.title}</h2>
                        <div className='w-full flex flex-col gap-4 pr-3 '>
                        {
                                item.description.map((item, index) => {
                                    return <p key={index} className='box-border'>{item.split("||").map((item, index) => <span key={index}>{item}<br></br></span>)}</p>
                                })
                            }
                        </div></div>}
                        
                        <div className='flex justify-center gap-6 my-16'>
                        <button className=' text-sm hover:opacity-70 bg-[#446E6D] text-white rounded py-2 px-4'>Get it today!</button>
                        <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Discover</span> <EastIcon fontSize='inherit'/></button>
                        </div>
                            
                        </div>
                    ))
                }
                {/* <div className=' flex flex-col basis-1/3 justify-between items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>

                {<div className=' flex flex-col  justify-center items-start gap-10 '>
                <img src={data[main].image} alt={data[main].title} className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>{data[main].title}</h2>
                <div className='w-full flex flex-col gap-4 pr-3 '>
                {
                        data[main].description.map((item, index) => {
                            return <p key={index} className='box-border'>{item.split("||")[0]}<br></br><br></br>{item.split("||")[1]}</p>
                        })
                    }
                </div></div>}
                
                <div className='flex justify-center gap-6 my-16'>
                <button className=' text-sm hover:opacity-70 bg-[#446E6D] text-white rounded py-2 px-4'>Get it today!</button>
                <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Discover</span> <EastIcon fontSize='inherit'/></button>
                </div>
                    
                </div> */}
                {/* <div className='basis-1/3 flex flex-col gap-8'> */}

                {/* {others.length > 0 && others.map((item, index) => (
                    <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px] cursor-pointer hover:opacity-70' key={index} onClick={() => setmain(item.id)}>
                    <img src={item.image} alt={item.title} className='w-full rounded-md'/>
                    <h2 className='text-2xl font-semibold font-sans'>{item.title}</h2>
                </div>
                ))} */}
                {/* </div> */}
            {/* {console.log(others)} */}
                {/* <div className='w-full flex flex-col gap-4 pl-3 '>
                    {
                        others[1].description.map((item, index) => {
                            return <li key={index} className='box-border'><strong>{item.split(':')[0]}:</strong> {item.split(':')[1]}</li>
                        })
                    }
                </div> */}
            </div> 
            <Projects/>
            <Industies/>
            <div className='w-[90%] xl:w-full mx-auto'>
                <CaseStudy/>
            </div>
            </div>
        </div>

       </div>
       
    </div>
  )
}
