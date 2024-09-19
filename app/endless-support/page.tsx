"use client"
import React,{useState, useEffect} from 'react'
import StarsCanvas from '@/components/main/StarBackground'
import EastIcon from '@mui/icons-material/East';
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
            image:'/spt.jpg',
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
                    image:'/spt.jpg',
                    title:'Premier IT Consulting Service',
                    description:[
                        "Step into the future of security with AI-enabled Surveillance Systems.|| ||These advanced systems leverage artificial intelligence to provide unparalleled protection and efficiency. With features like real-time video analytics, facial recognition, and behavior analysis, AI-powered surveillance can detect and respond to potential threats instantly. Whether it’s identifying suspicious activities, tracking objects of interest, or providing detailed insights, these systems ensure comprehensive monitoring and enhanced safety. Experience the next level of security with intelligent, automated, and highly accurate surveillance solutions designed to keep your environment secure 24/7."
                    ]
                },
                {
                    id:1,
                    image:'/spt.jpg',
                    title:'Premier IT Consulting Service',
                    description:[
                        "Unlock the full potential of your business with our Premier IT Consulting Service.|| Our seasoned consultants provide strategic insights and tailored solutions to optimize your IT infrastructure, enhance cybersecurity, and drive innovation. Whether you’re looking to streamline operations or adopt cutting-edge technologies, we offer expert guidance every step of the way."
                    ]
                },
                {
                    id:2,
                    image:'/spt.jpg',
                    title:'Support Service',
                    description:[
                        "Experience unparalleled support with our dedicated Support Service.|| Our team of skilled technicians is available 24/7 to address any technical issues, perform routine maintenance, and ensure your systems are running smoothly. From troubleshooting to comprehensive system checks, we are committed to providing prompt and effective solutions to keep your business operational and efficient."
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
                    title:'Technical Troubleshooting',
                    description:[
                        "Unlock the full potential of your business with our cutting-edge IoT Systems.|| ||Seamlessly connect devices, automate processes, and gather real-time data to drive smarter decisions and enhance efficiency. From smart homes to industrial automation, our IoT solutions provide unparalleled control and insight, transforming the way you operate. Experience the future of connectivity with intelligent systems that adapt to your needs, optimize performance, and propel your business into the digital age."
                    ]
                },
                {
                    id:1,
                    image:'/cs.jpg',
                    title:'Technical Troubleshooting',
                    description:[
                        "Our Technical Troubleshooting service ensures that any technical issues you encounter are resolved swiftly and efficiently.|| Whether it’s software glitches, hardware malfunctions, or connectivity problems, our expert technicians are available 24/7 to diagnose and fix issues, minimizing downtime and keeping your operations running smoothly."
                    ]
                },
                {
                    id:2,
                    image:'/cs.jpg',
                    title:'Routine Maintenance',
                    description:[
                        "Prevent issues before they arise with our Routine Maintenance service.|| We perform regular system checks, updates, and optimizations to ensure your IT infrastructure remains in peak condition. From software updates to hardware inspections, our proactive approach helps maintain system reliability and performance, reducing the risk of unexpected disruptions.."
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
        <div className='min-h-[650px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni'></div>
        <div className='min-h-screen w-full absolute'>
        <StarsCanvas /></div>
        {/* <p className='mt-48'>safdas</p> */}
       <div className='min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto '>
            <div className=''>
            <div className='w-full h-full py-[19vh]  '>
        <div className=' w-[1280px] mx-auto flex '>
                <div className='w-[50%] flex flex-col justify-around gap-10 z-30'>
                    <strong className='text-[36px] font-bold leading-[45px] font-sans'>Endless Support: Your 24/7 Tech Lifeline
                    </strong>
                    <p className='pr-10 font-medium'>At Endless Support, we believe in providing seamless, round-the-clock assistance to keep your technology running smoothly.<br></br> <br></br>Our dedicated team of experts is always ready to troubleshoot, guide, and resolve any issues, ensuring your devices and systems are always at their best. Experience uninterrupted productivity and peace of mind with our reliable and efficient support services.</p>
                    <div className='flex gap-6'>
                    <button className='align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-sm'>Book Free Consultation</button>
                    <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Explore</span> <EastIcon fontSize='inherit '/></button>
                    </div>
                </div>
                <div className='w-[50%] flex justify-center items-center z-30'>
                    <div className='flex justify-center flex-wrap items-center'>
                    {
                    Object.values(products).map((product,index) =>( <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl ' key={index} onClick={() => {setdata(product.data); setdetails(product.description)}}><a href='#details' className='cursor-pointer hover:mix-blend-plus-darker'><img src={product.image} alt='cisco' className='w-full  hover:opacity-70'/></a></div>))
                    }
                    </div>
                </div>
            </div> 


            <div className=' w-[1280px] mx-auto flex pt-36   ' id='details'>
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

            </div>
        </div>

       </div>
       
    </div>
  )
}
