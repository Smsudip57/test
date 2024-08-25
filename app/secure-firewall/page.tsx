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
            image:'/cisco.png',
            description:{
                title:'CISCO Firewall Solutions',
                intro:'Protect your business with industry-leading Cisco Firewall solutions. Our expert team ensures seamless implementation and top-notch consultancy services, tailored to your unique security needs.||Cisco Firewalls offer unparalleled protection against cyber threats, ensuring your data and operations remain safe and secure. Whether you need implementation or consultancy, our expert team is here to provide tailored solutions that meet your unique needs.',
                question:'Why Choose Cisco Firewalls?',
                importance:[
                    "Advanced Threat Defense: Stay ahead of cyber threats with real-time threat intelligence.",
                    "Advanced Threat Protection: Features next-gen IPS, URL filtering, and advanced malware protection.",
                    "Easy Management: Simplified management with Cisco Defense Orchestrator for streamlined operations.",
                    "Easy Management: Simplified management with Cisco Defense Orchestrator for streamlined operations."
                ]
            },
            data:[
                {
                    id:0,
                    image:'/cisco-r.jpg',
                    title:'Cisco Secure Firewall 1010',
                    description:[
                        "Compact and Powerful: Ideal for small businesses, offering robust security in a compact form factor.",
                        "Advanced Threat Protection: Features next-gen IPS, URL filtering, and advanced malware protection.",
                        "Advanced Threat Protection: Features next-gen IPS, URL filtering, and advanced malware protection."
                    ]
                },
                {
                    id:1,
                    image:'/cisco-f.jpg',
                    title:'Cisco Firepower 1120',
                    description:[
                        "Blazing Fast Performance: Achieve up to 2.3 Gbps firewall throughput for seamless data processing.",
                        "Advanced Threat Defense: Integrated with Cisco Talos for real-time threat intelligence and robust protection.",
                        "Scalable Security: Perfect for small to medium-sized businesses, offering flexibility and growth potential.",
                        "Comprehensive Protection: Combines firewall, intrusion prevention, and URL filtering in one powerful device.",
                        "Easy Management: Simplified deployment and management with Cisco Defense Orchestrator.",
                        "High VPN Capacity: Supports up to 150 VPN peers for secure remote access.",
                        "Efficient Design: Compact, rack-mountable form factor with low power consumption."
                    ]
                },
                {
                    id:2,
                    image:'/cisco-m.jpg',
                    title:'Cisco Meraki MX67',
                    description:[
                        "High Performance: Enjoy up to 450 Mbps firewall throughput for fast and reliable network security.",
                        "Seamless Connectivity: Dual WAN uplinks for automatic failover and load balancing.",
                        "Advanced Security: Integrated threat management with Layer 7 firewall, content filtering, and Advanced Malware Protection (AMP).",
                        "Cloud-Managed: Simplified management through the intuitive Meraki Dashboard.",
                        "Zero-Touch Deployment: Easy setup with true zero-touch provisioning.",
                        "Comprehensive VPN: Supports Auto VPN and client VPN for secure remote access.",
                        "Scalable Solution: Ideal for small branches and remote offices, supporting up to 50 users.",
                        "Built-In Wireless: Optional models with 802.11ac Wi-Fi for seamless wireless connectivity."
                    ]
                },
            ]
        },
        fortinet:{
            image:'/fortinet.png',
            description:{
                title:'Fortify Your Network with FortiGate Firewalls',
                intro:'Experience unmatched security and performance with FortiGate Firewalls. ||Designed to protect your business from the most sophisticated cyber threats, FortiGate Firewalls offer comprehensive, multilayered security and deep visibility across your entire network. Whether you need implementation or consultancy, our expert team is ready to deliver tailored solutions that ensure your network remains secure and efficient.',
                question:'Why Choose FortiGate Firewalls?',
                importance:[
                    "High Performance: Benefit from scalable performance and low latency with purpose-built security processors.",
                    "Advanced Threat Protection: Stay protected with real-time threat intelligence and AI-powered security.",
                    "Comprehensive Security: Enjoy features like intrusion prevention, web filtering, and SSL inspection.",
                    "Seamless Integration: Easily integrates with your existing IT infrastructure for a unified security approach.",
                    "Expert Support: Our certified professionals provide end-to-end support for all your security needs."
                ]
            },
            data:[
                {
                    id:0,
                    image:'/fortigate-60f.png',
                    title:'FortiGate 60F',
                    description:[
                        "High Performance: Delivers up to 10 Gbps firewall throughput, ensuring fast and secure network traffic1.",
                        "Integrated SD-WAN: Combines security and networking capabilities for optimized application performance1.",
                        "Compact Design: Ideal for small offices with limited space, offering powerful protection in a small form factor1.",
                        "Easy Management: Simplified deployment and management through FortiOS, providing a unified security platform1."
                    ]
                },
                {
                    id:1,
                    image:'/fortinate80f.jpg',
                    title:'FortiGate 80F',
                    description: [
                        "Advanced Threat Protection: Equipped with AI-driven FortiGuard services for real-time threat detection and mitigation2.",
                        "Secure Remote Access: Supports VPN and Zero Trust Network Access (ZTNA) for secure remote work environments2.",
                        "Scalable Solution: Perfect for growing businesses, offering flexibility and scalability as your network expands2.",
                        "User-Friendly Interface: Intuitive management through the FortiGate Cloud, ensuring easy monitoring and control2."
                    ]
                },
                {
                    id:2,
                    image:'/fortinate40f.jpg',
                    title:'FortiGate 40F',
                    description:[
                        "Cost-Effective Security: Provides enterprise-grade security at an affordable price, ideal for small businesses3.",
                        "Comprehensive Protection: Includes firewall, VPN, and intrusion prevention in a single device3.",
                        "High Availability: Supports advanced clustering for maximum uptime and reliability3.",
                        "Cloud-Ready: Seamlessly integrates with cloud environments, ensuring secure connectivity and management3."
                    ]
                },
            ]
        },
        paloalto:{
            image:'/paltoalo.jpg',
            description:{
                title:'Elevate Your Security with Palo Alto Networks',
                intro:'Transform your network security with Palo Alto Networks. ||Known for their cutting-edge technology and innovative solutions, Palo Alto Networks provides comprehensive protection against the most advanced cyber threats. Whether you need implementation or consultancy, our expert team is ready to deliver customized solutions that ensure your network remains secure and resilient.',
                question:'Why Choose Palo Alto Networks?',
                importance:[
                    "Next-Generation Security: Leverage advanced threat prevention and real-time threat intelligence.",
                    "Comprehensive Protection: Benefit from integrated firewall, intrusion prevention, and URL filtering.",
                    "Scalable Solutions: Perfect for businesses of all sizes, offering flexibility and growth potential.",
                    "Expert Support: Our certified professionals provide end-to-end support for all your security needs."
                ]
            },
            data:[
                {
                    id:0,
                    image:'/pa-220.png',
                    title:'PA-220',
                    description:[
                        "Compact and Powerful: Delivers enterprise-grade security in a small form factor, perfect for small offices1.",
                        "Advanced Threat Prevention: Protects against known and unknown threats with real-time updates from WildFire1.",
                        "Easy Management: Simplified deployment and management through the intuitive web interface1.",
                        "Cost-Effective: Provides robust security features at an affordable price, ideal for SMBs."
                    ]
                },
                {
                    id:1,
                    image:'/PA820.png',
                    title:'PA-820',
                    description:[
                        "High Performance: Offers up to 940 Mbps firewall throughput, ensuring fast and secure network traffic2.",
                        "Comprehensive Security: Includes firewall, VPN, and intrusion prevention in a single device2.",
                        "Scalable Solution: Suitable for growing businesses, offering flexibility and scalability as your network expands2.",
                        "User-Friendly Interface: Intuitive management through Panorama, ensuring easy monitoring and control2."
                    ]
                },
                {
                    id:2,
                    image:'/prisma-Access-logo.png',
                    title:'Prisma Access',
                    description:[
                        "Cloud-Delivered Security: Provides secure access to applications and data from anywhere, ideal for remote work environments3.",
                        "Zero Trust Network Access: Ensures secure connections with identity-based access controls3.",
                        "Seamless Integration: Easily integrates with existing IT infrastructure for a unified security approach3.",
                        "Scalable and Flexible: Perfect for businesses of all sizes, offering flexibility and growth potential3."
                    ]
                },
            ]
        },
        sophos:{
            image:'/sophos.png',
            description:{
                title:'Secure Your Business with Sophos Networks',
                intro:'Empower your network with Sophos Networks’ advanced security solutions. ||Known for their innovative and comprehensive protection, Sophos Networks offers robust security against the most sophisticated cyber threats. Whether you need implementation or consultancy, our expert team is ready to provide customized solutions that ensure your network remains secure and efficient.',
                question:'Why Choose Sophos Networks?',
                importance:[
                    "Next-Gen Security: Benefit from advanced threat protection and real-time threat intelligence.",
                    "Comprehensive Coverage: Enjoy features like firewall, endpoint protection, and email security.",
                    "Scalable Solutions: Perfect for businesses of all sizes, offering flexibility and growth potential.",
                    "Expert Support: Our certified professionals provide end-to-end support for all your security needs."
                ]
            },
            data:[
                {
                    id:0,
                    image:'/xg.jpg',
                    title:'Sophos XG Firewall',
                    description:[
                        "Advanced Threat Protection: Combines deep learning and AI to detect and block the latest threats1.",
                        "Synchronized Security: Integrates seamlessly with Sophos Central for unified threat management1.",
                        "Easy Management: Intuitive interface and powerful reporting tools for simplified administration1.",
                        "High Performance: Delivers robust performance with low latency, ideal for SMB environments1."
                    ]
                },
                {
                    id:1,
                    image:'/intercept.jpg',
                    title:'Sophos Intercept X',
                    description:[
                        "Next-Gen Endpoint Protection: Uses deep learning to prevent malware and ransomware attacks.",
                        "Exploit Prevention: Blocks exploit techniques used by attackers to gain control of systems.",
                        "Active Adversary Mitigations: Detects and stops active attacks in real-time.",
                        "Centralized Management: Managed through Sophos Central for streamlined security operations."
                    ]
                },
                {
                    id:2,
                    image:'/sophos-central.webp',
                    title:'Sophos Central',
                    description:[
                        "Unified Security Platform: Manages all your Sophos products from a single, cloud-based console.",
                        "Automated Threat Response: Automatically responds to incidents, reducing the need for manual intervention.",
                        "Scalable and Flexible: Grows with your business, offering scalable security solutions.",
                        "Comprehensive Reporting: Provides detailed insights and reports for better decision-making."
                    ]
                },
            ]
        },
    }
    const [data, setdata] = useState(products.cisco.data);
    const [details, setdetails] = useState(products.cisco.description);
    
    
    
    useEffect(() => {
        setothers(data.filter((item, index) => index !== main));
    }, [main,data])
    
    



  return (
    <div className='w-full relative'>
        <div className='min-h-[80vh] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni'></div>
        <div className='min-h-screen w-full absolute'>
        <StarsCanvas /></div>
        {/* <p className='mt-48'>safdas</p> */}
       <div className='min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto '>
            <div className=''>
            <div className='w-full h-full py-[19vh]  '>
        <div className=' w-[1280px] mx-auto flex '>
                <div className='w-[50%] flex flex-col justify-around gap-10 z-30'>
                    <strong className='text-[44px] font-bold leading-[52px] font-sans'>Unlock the Power of Protection with Premier Network Security</strong>
                    <p className='pr-10 font-medium'>Embark on a journey to digital fortitude with Network Security, the cornerstone of modern business resilience.<br></br><br></br> In an era where cyber threats loom large, Network Security stands as the vanguard, shielding your enterprise’s lifeblood—its data. In today’s fast-paced digital world, safeguarding your business from cyber threats is more crucial than ever.  Network security is not just a tech requirement—it&apos;s a cornerstone of your business’s resilience and success.</p>
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
                <div className=' flex flex-col basis-1/3 py-10 mr-3 gap-10 z-30 '>
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
                
                </div>
                <div className=' flex flex-col basis-1/3 justify-between items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>

                {<div className=' flex flex-col  justify-center items-start gap-10 '>
                <img src={data[main].image} alt={data[main].title} className='w-full rounded-md'/>
                <h2 className='text-2xl font-semibold font-sans'>{data[main].title}</h2>
                <div className='w-full flex flex-col gap-4 pl-3 text-sm'>
                {
                        data[main].description.map((item, index) => {
                            return <li key={index} className='box-border'><strong>{item.split(':')[0]}:</strong> {item.split(':')[1]}</li>
                        })
                    }
                </div></div>}
                
                <div className='flex justify-center gap-6 my-16'>
                <button className=' text-sm hover:opacity-70 bg-[#446E6D] text-white rounded py-2 px-4'>Get it today!</button>
                <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Discover</span> <EastIcon fontSize='inherit '/></button>
                </div>
                    
                </div>
                <div className='basis-1/3 flex flex-col gap-8'>

                {others.length > 0 && others.map((item, index) => (
                    <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px] cursor-pointer hover:opacity-70' key={index} onClick={() => setmain(item.id)}>
                    <img src={item.image} alt={item.title} className='w-full rounded-md'/>
                    <h2 className='text-2xl font-semibold font-sans'>{item.title}</h2>
                </div>
                ))}
                </div>
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
