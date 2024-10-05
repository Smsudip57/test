"use client"
import React,{useState, useEffect} from 'react'
import { useSearchParams } from 'next/navigation';
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
            image:'/m365.jpg',
            description:{
                title:'Transform your business with Microsoft Modern Workplace –',
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
                    image:'/m365.jpg',
                    title:'Microsoft 365',
                    description:[
                        "Unlock the full potential of your business with Microsoft 365.|| Seamlessly integrate powerful productivity tools like Word, Excel, and PowerPoint with advanced cloud services and robust security features. Collaborate in real-time, streamline workflows, and stay connected from anywhere with Microsoft Teams and SharePoint. Empower your team to achieve more with the ultimate suite of tools designed for modern business needs."
                    ]
                },
                {
                    id:1,
                    image:'/pbi.jpg',
                    title:'Power Apps',
                    description:[
                        "Unleash your creativity and transform your business with Power Apps!|| This powerful platform allows you to build custom applications effortlessly, enabling you to streamline processes, boost productivity, and drive innovation—all without writing a single line of code. Whether you’re automating workflows, creating data-driven apps, or enhancing user experiences, Power Apps empowers you to turn your ideas into reality quickly and efficiently."
                    ]
                },
                {
                    id:2,
                    image:'/share-m.jpg',
                    title:'Microsoft SharePoint',
                    description:[
                        "Empower your team with Microsoft SharePoint!|| This robust platform facilitates seamless collaboration, content sharing, and management across your organization. With SharePoint, you can create dynamic intranet sites, manage documents, and ensure everyone stays connected and productive from anywhere. Enhance your team’s efficiency with powerful tools for communication, project management, and data integration, all within a secure and user-friendly environment."
                    ]
                },
            ]
        },
        fortinet:{
            image:'/micro-t.jpg',
            description:{
                title:'Transform your business with Microsoft Modern Workplace –',
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
                    image:'/micro-t.jpg',
                    title:'Windows Virtual Desktop',
                    description:[
                        "Unlock the full potential of remote work with Windows Virtual Desktop. Seamlessly access your desktop and applications from any device, anywhere in the world. Experience unparalleled security, scalability, and productivity with a cloud-based solution designed to keep your business agile and efficient. Transform the way you work with Windows Virtual Desktop – where your office is wherever you are."
                    ]
                },
                {
                    id:1,
                    image:'/azr.jpg',
                    title:'Azure Virtual Desktop',
                    description:[
                        "Azure Virtual Desktop (formerly known as Windows Virtual Desktop) is a comprehensive desktop and application virtualization service hosted on Azure. It allows users to access virtualized Windows 11 and Windows 10 desktops and applications from anywhere, providing a secure and scalable solution. Key features include multi-session capabilities, cost optimization, and integration with Microsoft 365 Apps for enterprise."
                    ]
                },
                {
                    id:2,
                    image:'/w365.jpg',
                    title:'Windows 365',
                    description:[
                        "Windows 365 is a cloud-based service that delivers a personalized Windows experience from the cloud to any device. It simplifies the deployment and management of virtual desktops, offering a secure and consistent user experience. Windows 365 is designed to support hybrid work environments, enabling employees to access their desktop and applications from anywhere with ease."
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
        const search = val.split("=")[1];
        if (search.includes('mircosolf365')) {
            setdata(Object.values(products)[0].data);
            setdetails(Object.values(products)[0].description);
        } else if (search.includes('windowsvirtualdesktop')) {
            setdata(Object.values(products)[1].data);
            setdetails(Object.values(products)[1].description);
        }
    }, []);
    
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
                    <strong className='text-[36px] font-bold leading-[45px] font-sans'>Enhance Your Business with Modern Solutions – Secure and Flexible Work from Anywhere</strong>
                    <p className='pr-10 font-medium'>In the fast-paced world of modern business, staying ahead means embracing the latest in digital transformation.<br></br><br></br>Enter the Microsoft Modern Workplace—a suite of cutting-edge tools and technologies designed to empower your workforce and revolutionize the way you do business.</p>
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

            </div>
        </div>

       </div>
       
    </div>
  )
}
