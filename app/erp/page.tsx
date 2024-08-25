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
        cisco:{
            image:'/micro-d.jpg',
            description:{
                title:'Microsoft 365: Empower Your Modern Workplace',
                intro:'Unlock the full potential of your business with Microsoft 365. Seamlessly integrate productivity tools, enhance collaboration, and ensure top-notch security—all in one powerful suite. Whether you’re working from the office or remotely, Microsoft 365 keeps your team connected and productive with innovative features like real-time co-authoring, advanced data analytics, and AI-driven insights.||Discover how Microsoft 365 can revolutionize your workplace. Get Started Now',
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
                    image:'/m-b.jpg',
                    title:'Dynamics 365 Business Central',
                    description:[
                        "All-in-One Solution: Integrates finance, sales, service, and operations into a single, easy-to-use application.",
                        "Scalable and Flexible: Grows with your business, offering both cloud and on-premise deployment options.",
                        "Real-Time Insights: Provides real-time data and analytics to support informed decision-making.",
                        "Enhanced Productivity: Streamlines business processes and automates routine tasks."
                    ]
                    
                },
                {
                    id:1,
                    image:'/m-s.jpg',
                    title:'Dynamics 365 Sales',
                    description:[
                        "AI-Driven Insights: Uses AI to provide actionable insights and predictive analytics for better sales outcomes.",
                        "Customer Engagement: Enhances customer relationships with personalized interactions and advanced relationship insights.",
                        "Sales Automation: Automates sales processes to increase efficiency and reduce manual work.",
                        "Mobile Access: Allows sales teams to access critical data and tools on the go."
                    ]
                    
                },
                {
                    id:2,
                    image:'/m-c.jpg',
                    title:'Dynamics 365 Customer Service',
                    description:[
                        "Omni-Channel Engagement: Supports customer interactions across multiple channels, including chat, email, and social media.",
                        "AI-Powered Assistance: Utilizes AI to provide intelligent recommendations and automate routine service tasks.",
                        "Unified Customer View: Offers a 360-degree view of customer interactions and history for personalized service.",
                        "Self-Service Options: Provides customers with self-service portals and knowledge bases for quick issue resolution."
                    ]
                    
                    
                },
            ]
        },
        fortinet:{
            image:'/odoo-erp.jpg',
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
                    id:1,
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
                {
                    id:2,
                    image:'/odooi.jpg',
                    title:'Odoo Accounting',
                    description:[
                        "Real-Time Financial Reporting: Instant access to financial reports and dashboards.",
                        "Automated Invoicing: Generate and send invoices automatically.",
                        "Bank Synchronization: Syncs with bank accounts for real-time transaction updates.",
                        "Multi-Currency Support: Handles transactions in multiple currencies.",
                        "Tax Management: Comprehensive tax management features for compliance."
                    ]
                },
            ]
        },
        paloalto:{
            image:'/Oracle.jpg',
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
                    image:'/onet.jpg',
                    title:'Oracle NetSuite',
                    description:[
                        "Comprehensive Cloud Solution: All-in-one cloud ERP solution that integrates financials, CRM, e-commerce, and more.",
                        "Scalability: Easily scalable to grow with your business, supporting multiple subsidiaries, currencies, and languages.",
                        "Real-Time Visibility: Provides real-time dashboards and analytics for better decision-making.",
                        "Automation: Automates key business processes to improve efficiency and reduce manual errors."
                    ]
                },
                {
                    id:1,
                    image:'/of.jpg',
                    title:'Oracle Fusion Cloud ERP',
                    description:[
                        "AI and Machine Learning: Leverages AI and machine learning to automate routine tasks and provide predictive insights.",
                        "Integrated Suite: Comprehensive suite covering financial management, procurement, project management, and more.",
                        "Continuous Innovation: Regular updates and new features to keep your business ahead of the curve.",
                        "User-Friendly Interface: Modern, intuitive interface designed for ease of use and productivity."
                    ]
                },
                {
                    id:2,
                    image:'/ojd.jpg',
                    title:'Oracle JD Edwards EnterpriseOne',
                    description:[
                        "Flexible Deployment: Available on-premise, in the cloud, or as a hybrid solution.",
                        "Industry-Specific Solutions: Tailored solutions for various industries, including manufacturing, construction, and distribution.",
                        "Mobile Capabilities: Mobile applications for on-the-go access to critical business data.",
                        "Robust Analytics: Advanced analytics and reporting tools for in-depth business insights."
                    ]
                },
            ]
        },
        sophos:{
            image:'/s-sap-erp.png',
            description:{
                title:'Transform Your Business with SAP Solutions',
                intro:'Unleash the full potential of your enterprise with SAP\'s powerful technology.||SAP\'s integrated solutions are designed to streamline operations, improve efficiency, and drive growth across your organization. Whether you need implementation, consultancy, or continuous support, our expert team is here to deliver customized SAP solutions that align with your business goals and ensure long-term success.',
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
                    image:'/SAP Business One.png',
                    title:'SAP Business One',
                    description:[
                        "Affordable and Comprehensive: A single, affordable solution for managing your entire business, from accounting and financials to inventory and customer relationships.",
                        "Real-Time Insights: Integrated business intelligence for real-time data access and strategic decision-making.",
                        "Flexible Deployment: Available on-premise or in the cloud, allowing for quick deployment and scalability.",
                        "Enhanced Efficiency: Streamlined processes and greater visibility across all departments."
                    ]
                    
                },
                {
                    id:1,
                    image:'/SAP S4 Hana Cloud.jpg',
                    title:'SAP S/4HANA Cloud',
                    description:[
                        "Intelligent ERP: Combines AI and machine learning to automate and optimize business processes.",
                        "Real-Time Analytics: Provides real-time insights and analytics to support data-driven decision-making.",
                        "Scalability: Easily scalable to grow with your business, supporting new markets, models, and currencies.",
                        "User-Friendly Interface: Modern, intuitive user interface designed for ease of use and productivity."
                    ]
                    
                },
                {
                    id:2,
                    image:'/SAP_Business_ByDesign-1.jpg',
                    title:'SAP Business ByDesign',
                    description:[
                        "All-in-One Cloud Solution: Comprehensive cloud ERP solution designed specifically for mid-sized businesses.",
                        "Integrated Suite: Covers financials, human resources, sales, procurement, customer service, and supply chain management.",
                        "Built-In Analytics: Embedded analytics for real-time business insights and performance tracking.",
                        "Rapid Implementation: Quick and easy to implement, with minimal disruption to your business."
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
        <div className='w-full h-full py-[20vh]  '>
    <div className=' w-[1280px] mx-auto flex '>
            <div className='w-[50%] flex flex-col justify-center gap-10 z-30'>
                <strong className='text-[44px] font-bold leading-[52px] font-sans'>Transform Your Business with Next-Gen ERP Solutions</strong>
                <p className='pr-10 font-medium'>In the complex world of business management, simplicity is the ultimate sophistication.<br></br><br></br>  ERP software—a game-changer that integrates every aspect of your operations into a single, seamless platform. In the constellation of business tools, ERP software shines as the supernova of operational excellence. It’s not just a system; it’s the nucleus of your enterprise, orchestrating a symphony of streamlined processes and integrated data.</p>
                <div className='flex gap-6'>
                    <button className='align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-sm'>Book Free Consultation</button>
                    <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Explore</span> <EastIcon fontSize='inherit '/></button>
                    </div>
            </div>
            <div className='w-[50%] flex justify-center items-center z-30'>
                <div className='flex justify-center flex-wrap items-center'>
                {
                    Object.values(products).map((product,index) =>( <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl ' onClick={() => {setdata(product.data); setdetails(product.description)}}><a href='#details' className='cursor-pointer hover:mix-blend-plus-darker'><img src={product.image} alt='cisco' className='w-full  hover:opacity-70'/></a></div>))
                    }
                </div>
            </div>
        </div> 


    <div className=' w-[1280px] mx-auto flex pt-48' id='details'>
            <div className=' flex flex-col basis-1/3 pt-10 mr-3 gap-10 z-30 '>
            <h2 className='text-4xl font-semibold mb-5 font-sans'>{details.title}</h2>
            <p className='pr-10 '>{details.intro.split("||")[0]}<br></br><br></br>{details.intro.split("||")[1]}</p>
            </div>
            {/* <video src='/video_CRM.webm' className='border-[1px] border-gray-400' autoPlay loop></video> */}
            <div className=' flex flex-col basis-1/3 justify-center items-start gap-8 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
            {/* <img src='/cisco-r.jpg' alt='cisco' className='w-full rounded-md'/> */}

            {<div className=' flex flex-col  justify-center items-start gap-10 '>
                {data[main].image==="/video_CRM.webm"?<video src='/video_CRM.webm' className='border-[1px] border-gray-400' autoPlay loop></video>:<img src={data[main].image} alt={data[main].title} className='w-full rounded-md'/>}
                <h2 className='text-2xl font-semibold font-sans'>{data[main].title}</h2>
                <div className='w-full flex flex-col gap-4 pl-3 text-sm'>
                {
                        data[main].description.map((item, index) => {
                            return <li key={index} className='box-border'><strong>{item.split(':')[0]}:</strong> {item.split(':')[1]}</li>
                        })
                    }
                </div></div>
            }
            <div className='flex justify-center gap-6 my-16'>
                <button className=' text-sm hover:opacity-70 bg-[#446E6D] text-white rounded py-2 px-4'>Get it today!</button>
                <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Discover</span> <EastIcon fontSize='inherit '/></button>
                </div>
            </div>
            <div className='basis-1/3 flex flex-col gap-8'>
            {others.length > 0 && others.map((item, index) => (
                    <div className='flex flex-col justify-center gap-10 z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px] cursor-pointer hover:opacity-70' key={index} onClick={() => setmain(item.id)}>
                    {item.image==="/video_CRM.webm"?<video src='/video_CRM.webm' className='border-[1px] border-gray-400' autoPlay loop></video>:<img src={item.image} alt={item.title} className='w-full rounded-md'/>}
                    <h2 className='text-2xl font-semibold font-sans'>{item.title}</h2>
                </div>
                ))}
            </div>
        
        </div> 

        </div>
    </div>

   </div>
   
</div>
  )
}
