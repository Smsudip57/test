"use client"
import React,{useState, useEffect } from 'react'
import StarsCanvas from '@/components/main/StarBackground'
import EastIcon from '@mui/icons-material/East';
import Projects from '@/components/main/Projects';
import Industies from '@/components/main/Industies';
import CaseStudy from '@/components/main/CaseStudy';
import { useSearchParams } from 'next/navigation';

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
            image:'/nextjs.jpg',
            description:{
                title:'Crafting Your Digital Gateway: –',
                intro:'Website development isn’t just about building a site; it’s about crafting a portal to possibilities. ||A website is more than just a web address.It’s a 24/7 ambassador, tirelessly working to showcase your products and services to a global audience. It’s the silent salesman that never sleeps, the brand beacon that shines bright in the crowded online marketplace.',
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
                    image:'/nextjs.jpg',
                    title:'Website Development',
                    description:[
                        "We create stunning, high-performing websites that captivate your audience and drive your business forward.|| In the bustling bazaar of the digital world, your website is your storefront, your billboard, and your business card rolled into one. It’s the heartbeat of your online presence and the digital handshake that greets every potential customer."
                    ]
                },
                {
                    id:1,
                    image:'/ew.jpg',
                    title:'E-commerce Website',
                    description:[
                        "Unlock the potential of your online store with our dynamic ecommerce website solutions.|| We design and develop user-friendly, visually appealing platforms that drive sales and enhance customer experience. From seamless navigation to secure payment gateways, our ecommerce websites are built to convert visitors into loyal customers."
                    ]
                },
                {
                    id:2,
                    image:'/bwb.jpg',
                    title:'Business Website',
                    description:[
                        "Elevate your business with a professional website that showcases your brand’s strengths.|| Our business websites are designed to impress, with sleek designs, intuitive navigation, and powerful functionality. Whether you’re a startup or an established company, we create digital experiences that resonate with your audience and drive growth."
                    ]
                },
            ]
        },
        fortinet:{
            image:'/expt.jpg',
            description:{
                title:'Crafting Your Digital Gateway: –',
                intro:'Mobile app development isn’t just about building a site; it’s about crafting a portal to possibilities.|| A website is more than just a web address.It’s a 24/7 ambassador, tirelessly working to showcase your products and services to a global audience. It’s the silent salesman that never sleeps, the brand beacon that shines bright in the crowded online marketplace.',
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
                    image:'/expt.jpg',
                    title:'Mobile App Development',
                    description:[
                        "Transform your business with our cutting-edge mobile app development services. ||We specialize in creating intuitive, high-performance mobile applications that deliver seamless user experiences across all devices. Our team of expert developers and designers work closely with you to understand your unique needs and bring your vision to life. From concept to launch, we ensure every detail is meticulously crafted to engage your audience and drive results. Whether you need a robust enterprise solution or a sleek consumer app, we provide innovative, scalable, and secure mobile applications that set you apart in the competitive digital landscape.”"
                    ]
                },
                {
                    id:1,
                    image:'/bapp.jpg',
                    title:'Business Apps',
                    description: [
                       "Empower your business with our state-of-the-art mobile app development services.|| We specialize in creating bespoke business applications that streamline operations, enhance productivity, and drive growth. Our expert team collaborates with you to understand your unique business needs and crafts tailored solutions that integrate seamlessly with your existing systems. From project management and communication tools to finance and analytics apps, we deliver high-performance, secure, and scalable mobile applications that transform the way you do business. Experience the future of business efficiency with our innovative mobile app solutions.”"
                    ]
                },
                {
                    id:2,
                    image:'/capp.jpg',
                    title:'Consumer Apps',
                    description:[
                        "Revolutionize the way consumers interact with your brand through our cutting-edge mobile app development services.|| We specialize in creating engaging, user-friendly consumer applications that captivate and retain your audience. Our team of skilled developers and designers work closely with you to understand your target market and deliver personalized solutions that meet their needs. From e-commerce and social networking to health and entertainment, we build high-performance, secure, and scalable mobile apps that provide seamless experiences across all devices. Elevate your brand’s digital presence and connect with your customers like never before with our innovative consumer mobile app solutions."
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
        //     ]np
        // },
    }
    const [data, setdata] = useState(products.cisco.data);
    const [details, setdetails] = useState(products.cisco.description);
    
    
    useEffect(() => {
        const val = window.location.href.split("?")[1];
        const search = val? val.split("=")[1]:"";
        if (search.includes('webdev')) {
            setdata(Object.values(products)[0].data);
            setdetails(Object.values(products)[0].description);
        } else if (search.includes('appdev')) {
            setdata(Object.values(products)[1].data);
            setdetails(Object.values(products)[1].description);
        }
    }, []);


    useEffect(() => {
        
        setothers(data.filter((item, index) => index !== main));
    }, [main,data])
    
    



  return (
    <div className='w-full relative'>
        <div className='min-h-[700px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni'></div>
        <div className='min-h-screen w-full absolute'>
        <StarsCanvas /></div>
        {/* <p className='mt-48'>safdas</p> */}
       <div className='min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto '>
            <div className=''>
            <div className='w-full h-full py-[19vh]  '>
        <div className=' w-[90%] xl:w-[1280px] mx-auto flex flex-col xl:flex-row '>
                <div className='xl:w-[50%] flex flex-col justify-around gap-10 z-30 order-2 xl:order-1'>
                    <strong className='text-2xl xl:text-[36px] font-bold xl:leading-[45px] font-sans'>Unleash Your Brand’s Potential with Premier Website and Mobile App Development</strong>
                    <p className='pr-10 font-medium'>Discover the power of exceptional branding with our top-tier website and mobile app development services.<br></br><br></br> We craft visually stunning websites and user-friendly mobile apps that not only represent your brand but also engage and delight your audience. Transform your digital presence and make a lasting impression.</p>
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
                                    return <p key={index} className='box-border'>{item.split("||")[0]}<br></br><br></br>{item.split("||")[1]}</p>
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
