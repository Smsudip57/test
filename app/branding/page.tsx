"use client"
import React,{useState, useEffect} from 'react'
import StarsCanvas from '@/components/main/StarBackground'
import EastIcon from '@mui/icons-material/East';
interface DataItem {
    id: number;
    image: string;
    description: {
        title: string;
        intro: string;
        question: string;
        importance: string[];
    };
}


export default function Branding() {
    const [main, setmain] = useState(0)
    const [others, setothers] = useState<DataItem[]>([]);
    const products = {
        // cisco:{
        //     id:0,
        //     image:'/ew.jpg',
        //     description:{
        //         title:'Ecommerce Website',
        //         question:'',
        //         intro:'',
        //         importance:[
        //             "Mobile-Responsive Design: Ensure a seamless shopping experience across all devices with a design that adapts to any screen size.",
        //             "Personalized Shopping Experience: Use AI to offer personalized product recommendations and tailored content based on user behavior.",
        //             "Voice Search Optimization: Allow customers to search for products using voice commands, enhancing convenience and accessibility.",
        //             "Augmented Reality (AR) Integration: Enable customers to visualize products in their own space with AR, making online shopping more interactive.",
        //             "Social Commerce Integration: Connect your store with social media platforms for easy sharing and direct purchases from social feeds.",
        //             "One-Click Checkout: Simplify the purchasing process with a one-click checkout option, reducing cart abandonment rates.",
        //             "Advanced Product Filtering: Help customers find exactly what they need with detailed filters for size, color, price, and more.",
        //             "Customer Reviews and Ratings: Build trust and credibility with user-generated reviews and ratings for products.",
        //             "Live Chat Support: Provide instant assistance to customers with live chat support, improving customer service and satisfaction.",
        //             "Loyalty Programs and Rewards: Encourage repeat purchases with loyalty programs that offer rewards and discounts.",
        //             "Secure Payment Options: Offer multiple secure payment methods, including digital wallets, to cater to diverse customer preferences.",
        //             "Sustainability Badges: Highlight eco-friendly products with sustainability badges to attract environmentally conscious shoppers."
        //         ]
                
        //     },
        // },
        // fortinet:{
        //     id:1,
        //     image:'/seo1.jpg',
        //     description:{
        //         title:'SEO (Search Engine Optimization)',
        //         question:'',
        //         intro:'SEO (Search Engine Optimization) is essential for enhancing your website\'s visibility in the crowded online marketplace.||SEO increases traffic by optimizing your site, enhancing engagement, and building credibility. It’s about more than rankings—it\'s key for long-term success.',
        //         importance:[
                    
        //         ]
        //     },
        // },
        paloalto:{
            id:0,
            image:'/expt.jpg',
            description:{
                title:'Mobile App Development',
                intro:'No data yet',
                question:'',
                importance:[
                    // "Virtual Tours: Offer immersive 3D virtual tours of properties, allowing potential buyers to explore homes from the comfort of their own space.",
                    // "Dynamic Maps: Provide interactive maps with detailed neighborhood information, including schools, amenities, and public transport.",
                    // "AI-Powered Search: Utilize AI to deliver personalized property recommendations and enhance search capabilities.",
                    // "Mobile-First Design: Ensure a seamless browsing experience on all devices with a mobile-first design approach.",
                    // "Interactive Property Listings: Engage users with interactive property listings that include high-resolution images, videos, and floor plans.",
                    // "Live Chat Support: Offer instant assistance with live chat support, helping visitors with their queries in real-time.",
                    // "Advanced Filtering Options: Allow users to filter properties based on various criteria such as price, location, size, and amenities.",
                    // "Customer Reviews and Testimonials: Build trust with user-generated reviews and testimonials from satisfied clients.",
                    // "Sustainability Features: Highlight eco-friendly properties with sustainability badges and detailed information on green features.",
                    // "Secure Online Transactions: Provide secure options for online transactions, including digital signatures and payment gateways."
                ]
                
            },
        },
        sophos:{
            id:1,
            image:'/nextjs.jpg',
            description:{
                title:'Website Development',
                intro:'No data yet',
                question:'',
                importance:[
                    // "Interactive Project Portfolios: Showcase your best work with high-quality images, videos, and 3D models that visitors can explore.",
                    // "Virtual Tours: Offer immersive 3D virtual tours of completed projects, allowing potential clients to experience your work firsthand.",
                    // "Dynamic Maps: Provide interactive maps highlighting your project locations and key details about each site.",
                    // "Client Testimonials: Build trust with potential clients by featuring detailed testimonials and case studies from satisfied customers.",
                    // "Sustainability Highlights: Showcase your commitment to green building practices with dedicated sections on sustainability and LEED-certified projects.",
                    // "Live Chat Support: Offer instant assistance to visitors with live chat support, helping them with inquiries in real-time.",
                    // "Detailed Service Pages: Clearly outline your services with detailed descriptions, benefits, and examples of past projects.",
                    // "Mobile-Responsive Design: Ensure a seamless browsing experience on all devices with a mobile-first design approach.",
                    // "Blog and Resources: Provide valuable content through a blog and resource section, sharing industry insights, tips, and company news.",
                    // "Secure Client Portals: Offer clients a secure portal to access project updates, documents, and communication tools."
                ]
                
            },
        },
    }
    // const [Object.values(products), setdata] = useState(products.cisco.Object.values(products));
    // const [details, setdetails] = useState(products.cisco.description);
    
    
    
    useEffect(() => {
        setothers(Object.values(products).filter((item, index) => index !== main));
    }, [main])



  return (
    <div className='w-full relative'>
        <div className='min-h-[780px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni'></div>
        <div className='min-h-screen w-full absolute'>
        <StarsCanvas /></div>
        {/* <p className='mt-48'>safdas</p> */}
       <div className='min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto '>
            <div className=''>
            <div className='w-full h-full py-[19vh]  '>
        <div className=' w-[1280px] mx-auto flex '>
                <div className='w-[50%] flex flex-col justify-center gap-10 z-30'>
                    <strong className='text-[40px] font-bold leading-[52px] font-sans'>Elevate Your Brand with Exceptional Website Development, Mobile App Innovation, and SEO Excellence</strong>
                    <p className='pr-10 font-medium'>In today’s digital-first world, your website is the heart of your business.<br></br><br></br> We create stunning, high-performing websites that captivate your audience and drive your business forward. In the bustling bazaar of the digital world, your website is your storefront, your billboard, and your business card rolled into one. It’s the heartbeat of your online presence and the digital handshake that greets every potential customer.</p>
                    <div className='flex gap-6'>
                    <button className='align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded  hover:opacity-70 text-sm'>Book Free Consultation</button>
                    <button className='align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base'><span className='mr-1'>Explore</span> <EastIcon fontSize='inherit '/></button>
                    </div>
                </div>
                <div className='w-[50%] flex justify-center items-center z-30'>
                    <div className='flex justify-center flex-wrap items-center'>
                    {
                    Object.values(products).map((product,index) =>( <div className='text-center text-nowrap basis-[45%] m-3 shadow-gray-400 shadow-lg overflow-hidden rounded-md  text-3xl ' onClick={() => {setmain(index) }} key={index}><a href='#details' className='cursor-pointer hover:mix-blend-plus-darker'><img src={product.image} alt='cisco' className='w-full  hover:opacity-70'/></a></div>))
                    }
                    </div>
                </div>
            </div> 


        <div className=' w-[1280px] mx-auto flex pt-36 ' id='details'>
                <div className=' flex flex-col basis-1/3 pt-10 mr-3 gap-10 z-30 '>
                    <h2 className='text-4xl font-semibold mb-5 font-sans'>Crafting Your Digital Gateway: – </h2>
                    <p className='pr-10 font-medium'>Website development isn’t just about building a site; it’s about crafting a portal to possibilities. A website is more than just a web address.<br></br><br></br> It’s a 24/7 ambassador, tirelessly working to showcase your products and services to a global audience. It’s the silent salesman that never sleeps, the brand beacon that shines bright in the crowded online marketplace.</p>
                </div>
                <div className=' flex flex-col basis-1/3 justify-center items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]'>
                {<div className=' flex flex-col  justify-center items-start gap-10 '>
                {Object.values(products)[main].image==="/seo1.jpg"?<img src="/seo2.jpg" alt={Object.values(products)[main].description.title} className='w-full rounded-md'/>:<img src={Object.values(products)[main].image} alt={Object.values(products)[main].description.title} className='w-full rounded-md'/>}
                <h2 className='text-2xl font-semibold font-sans'>{Object.values(products)[main].description.title}</h2>
                {Object.values(products)[main].description.intro &&<p>{Object.values(products)[main].description.intro.split("||")[0]}<br></br><br></br>{Object.values(products)[main].description.intro.split("||")[1]}</p>}
                <div className='w-full flex flex-col gap-4 pl-3 text-sm'>
                {
                        Object.values(products)[main].description.importance.length>0&&Object.values(products)[main].description.importance.map((item, index) => {
                            return <li key={index} className='box-border'><strong>
                                {/* {item.split(':')[0]} */}
                                :</strong> 
                                {/* {item.split(':')[1]} */}
                                </li>
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
                    {item.image==="/video_CRM.webm"?<video src='/video_CRM.webm' className='border-[1px] border-gray-400' autoPlay loop></video>:<img src={item.image} alt={item.description.title} className='w-full rounded-md'/>}
                    <h2 className='text-2xl font-semibold font-sans'>{item.description.title}</h2>
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
