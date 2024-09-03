"use client"
import React,{useState} from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';


export default function FacultyManagement() {
  const [f1, setf1] = useState(false)
  const [f2, setf2] = useState(false)
  const [f3, setf3] = useState(false)
  const [f4, setf4] = useState(false)



  return (
    <div className='w-full h-full pt-[65px]'>
      <div className='w-4/5 mx-auto'>
      <div className='w-[1280px] mx-auto pt-[65px] flex justify-center'>
        <div className='basis-1/2 flex flex-col justify-center pr-[10%] z-20 gap-8'>
        <span className='text-4xl'>
          <strong>
          Transform Your Facility Management with Our IT Solutions Optimize Operations and Enhance Efficiency

            </strong>
        </span>
        <p className='text-lg'>
        In the dynamic world of facility management, staying ahead means embracing technology that streamlines operations and enhances efficiency. Our services provide tailored solutions to help facility management companies optimize their processes, reduce costs, and improve service delivery.
        </p>
        <div className='flex gap-5'>
          <button className='bg-[#446E6D] text-white py-2 px-4 flex items-center rounded font-semibold gap-2 cursor-pointer'><span>Try for free <OpenInNewIcon fontSize='inherit'/></span></button>
          <button className='text-[#446E6D] border-[1px] border-[#446E6D] py-2 px-4 flex items-center rounded font-semibold cursor-pointer gap-2'><span>Explore <OpenInNewIcon fontSize='inherit'/></span></button>

        </div>
        </div>
        <div className='basis-1/2 p-28 '>
        <img className='w-full rounded overflow-hidden' src='/f-m-t.jpg'/>
        
        </div>
      </div>

      </div>
      <div className='relative  bg-no-repeat bg-cover w-full bg-bottom'  >
        <div className='absolute top-0 left-0 w-full h-full '>
          <img src='/yoyo-bg.png' className='w-full h-full'/>
        </div>
        <div className='flex justify-center mt-[65px]'>
        <div className='mx-auto text-center w-[1000px]  z-20'>
          <span className='text-3xl'> 
            <strong>
            Facility Management Companies Thriving with Our IT Services Discover how leading facility management companies in UAE have transformed their operations and achieved remarkable success with our tailored IT solutions.
              </strong>

          </span>
          <div className=' rounded-lg overflow-hidden mt-20 mb-28 flex justify-center gap-10'>
            <div className='text-center w-[200px]'>
            <div className='w-[200px] h-[100px] bg-white flex justify-center rounded-lg p-2 shadow-md shadow-gray-500 mb-4'>
              <img src='/logo_mountain_gate.png' className='h-full'/>
            </div>
            <strong className='text-xl uppercase'>Mountain Gate </strong>
            </div>
            <div className='text-center'>
            <div className='w-[200px] h-[100px] bg-white flex justify-center rounded-lg p-2 shadow-md shadow-gray-500 mb-4'>
              <img src='/green-logo.png' className='h-full'/>
            </div>
            <strong className='text-xl'>GREEN TECH </strong>
            </div>
          </div>

        </div>
        </div>

      </div>
      <div className='w-full'>
      <div className='flex justify-center pt-[65px]'>
        <div className='mx-auto text-center w-[1280px]  z-20'>
          <div className='w-[1000px] mx-auto'>
          <span className='text-3xl'> 
            <strong>
            Facility Management Companies Achieve Outstanding Results with WEBME
              </strong>

          </span>
          </div>
          <div className='my-20 grid grid-cols-3 gap-9'>
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
      <div className='mx-auto text-center w-[1280px] mb-48 z-20 relative'>
      <Swiper
        slidesPerView={1}
        spaceBetween={100}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-n',
          prevEl: '.swiper-button-p',
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
      
          <div className='mt-16 w-full relative overflow-hidden rounded-2xl shadow-md border-2 border-gray-200'>
            <div className='absolute top-0 left-0 w-full h-full' style={{zIndex:-1}}>
            <svg width="1280" height="459" viewBox="0 0 1280 459" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2462 -979C2462 -184.814 1812.81 459 1012 459C211.187 459 -438 -184.814 -438 -979C-438 -1773.19 211.187 -2417 1012
                            -2417C1812.81 -2417 2462 -1773.19 2462 -979Z" fill="rgb(259, 240, 255)"></path>
                </svg>

            </div>
            <div className='w-full flex items-center'>
              <div className=' basis-1/2 h-full px-40 '>
                <img src='/logo_mountain_gate.png' className='w-full active:border-[5px] active:border-blue-500 rounded-lg overflow-hidden'></img>
              </div>
              <div className='basis-1/2'>
              <div className='py-16 pr-24 text-left' >
                <div className='h-[32px] mb-5'>
                  <img src="https://a.sfdcstatic.com/shared/images/pbc/icons/quotation-english.svg" alt="backqoute" className='h-full' />
                </div>
                <span className='text-3xl'>
                  <strong>
                  The Odoo Application has transformed the way we manage maintenance tasks. The automation has not only saved us time but also improved the accuracy and efficiency of our operations. We are extremely pleased with the results and the support provided throughout the implementation process.
                  </strong>
                </span>
                <br></br><br></br>
                <span className='text-xl'>
                  <strong>
                  Abhilash Dass 
                  </strong>
                </span>
                <p className='mt-2 text-xl font-extralight'>
                Admin Manager, Mountain Gate Property Management
                </p>
                <button className='mt-10 text-[#446E6D] border-[1px] border-[#446E6D] py-3 px-8 flex items-center rounded font-semibold cursor-pointer gap-2'><span>Read the story <OpenInNewIcon fontSize='inherit'/></span></button>

              </div>

              </div>

            </div>
          </div>
          </SwiperSlide>
          <SwiperSlide>
            
          <div className='my-16 w-full relative overflow-hidden rounded-2xl shadow-xl border-2 border-gray-200'>
            <div className='absolute top-0 left-0 w-full h-full' style={{zIndex:-1}}>
            <svg width="1280" height="459" viewBox="0 0 1280 459" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2462 -979C2462 -184.814 1812.81 459 1012 459C211.187 459 -438 -184.814 -438 -979C-438 -1773.19 211.187 -2417 1012
                            -2417C1812.81 -2417 2462 -1773.19 2462 -979Z" fill="rgb(259, 240, 255)"></path>
                </svg>

            </div>
            <div className='w-full flex items-center'>
              <div className=' basis-1/2 h-full px-40 '>
                <img src='/green-logo.png' className='w-full active:border-[5px] active:border-blue-500 rounded-lg overflow-hidden'></img>
              </div>
              <div className='basis-1/2'>
              <div className='py-16 pr-24 text-left' >
                <div className='h-[32px] mb-5'>
                  <img src="https://a.sfdcstatic.com/shared/images/pbc/icons/quotation-english.svg" alt="backqoute" className='h-full' />
                </div>
                <span className='text-3xl'>
                  <strong>
                  The implementation of Microsoft 365, our new website, and Odoo ERP has transformed our operations. We now have a unified system that enhances our productivity and customer service. The support and expertise provided throughout the process were exceptional.
                  </strong>
                </span>
                <br></br><br></br>
                <span className='text-xl'>
                  <strong>
                  Rajesh Kumar
                  </strong>
                </span>
                <p className='mt-2 text-xl font-extralight'>
                Managing Director, GREENTECH GENERAL MAINT
                </p>
                <button className='mt-10 text-[#446E6D] border-[1px] border-[#446E6D] py-3 px-8 flex items-center rounded font-semibold cursor-pointer gap-2'><span>Read the story <OpenInNewIcon fontSize='inherit'/></span></button>

              </div>

              </div>

            </div>
          </div>

                            </SwiperSlide>
                            </Swiper>
                            <div className="absolute shadow-lg right-0 lg:-right-6 top-[45%] z-[99999999] bg-white w-[52px] h-[52px] rounded-[100%] flex justify-center items-center swiper-button-n cursor-pointer" >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
        <path fill="#000" fillRule="evenodd" d="M8.25 3.667 15.584 11 8.25 18.333 6.417 16.5l5.5-5.5-5.5-5.5L8.25 3.667Z" clipRule="evenodd"></path>
      </svg>
    </div>
    <div className="absolute shadow-lg left-0 lg:-left-6 top-[45%] z-10 bg-white w-[52px] h-[52px] rounded-[100%] flex justify-center items-center swiper-button-p cursor-pointer" >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none">
        <path fill="#000" fillRule="evenodd" d="M13.75 18.333 6.417 11l7.333-7.333L15.583 5.5l-5.5 5.5 5.5 5.5-1.833 1.833Z" clipRule="evenodd"></path>
      </svg>
    </div>
        </div>
        <div className='relative  bg-no-repeat bg-cover w-full bg-bottom'  >
        <div className='absolute top-0 left-0 w-full h-full '>
          <img src='https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/05/Automotive-Category-pg-Featured-solution-background-2.png?w=1024' className='w-full h-full'/>
        </div>
        <div className='flex flex-col justify-center mt-[65px]'>
        <div className='mx-auto text-center w-[1000px]  z-20'>
          <span className='text-4xl'> 
            <strong>
            Discover what WEBME’s IT Services for Facility Management can do for you.
              </strong>

          </span>
          <p className='text-lg mt-8'>
          WEBME’s IT Services for Facility Management provide a comprehensive suite of solutions, including Website Development, Microsoft 365 integration, ERP systems, and IT Consultancy. These services are designed to streamline operations, enhance productivity, and ensure seamless communication within your facility management company.
          </p>
        </div>
          <div className='w-[1280px] mx-auto mt-12 mb-52 z-20'>
            <div className=' grid grid-cols-4 gap-10'>
              <div className='bg-white border-t-8 border-[#446E6D] rounded-xl shadow-lg p-8'>
                <span className='text-xl uppercase'>
                  <strong>
                  Branding
                  </strong>
                </span>
                <img src="/nextjs.png" className='w-full mt-4 rounded-sm'/>
                <a href='/branding'>
                  <button className='mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Learn more <OpenInNewIcon fontSize='inherit'/></span>
                </button>
                  </a>

              </div>
              <div className='bg-white border-t-8 border-[#446E6D] rounded-xl shadow-lg p-8'>
                <span className='text-xl uppercase'>
                  <strong>
                  Modern Workplace
                  </strong>
                </span>
                <img src="/micro.png" className='w-full mt-4 rounded-sm'/>
                <a href='/modern-workplace'>
                <button className='mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Learn more <OpenInNewIcon fontSize='inherit'/></span>
                </button>
                </a>

              </div>
              <div className='bg-white border-t-8 border-[#446E6D] rounded-xl shadow-lg p-8'>
                <span className='text-xl uppercase'>
                  <strong>
                  secure Firewall
                  </strong>
                </span>
                <img src="/firewall.png" className='w-full mt-4 rounded-sm'/>
                <a href='/secure-firewall'>
                <button className='mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Learn more <OpenInNewIcon fontSize='inherit'/></span>
                </button>
                </a>

              </div>
              <div className='bg-white border-t-8 border-[#446E6D] rounded-xl shadow-lg p-8'>
                <span className='text-xl uppercase'>
                  <strong>
                  Erp
                  </strong>
                </span>
                <img src="/Odoo ERP.jpg" className='w-full mt-4 rounded-sm'/>
                <a href='/erp'>
                <button className='mt-10 text-[#446E6D] flex items-center rounded font-semibold cursor-pointe'>
                  <span className='font-bold'>Learn more <OpenInNewIcon fontSize='inherit'/></span>
                </button>
                </a>

              </div>
            </div>
          </div>

        </div>

      </div>
      <div className='relative w-full bg-bottom'  >
        
        <div className='flex flex-col justify-center my-[65px]'>
        <div className='mx-auto text-center w-[1000px]  z-20'>
          <span className='text-4xl'> 
            <strong>
            Stay on top of the newest trend,insights and discussions in the Facility Management sector.
              </strong>

          </span>
        </div>
          <div className='w-[1280px] mx-auto my-16 z-20'>
            <div className=' grid grid-cols-4 gap-10'>
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
      <div className='relative  bg-no-repeat bg-cover w-full bg-bottom'  >
        <div className='absolute top-0 left-0 w-full h-full '>
          <img src='https://wp.salesforce.com/en-us/wp-content/uploads/sites/4/2024/03/logo-grid-background-min.jpg?w=1024' className='w-full h-full'/>
        </div>
        <div className='flex flex-col justify-center mt-[110px]'>
        <div className='mx-auto text-center w-[1000px]  z-20'>
          <span className='text-4xl'> 
            <strong>
            Begin your journey with us today!
            </strong>
          </span>
          <p className='text-lg mt-8'>
          Get out-of-the-box automotive features and workflows that make it easy to explore new revenue opportunities, advance next-generation vehicle experiences, and innovate with AI and automation – all powered by the #1 automotive CRM.
          </p>
        </div>
          <div className='w-[1280px] mx-auto my-12 z-20'>
            <div className=' grid grid-cols-3 gap-10 mx-28'>
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
        <div className='mx-auto text-center w-[1000px]  z-20'>
          <span className='text-4xl'> 
            <strong>
            WEBME CRM for Automotive FAQ 
            </strong>
          </span>
        </div>
          <div className='w-[1000px]  mx-auto mt-12 mb-52 z-20'>
            <div className='flex flex-col gap-10 mx-24'>
            <div className={`w-full border-b-2 border-[#446e6d44]`} onClick={() => setf1(prev=>!prev)}>
                <button className='text-[#446E6D] text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full'>
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
                <button className='text-[#446E6D] text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full'>
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
                <button className='text-[#446E6D] text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full'>
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
                <button className='text-[#446E6D] text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full'>
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
