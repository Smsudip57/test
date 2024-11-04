"use client"
import React,{useState, useEffect} from 'react'
import StarsCanvas from '@/components/main/StarBackground'
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
            image:'/consult.png',
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
                    image:'/consult.png',
                    title:'Premier IT Consulting Service',
                    description:[
                        "Unlock the full potential of your business with our Premier IT Consulting Service.|| || Our seasoned consultants provide strategic insights and tailored solutions to optimize your IT infrastructure, enhance cybersecurity, and drive innovation. Whether you’re looking to streamline operations or adopt cutting-edge technologies, we offer expert guidance every step of the way."
                    ]
                },
                {
                    id:1,
                    image:'/spt.jpg',
                    title:'IT Infrastructure Optimization',
                    description:[
                        "Enhance your business efficiency with our IT Infrastructure Optimization services.|| || We assess your current systems, identify bottlenecks, and implement solutions to streamline operations. From network upgrades to server management, we ensure your IT infrastructure is robust, scalable, and aligned with your business goals."
                    ]
                },
                {
                    id:2,
                    image:'/rms.jpg',
                    title:'Routine Maintenance',
                    description:[
                        "Prevent issues before they arise with our Routine Maintenance service.|| We perform regular system checks, updates, and optimizations to ensure your IT infrastructure remains in peak condition. From software updates to hardware inspections, our proactive approach helps maintain system reliability and performance, reducing the risk of unexpected disruptions."
                    ]
                },
            ]
        },
        fortinet:{
            image:'/cs.jpg',
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
                    image:'/cs.jpg',
                    title:'Support Service',
                    description:[
                        "Experience unparalleled support with our dedicated Support Service.|| || Our team of skilled technicians is available 24/7 to address any technical issues, perform routine maintenance, and ensure your systems are running smoothly. From troubleshooting to comprehensive system checks, we are committed to providing prompt and effective solutions to keep your business operational and efficient."
                    ]
                },
                {
                    id:1,
                    image:'/annual-maintenance-contract-500x500.webp',
                    title:'Annual Maintenance Contract (AMC)',
                    description:[
                        "Ensure your IT infrastructure runs smoothly year-round with our comprehensive AMC services.|| We provide regular maintenance, timely updates, and proactive monitoring to prevent issues before they arise. Our AMC packages are designed to minimize downtime, enhance performance, and extend the lifespan of your equipment, giving you peace of mind and allowing you to focus on your core business activities."
                    ]
                },
                {
                    id:2,
                    image:'/ose.jpg',
                    title:'In-House Engineer Support',
                    description:[
                        "Experience the convenience and reliability of having dedicated in-house engineers at your service. ||Our skilled professionals are on-site to provide immediate assistance, troubleshoot issues, and implement solutions tailored to your specific needs. With our in-house engineer support, you benefit from quick response times, personalized service, and a deep understanding of your IT environment, ensuring optimal performance and security."
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
                    <strong className='text-2xl xl:text-[36px] font-bold xl:leading-[45px] font-sans'>Endless Support: Your 24/7 Tech Lifeline
                    </strong>
                    <p className='pr-10 font-medium'>At Endless Support, we believe in providing seamless, round-the-clock assistance to keep your technology running smoothly.<br></br> <br></br>Our dedicated team of experts is always ready to troubleshoot, guide, and resolve any issues, ensuring your devices and systems are always at their best. Experience uninterrupted productivity and peace of mind with our reliable and efficient support services.</p>
                    <div className='flex gap-6'>
                    <button className='align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-sm'>Book Free Consultation</button>
                    <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Explore</span> <EastIcon fontSize='inherit '/></button>
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
                        <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Discover</span> <EastIcon fontSize='inherit '/></button>
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
                <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Discover</span> <EastIcon fontSize='inherit '/></button>
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
