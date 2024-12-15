"use client"
import React,{useState} from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CaseStudy from '@/components/main/CaseStudy';
const service = [
  {
    Name:"Branding",
    image:"/nextjs.jpg",
    url:"/branding?search=webdev#details",
  },
  {
    Name:"Branding",
    image:"/expt.jpg",
    url:"/branding?search=appdev#details",
  },
  {
    Name:"Workfrom Anywhere",
    image:"/m365.jpg",
    url:"work-from-anywere?search=microsolft365#details",
  },
  {
    Name:"Workfrom Anywhere",
    image:"/micro-t.jpg",
    url:"/work-from-anywere?search=windowsvirtualdesktop#details",
  },
  {
    Name:"Modern Workplace",
    image:"/newerp.jpg",
    url:"/modern-workplace?search=erp#details",
  },
  {
    Name:"Modern Workplace",
    image:"/nnetwork.jpg",
    url:"/modern-workplace?search=networksecurity#details",
  },
  {
    Name:"Digital",
    image:"/cctv.jpg",
    url:"/digital?search=surveillancesystems#details",
  },
  {
    Name:"Digital",
    image:"/iot.jpg",
    url:"/digital?search=iotsystems#details",
  },
  {
    Name:"Endless Support",
    image:"/consult.png",
    url:"/endless-support#details",
  },
  {
    Name:"Endless Support",
    image:"/cs.jpg",
    url:"/endless-support#details",
  },
]


