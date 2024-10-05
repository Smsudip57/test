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



export default function Work() {
    const [main, setmain] = useState(0)
    const [others, setothers] = useState<DataItem[]>([]);
    
    const products = {
        
        fortinet:{
            image:'/newerp.jpg',
            description:{
                title:'Unlock the full potential of your business with Odoo ERP – ',
                intro:'the all-in-one management software that streamlines operations, boosts productivity, and drives growth. Whether you’re looking to implement Odoo from scratch or need expert consultancy to optimize your existing setup, our team of certified professionals is here to guide you every step of the way.||Ready to revolutionize your business? Get Started Today!',
                question:'Why Choose Cisco Firewalls?',
                importance:[
                    "360-Degree Customer View: Centralize all customer interactions and data in one place.",
                    "Automated Follow-Ups: Never miss a lead with automated follow-up emails and reminders.",
                    "Pipeline Management: Visualize your sales pipeline and track progress with ease.",
                    "Customizable Dashboards: Tailor your dashboard to display the metrics that matter most to your business."
                ]
            },
            data:[
                {
                    id:0,
                    image:'/nerps.jpg',
                    title:'Unlock the full potential of your business with Odoo ERP –',
                    description:[
                        "the all-in-one management software that streamlines operations, boosts productivity, and drives growth. Whether you’re looking to implement Odoo from scratch or need expert consultancy to optimize your existing setup, our team of certified professionals is here to guide you every step of the way.||Ready to revolutionize your business? Get Started Today!"
                    ]
                },
                {
                    id:1,
                    image:'/video_CRM.webm',
                    title:'Odoo 17 CRM',
                    description:[
                        "360-Degree Customer View: Centralize all customer interactions and data in one place.",
                    "Automated Follow-Ups: Never miss a lead with automated follow-up emails and reminders.",
                    "Pipeline Management: Visualize your sales pipeline and track progress with ease.",
                    "Customizable Dashboards: Tailor your dashboard to display the metrics that matter most to your business."
                    ]
                },
                
                {
                    id:2,
                    image:'/odoom.jpg',
                    title:'Odoo Inventory',
                    description:[
                        "Double-Entry Inventory: Unique double-entry system for accurate stock tracking.",
                        "Barcode Scanning: Supports barcode scanning for quick and error-free operations.",
                        "Automated Replenishment: Automatically triggers reordering based on stock levels.",
                        "Multi-Warehouse Management: Manage multiple warehouses with ease.",
                        "Advanced Reporting: Detailed reports on inventory performance and stock movements."
                    ]
                    
                },
                // {
                //     id:2,
                //     image:'/odooi.jpg',
                //     title:'Odoo Accounting',
                //     description:[
                //         "Real-Time Financial Reporting: Instant access to financial reports and dashboards.",
                //         "Automated Invoicing: Generate and send invoices automatically.",
                //         "Bank Synchronization: Syncs with bank accounts for real-time transaction updates.",
                //         "Multi-Currency Support: Handles transactions in multiple currencies.",
                //         "Tax Management: Comprehensive tax management features for compliance."
                //     ]
                // },
            ]
        },
        paloalto:{
            image:'/nnetwork.jpg',
            description:{
                title:'Enhance Your Enterprise with Oracle Solutions',
                intro:'Elevate your business operations with Oracle\'s industry-leading technology.||Oracle\'s robust and scalable solutions are designed to optimize performance, streamline processes, and drive innovation across your organization. Whether you require implementation, consultancy, or ongoing support, our expert team is equipped to deliver tailored solutions that empower your enterprise to thrive in today’s competitive landscape.',
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
                    image:'/nnetwork.jpg',
                    title:'Fortify Your Digital Fortress with Our Network Security Solutions',
                    description:[
                        "Stay one step ahead of cyber threats with our cutting-edge network security services. ||From advanced firewall management to real-time intrusion detection and thorough vulnerability assessments, we ensure your digital assets are impenetrable. Protect your business with our robust, proactive security measures and enjoy peace of mind knowing your network is secure."
                    ]
                },
                {
                    id:1,
                    image:'/mfl.jpg',
                    title:'Managed Firewall Services',
                    description:[
                        "Protect your network with our Managed Firewall Services, offering comprehensive firewall management tailored to your business needs.|| Our experts handle everything from initial setup and configuration to ongoing monitoring and maintenance. We ensure your firewall is always up-to-date with the latest security patches and configurations, providing robust protection against unauthorized access and cyber attacks. Enjoy peace of mind knowing your network perimeter is fortified by industry-leading security measures."
                    ]
                },
                {
                    id:2,
                    image:'/pnv.jpg',
                    title:'Vulnerability Assessment & Penetration Testing',
                    description:[
                        "Ensure your network’s defenses are impenetrable with our Vulnerability Assessment & Penetration Testing services.|| Our experts conduct thorough assessments to identify potential weaknesses in your system, followed by simulated cyber-attacks to test your defenses. This proactive approach helps uncover vulnerabilities before they can be exploited, providing you with detailed reports and actionable recommendations to strengthen your security posture."
                    ]
                },
            ]
        },
            }
    const [data, setdata] = useState(products.fortinet.data);
    const [details, setdetails] = useState(products.fortinet.description);
    
    useEffect(() => {
        const val = window.location.href.split("?")[1];
        const search = val.split("=")[1];
        if (search.includes('erp')) {
            setdata(Object.values(products)[0].data);
            setdetails(Object.values(products)[0].description);
        } else if (search.includes('networksecurity')) {
            setdata(Object.values(products)[1].data);
            setdetails(Object.values(products)[1].description);
        }
    }, []);
    
    useEffect(() => {
        setothers(data.filter((item, index) => index !== main));
    }, [main,data])
    


  return (
    <div className='w-full relative'>
    <div className='min-h-[730px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni'></div>
    <div className='min-h-screen w-full absolute'>
    <StarsCanvas /></div>
    {/* <p className='mt-48'>safdas</p> */}
   <div className='min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto '>
        <div className=''>
        <div className='w-full h-full py-[20vh]  '>
    <div className=' w-[1280px] mx-auto flex '>
            <div className='w-[50%] flex flex-col justify-center gap-10 z-30'>
                <strong className='text-[44px] font-bold leading-[52px] font-sans'>Lead the Digital Era with State-of-the-Art Technology</strong>
                <p className='pr-10 font-medium'>In the complex world of business management, simplicity is the ultimate sophistication.<br></br><br></br>  Elevate your business with our top-tier Network Security and ERP Software services. Shield your digital assets with our advanced network security solutions, featuring state-of-the-art firewall management, real-time intrusion detection, and comprehensive vulnerability assessments. Simultaneously, revolutionize your operations with our ERP software, seamlessly integrating finance, HR, and supply chain into one powerful system. Experience unparalleled efficiency, enhanced decision-making, and robust growth with our tailored solutions designed for businesses of all sizes.</p>
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
                        {item.image==="/video_CRM.webm"?<video src='/video_CRM.webm'></video>:<img src={item.image} alt={item.title} className='w-full rounded-md'/>}
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