export default function FacultyManagement() {
  const [f1, setf1] = useState(false)
  const [f2, setf2] = useState(false)
  const [f3, setf3] = useState(false)
  const [f4, setf4] = useState(false)



  return (
    <div className='w-full h-full pt-[65px] lg:pt-0 relative z-20'>
      <div className='w-full lg:w-4/5 mx-auto'>
      <div className='w-[90%] lg:w-[80%] xl:w-[1280px] mx-auto pt-8 lg:pt-[65px] flex flex-col lg:flex-row justify-center gap-8 lg:gap-0'>
        <div className='basis-1/2 flex flex-col justify-center lg:pr-[10%] z-20 gap-8 order-2 lg:order-1'>
        <span className='text-2xl lg:text-4xl '>
          <strong>
          Transform Your Facility Management with Our IT Solutions Optimize Operations and Enhance Efficiency

            </strong>
        </span>
        <p className='text-base lg:text-lg'>
        In the dynamic world of facility management, staying ahead means embracing technology that streamlines operations and enhances efficiency. Our services provide tailored solutions to help facility management companies optimize their processes, reduce costs, and improve service delivery.
        </p>
        <div className='flex gap-5'>
          <button className='bg-[#446E6D] text-white py-2 px-4 flex items-center rounded font-semibold gap-2 cursor-pointer'><span>Try for free <OpenInNewIcon fontSize='inherit'/></span></button>
          <button className='text-[#446E6D] border-[1px] border-[#446E6D] py-2 px-4 flex items-center rounded font-semibold cursor-pointer gap-2'><span>Explore <OpenInNewIcon fontSize='inherit'/></span></button>

        </div>
        </div>
        <div className='basis-1/2 px-10 lg:p-28 order-1 lg:order-2'>
        <img className='w-full rounded overflow-hidden' src='/f-m-t.jpg'/>
        
        </div>
      </div>

      </div>
      <div className='relative  bg-no-repeat bg-cover w-full bg-bottom'  >
        <div className='absolute top-0 left-0 w-full h-full '>
          <img src='/yoyo-bg.png' className='w-full h-full'/>
        </div>
        <div className='flex justify-center mt-[65px] w-full'>
        <div className='mx-auto text-center  w-[90%] sm:w-[1000px]  z-20 py-16 lg:p-0'>
          <span className='text-2xl lg:text-3xl text-[#446E6D]'> 
            <strong>
            Facility Management Companies Thriving with Our IT Services <span className='hidden lg:block'>Discover how leading facility management companies in UAE have transformed their operations and achieved remarkable success with our tailored IT solutions.</span>
              </strong>

          </span>
          <div className=' rounded-lg overflow-hidden mt-28 lg:mt-20 mb-10 lg:mb-28 flex justify-center gap-6 lg:gap-10'>
            <div className='text-center '>
            <div className='w-[160px] h-[80px] lg:w-[200px] lg:h-[100px] bg-white flex justify-center rounded-lg p-2 shadow-md shadow-gray-500 mb-4'>
              <img src='/logo_mountain_gate.png' className='h-full'/>
            </div>
            <strong className=' text-lg lg:text-xl uppercase'>Mountain Gate </strong>
            </div>
            <div className='text-center'>
            <div className='w-[160px] h-[80px] lg:w-[200px] lg:h-[100px] bg-white flex justify-center rounded-lg p-2 shadow-md shadow-gray-500 mb-4'>
              <img src='/green-logo.png' className='h-full'/>
            </div>
            <strong className='text-lg lg:text-xl'>GREEN TECH </strong>
            </div>
          </div>

        </div>
        </div>

      </div>
      <div className='w-full'>
      <div className='flex justify-center pt-[65px]'>
        <div className='mx-auto text-center w-[90%] lg:w-4/5 xl:w-[1280px]  z-20'>
          <div className='w-full xl:w-[1000px] mx-auto'>
          <span className='text-2xl lg:text-3xl text-[#446E6D]'> 
            <strong>
            Facility Management Companies Achieve Outstanding Results with WEBME
              </strong>

          </span>
          </div>
          <div className='my-20 grid lg:grid-cols-3 gap-6 lg:gap-9'>
            <div className='w-full min-h-[20vh] bg-[url(https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Retail_Salesforce-for-Retail_Statistics-Card_Card-1_Version-1-1.png?w=800)] bg-cover shadow-lg rounded-2xl overflow-hidden p-14 border-2 border-gray-200 text-base grid gap-2'>
             <span className='text-7xl'>
              <strong>
              35%
                </strong>
              </span>
              <span className='text-2xl'>
                <strong>
                Increased operational efficiency*
                </strong>
              </span>
              <span className='mt-5 text-lg'>
              Our IT services streamlined their processes, reducing manual tasks and improving overall efficiency by 35%.
              </span>
            </div>
            <div className='w-full min-h-[20vh] bg-[url(https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Retail_Salesforce-for-Retail_Statistics-Card_Card-1_Version-1-1.png?w=800)] bg-cover shadow-lg rounded-2xl overflow-hidden p-14 border-2 border-gray-200 text-base grid gap-2'>
             <span className='text-7xl'>
              <strong>
                20%
                </strong>
              </span>
              <span className='text-2xl'>
                <strong>
                Cost Savings* 
                </strong>
              </span>
              <span className='mt-5 text-lg'>
              By implementing our solutions, the company saw a significant reduction in operational costs, saving them 20% annually.
              </span>
            </div>
            <div className='w-full min-h-[20vh] bg-[url(https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Retail_Salesforce-for-Retail_Statistics-Card_Card-1_Version-1-1.png?w=800)] bg-cover shadow-lg rounded-2xl overflow-hidden p-14 border-2 border-gray-200 text-base grid gap-2'>
             <span className='text-7xl'>
              <strong>
                40%
                </strong>
              </span>
              <span className='text-2xl'>
                <strong>
                Enhanced Customer Satisfaction* 
                </strong>
              </span>
              <span className='mt-5 text-lg'>
              With improved service delivery and faster response times, customer satisfaction scores increased by 40%.
              </span>
            </div>
          </div>

        </div>
        </div>
      </div>
      <div className='w-[90%] mx-auto lg:w-full'>
      <CaseStudy/>
      </div>
        <div className='relative  bg-no-repeat bg-cover w-full bg-bottom'  >
        <div className='absolute top-0 left-0 w-full h-full hidden xl:block'>
          <img src='https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Automotive-Category-pg-Featured-solution-background-2.png?w=1024' className='w-full h-full'/>
        </div>
        <div className='flex flex-col justify-center mt-[65px] w-[90%] mx-auto lg:w-full'>
        <div className='mx-auto text-center w-full lg:w-[1000px]  z-20'>
          <span className='text-2xl lg:text-4xl text-[#446E6D]'> 
            <strong>
            Discover what WEBME’s IT Services for Facility Management can do for you.
              </strong>

          </span>
          <p className='text-base lg:text-lg mt-8'>
          WEBME’s IT Services for Facility Management provide a comprehensive suite of solutions, including Website Development, Microsoft 365 integration, ERP systems, and IT Consultancy. These services are designed to streamline operations, enhance productivity, and ensure seamless communication within your facility management company.
          </p>
        </div>
          <div className=' carousel-container w-full xl:w-[1280px] mx-auto mt-12 mb-28 sm:mb-52 z-20  overflow-hidden'>
            <div className='carousel-track flex gap-10 overflow-x-auto' style={{animation: 'slide2 60s linear infinite', width:'max-content' }}>
            {
              service.map((item,index)=>(
                <div className={` relative max-w-[281px] bg-white border-t-8 border-[#446E6D] rounded-xl shadow-lg p-8 cursor-pointer ${index===0?'ml-10':''}`} key={index}>
                <span className='text-xl uppercase'>
                  <strong>
                  {item.Name}
                  </strong>
                </span>
                <img src={item.image} className='w-full mt-8 rounded-sm mb-10'/>
                <a href={item.url}>
                  <button className='mt-10 bottom-0 mb-8 absolute text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Learn more <OpenInNewIcon fontSize='inherit'/></span>
                </button>
                  </a>

              </div>
              ))
            }
              </div>


            
          </div>

        </div>

      </div>
      <div className='relative w-full bg-bottom'  >
        
        <div className='flex flex-col justify-center mt24 lgmt-0 my-[65px] w-[90%] mx-auto lg:w-full'>
        <div className='mx-auto text-center w-full lg:w-[1000px]  z-20'>
          <span className='text-2xl lg:text-4xl text-[#446E6D]'> 
            <strong>
            Stay on top of the newest trend,insights and discussions in the Facility Management sector.
              </strong>

          </span>
        </div>
          <div className='w-full xl:w-[1280px] mx-auto my-16 z-20'>
            <div className=' grid lg:grid-cols-4 gap-6 lg:gap-10'>
            <div className='bg-white overflow-hidden rounded-xl shadow-xl flex flex-col'>
                <img src='https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Trends-in-Automotive.png?resize=1024,576' className='w-full'/>
                <div className='p-8 h-full relative'>
                <p className='text-sm bg-[#6a949221] px-3 py-1 rounded-full w-max'>
                  Report
                </p>
                <p className='text-xl mt-4 mb-8'>
                  <strong>
                  Trends in Automotive 
                  </strong>
                </p>
                <button className='absolute bottom-0 mb-8  mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Get the report <OpenInNewIcon fontSize='inherit'/></span>
                </button>

                </div>
              </div>
              
            <div className='bg-white overflow-hidden rounded-xl shadow-xl flex flex-col'>
                <img src='https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/New-Automotive-Innovations-for-Connected-Vehicles-Captive-Finance.png?resize=1024,576' className='w-full'/>
                <div className='p-8 h-full relative'>
                <p className='text-sm bg-[#6a949221] px-3 py-1 rounded-full w-max'>
                  Webinar
                </p>
                <p className='text-xl mt-4 mb-16'>
                  <strong>
                  New Automotive Innovations for Connected Vehicles and Captive Finance
                  </strong>
                </p>
                <button className='absolute bottom-0 mb-8  mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Watch now <OpenInNewIcon fontSize='inherit'/></span>
                </button>

                </div>
              </div>
            <div className='bg-white overflow-hidden rounded-xl shadow-xl flex flex-col'>
                <img src='https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Smarter-Savings-for-Automotive.png?resize=1024,576' className='w-full'/>
                <div className='p-8 h-full relative'>
                <p className='text-sm bg-[#6a949221] px-3 py-1 rounded-full w-max'>
                  Guide
                </p>
                <p className='text-xl mt-4 mb-8'>
                  <strong>
                  Smarter Savings for Automotive 
                  </strong>
                </p>
                <button className='absolute bottom-0 mb-8  mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Get the guide <OpenInNewIcon fontSize='inherit'/></span>
                </button>

                </div>
              </div>
            <div className='bg-white overflow-hidden rounded-xl shadow-xl flex flex-col'>
                <img src='https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Connected-Car-Disconnect_-65-of-U.S.-Drivers-Dont-Understand-1.png?resize=1024,576' className='w-full'/>
                <div className='p-8 h-full relative'>
                <p className='text-sm bg-[#6a949221] px-3 py-1 rounded-full w-max'>
                  News
                </p>
                <p className='text-xl mt-4 mb-8'>
                  <strong>
                  65% of U.S. Drivers Don’t Understand Connected Cars 
                  </strong>
                </p>
                <button className='absolute bottom-0 mb-8  mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Read the story <OpenInNewIcon fontSize='inherit'/></span>
                </button>

                </div>
              </div>
              
              
            </div>
          </div>
          <button className='text-[#446E6D] w-max mx-auto border-[1px] border-[#446E6D] py-3 px-6 flex items-center rounded font-semibold cursor-pointer gap-2'><span>Read all resources <OpenInNewIcon fontSize='inherit'/></span></button>

        </div>
      </div>
      <div className='relative  bg-no-repeat bg-cover w-[90%] mx-auto xl:w-full bg-bottom'  >
        <div className='absolute top-0 left-0 w-full h-full hidden xl:block'>
          <img src='https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/03/logo-grid-background-min.jpg?w=1024' className='w-full h-full'/>
        </div>
        <div className='flex flex-col justify-center mt-[110px]'>
        <div className='mx-auto text-center w-full lg:w-[1000px]  z-20'>
          <span className='text-2xl lg:text-4xl text-[#446E6D]'> 
            <strong>
            Begin your journey with us today!
            </strong>
          </span>
          <p className='text-base lg:text-lg mt-8'>
          Get out-of-the-box automotive features and workflows that make it easy to explore new revenue opportunities, advance next-generation vehicle experiences, and innovate with AI and automation – all powered by the #1 automotive CRM.
          </p>
        </div>
          <div className='w-full xl:w-[1280px] mx-auto my-12 z-20'>
            <div className=' grid xl:grid-cols-3 gap-10 xl:mx-28'>
            <div className='bg-white overflow-hidden rounded-xl shadow-xl flex flex-col'>
                <div className='p-8 h-full relative'>
                  <img src='https://www.salesforce.com/content/dam/web/global/svg-icons/screen.svg' className='text-sm bg-[#6a949221] p-3 rounded-full w-max'/>
                <p className='text-xl mt-7'>
                  <strong>
                    Start your trial.
                  </strong>
                </p>
                <p className='mt-3 mb-14'>
                  Try Automotive Cloud free for 30 days. No credit card. No installations.
                </p>
                <button className='absolute bottom-0 mb-8  mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Try for free <OpenInNewIcon fontSize='inherit'/></span>
                </button>

                </div>
              </div>              
            <div className='bg-white overflow-hidden rounded-xl shadow-xl flex flex-col'>
                <div className='p-8 h-full relative'>
                  <img src='https://www.salesforce.com/content/dam/web/global/svg-icons/call.svg' className='text-sm bg-[#6a949221] p-3 rounded-full w-max'/>
                <p className='text-xl mt-7'>
                  <strong>
                    Talk to an expert.
                  </strong>
                </p>
                <p className='mt-3 mb-14'>
                  Tell us a bit so the right person can reach out faster.
                </p>
                <button className='absolute bottom-0 mb-8  mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Request a call <OpenInNewIcon fontSize='inherit'/></span>
                </button>

                </div>
              </div>              
            <div className='bg-white overflow-hidden rounded-xl shadow-xl flex flex-col'>
                <div className='p-8 h-full relative'>
                  <img src='https://a.sfdcstatic.com/shared/images/pbc/play.svg' className='text-sm bg-[#6a949221] p-3 rounded-full w-max'/>
                <p className='text-xl mt-7'>
                  <strong>
                    Watch a demo.
                  </strong>
                </p>
                <p className='mt-3 mb-14'>
                Get the latest research, industry insights, and product news delivered straight to your inbox.
                </p>
                <button className='absolute bottom-0 mb-8  mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>See demo <OpenInNewIcon fontSize='inherit'/></span>
                </button>

                </div>
              </div>              
            </div>
          </div>

        </div>

      </div>
      <div className='relative  bg-no-repeat bg-cover w-full bg-bottom'  >
        <div className='flex flex-col justify-center mt-[110px]'>
        <div className='mx-auto text-center w-[90%] lg:w-[1000px]  z-20'>
          <span className='text-2xl lg:text-4xl'> 
            <strong>
            WEBME CRM for Automotive FAQ 
            </strong>
          </span>
        </div>
          <div className='w-[90%] lg:w-[1000px]  mx-auto mt-12 mb-52 z-20'>
            <div className='flex flex-col gap-10 lg:mx-24'>
            <div className={`w-full border-b-2 border-[#446e6d44]`} onClick={() => setf1(prev=>!prev)}>
                <button className='text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full text-left'>
                What is a CRM for the automotive industry?
                  </strong>
                  <span className='text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]'>
                  {!f1 ? <svg xmlns="http://www.w3.org/2000/svg" width="13.54" height="13.54" fill="none" aria-hidden="true" className="fill-black accordion__icon accordion__icon--plus" viewBox="0 0 22 22"><path d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z" className="icon__plus" clip-rule="evenodd"></path></svg>:
                  <svg xmlns="http://www.w3.org/2000/svg" width="14.77" height="14.77 " fill="none" aria-hidden="true" className=" fill-black accordion__icon accordion__icon--minus" viewBox="0 0 24 3"><path d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z" className="icon__minus" clip-rule="evenodd"></path></svg>}
                  </span>
                </button>
                <p className={`${f1 ? 'block' : 'hidden'} mb-6 `}>
                Customer relationship management for the automotive industry is a system for managing all of your company’s interactions with current and potential customers, as well as critical information like driver, vehicle, retail, and automotive financial data.
                </p>
              </div>
              <div className={`w-full border-b-2 border-[#446e6d44]`} onClick={() => setf2(prev=>!prev)}>
                <button className='text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full  text-left'>
                  How do I choose the best automotive CRM for my business?
                  </strong>
                  <span className='text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]'>
                  {!f2 ? <svg xmlns="http://www.w3.org/2000/svg" width="13.54" height="13.54" fill="none" aria-hidden="true" className="fill-black accordion__icon accordion__icon--plus" viewBox="0 0 22 22"><path d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z" className="icon__plus" clip-rule="evenodd"></path></svg>:
                  <svg xmlns="http://www.w3.org/2000/svg" width="14.77" height="14.77 " fill="none" aria-hidden="true" className=" fill-black accordion__icon accordion__icon--minus" viewBox="0 0 24 3"><path d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z" className="icon__minus" clip-rule="evenodd"></path></svg>}
                  </span>
                </button>
                <p className={`${f2 ? 'block' : 'hidden'} mb-6 `}>
                First, determine what you want an automotive CRM to solve. An automotive CRM should include functionality, such as vehicle and driver information, automotive lead management, partner performance management, inventory management, fleet management, embedded analytics and AI, and more.
                </p>
              </div>
              <div className={`w-full border-b-2 border-[#446e6d44]`} onClick={() => setf3(prev=>!prev)}>
                <button className='text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full text-left'>
                  What are the benefits of using a CRM for automotive?
                  </strong>
                  <span className='text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]'>
                  {!f3 ? <svg xmlns="http://www.w3.org/2000/svg" width="13.54" height="13.54" fill="none" aria-hidden="true" className="fill-black accordion__icon accordion__icon--plus" viewBox="0 0 22 22"><path d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z" className="icon__plus" clip-rule="evenodd"></path></svg>:
                  <svg xmlns="http://www.w3.org/2000/svg" width="14.77" height="14.77 " fill="none" aria-hidden="true" className=" fill-black accordion__icon accordion__icon--minus" viewBox="0 0 24 3"><path d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z" className="icon__minus" clip-rule="evenodd"></path></svg>}
                  </span>
                </button>
                <p className={`${f3 ? 'block' : 'hidden'} mb-6 `}>
                An automotive CRM can help you get 360-degree visibility into your customers and their households and vehicles, build a robust sales pipeline, intelligently manage your vehicle and parts product portfolio, and deliver meaningful service experiences for drivers and households.
                </p>
              </div>
              <div className={`w-full border-b-2 border-[#446e6d44]`} onClick={() => setf4(prev=>!prev)}>
                <button className='text-[#446E6D] text-lg lg:text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full text-left'>
                  Does my business need an automotive CRM?
                  </strong>
                  <span className='text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]'>
                  {!f4 ? <svg xmlns="http://www.w3.org/2000/svg" width="13.54" height="13.54" fill="none" aria-hidden="true" className="fill-black accordion__icon accordion__icon--plus" viewBox="0 0 22 22"><path d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z" className="icon__plus" clip-rule="evenodd"></path></svg>:
                  <svg xmlns="http://www.w3.org/2000/svg" width="14.77" height="14.77 " fill="none" aria-hidden="true" className=" fill-black accordion__icon accordion__icon--minus" viewBox="0 0 24 3"><path d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z" className="icon__minus" clip-rule="evenodd"></path></svg>}
                  </span>
                </button>
                <p className={`${f4 ? 'block' : 'hidden'} mb-6 `}>
                Consider an automotive CRM if you find that your customer-facing interactions are misguided, that you’re missing upsell opportunities, or if you want to better serve drivers and their households. An automotive CRM like Automotive Cloud helps teams take action fast and delight every customer.
                </p>
              </div>                        
            </div>
          </div>

        </div>

      </div>


    </div>
  )
}
