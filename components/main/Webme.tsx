"use client";
import React,{useState, useEffect} from "react";

  const Webme = () => {
    const [active, setActive] = useState('');

    useEffect(() => {
      console.log(active)
    }, [active])

    return (
        <section className="" style={{backgroundColor: "rgba(231,247,246,1)"}} id="services">

          <div className="lg:w-full md:text-xl hidden lg:text-2xl text-[#282828] font-lora mb-10 font-extralight list-none lg:flex  justify-around p-5 box-border uppercase cursor-pointer opacity-50" >
            <li className=" py-0 hover:opacity-60  text-nowrap" onMouseEnter={() => setActive("w")} onMouseLeave={() => setActive('')}>Workfrom Anywhere</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className=" py-0 hover:opacity-60  text-nowrap" onMouseEnter={() => setActive("ex")} onMouseLeave={() => setActive('')}>Expertise</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className=" py-0 hover:opacity-60  text-nowrap" onMouseEnter={() => setActive("b")} onMouseLeave={() => setActive('')}> Branding</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className=" py-0 hover:opacity-60  text-nowrap" onMouseEnter={() => setActive("m")} onMouseLeave={() => setActive('')}>Modernworkplace</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className=" py-0 hover:opacity-60  text-nowrap" onMouseEnter={() => setActive("en")} onMouseLeave={() => setActive('')}>Endless Support</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className=" py-0 hover:opacity-60  text-nowrap" onMouseEnter={() => setActive("d")} onMouseLeave={() => setActive('')}>Digital</li>
            </div>
          <div className="text-center pb-10 md:pb-24 px-4 sm:px-0 lg:px-[48px] z-10">
        <div className="mb-5 sm:mb-10 md:px-20 lg:px-89 px-5 ">
          <div className="relative cursor-pointer">
            
            <div className=" mx-auto w-full text-2xl md:text-xl lg:text-4xl text-[#446E6D] font-lora my-8 lg:my-0 lg:mb-16 font-bold list-none flex  justify-center items-center" >
            <p className="upper">
              <span className={`uppercase ${active==="w" ? "text-[#D5E928]" : ""}`}>w</span>
              <span className={`uppercase ${active==="ex" ? "text-[#D5E928]" : ""}`}>E</span>
              <span className={`uppercase ${active==="b" ? "text-[#D5E928]" : ""}`} >B</span>
              <span className={`uppercase ${active==="m" ? "text-[#D5E928]" : ""}`}>M</span>
              <span className={`uppercase ${active==="en" ? "text-[#D5E928]" : ""}`}>E</span>
               <span className={` ${active==="d" ? "text-[#D5E928]" : ""}`}>DIGITAL</span></p>
            </div>
            
            
          </div>
        </div>
        <div className="flex flex-col justify-center sm:flex-wrap gap-4 lg:gap-5 sm:flex-row">
          <div className={`sm:basis-1/3  lg:basis-1/4 ${active!==''&&active!=='b'?"opacity-5":"block"} `}>
              <span>
                <a href="/branding?search=webdev#details"><img src="/nextjs.jpg"  className={`${active==='b'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500"} w-full  p-1 rounded-md overflow-hidden aspect-[16/9]`}  /></a>
              </span>
          </div>
          <div className={`${active!==''&&active!=='w'?"opacity-5":"block"} sm:basis-1/3  lg:basis-1/4 aspect-[16/9]`}>
          <span>
                {/* <img src="Odoo ERP.jpg"/> */}
                <a href="/work-from-anywere?search=microsolft365#details"><img src="/m365.jpg" className={`${active==='w'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500"}  p-1 rounded-md overflow-hidden aspect-[16/9]`}/></a>
              </span>
          </div>
          <div className={`${active!==''&&active!=='en'?"opacity-5":"block"} sm:basis-1/3  lg:basis-1/4 `}>
          <span>
          <a href="/endless-support#details"><img src="/consult.png" className={`${active==='en'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500"}  p-1 rounded-md overflow-hidden aspect-[16/9]`}/></a>
              </span>
          </div>
          <div className={`${active!==''&&active!=='m'?"opacity-5":"block"} sm:basis-1/3  lg:basis-1/4 serviceforce aspect-[16/9]`}>
          <span>
          <a href="/modern-workplace?search=networksecurity#details"><img src="/nnetwork.jpg" className={`${active==='m'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500"}  p-1 rounded-md overflow-hidden serviceforce aspect-[16/9]`}/></a>
              </span>
          </div>
          <div className={`sm:basis-1/3  lg:basis-1/4 ${active!==''&&active!=='m'?"opacity-15":"block"} serviceforce aspect-[16/9]`} >
          <span>
          <a href="/modern-workplace?search=erp#details"><img src="/newerp.jpg" className={`${active==='m'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500 "}  p-1 rounded-md overflow-hidden serviceforce aspect-[16/9]`}/></a>
              </span>
          </div>
          <div className={`sm:basis-1/3  lg:basis-1/4 ${active!==''&&active!=='b'?"opacity-5":"block"} aspect-[16/9]`}>
              <span>
                <a href="/branding?search=appdev#details"><img src="/expt.jpg"  className={`${active==='b'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500"}   p-1 rounded-md overflow-hidden aspect-[16/9]`}  /></a>
              </span>
          </div>

          {/* new */}
          <div className={`${active!==''&&active!=='d'?"opacity-5":"block"} sm:basis-1/3  lg:basis-1/4 aspect-[16/9]`}>
          <span>
                <a href="/digital?search=surveillancesystems#details"><img src="/cctv.jpg" className={`${active==='d'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500"}  p-1 rounded-md overflow-hidden serviceforce aspect-[16/9]`}/></a>
              </span>
          </div>
          <div className={`${active!==''&&active!=='d'?"opacity-5":"block"} sm:basis-1/3  lg:basis-1/4 aspect-[16/9]`}>
          <span>
                <a href="/digital?search=iotsystems#details"><img src="/iot.jpg" className={`${active==='d'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500"}  p-1 rounded-md overflow-hidden serviceforce aspect-[16/9]`}/></a>
              </span>
          </div>
          <div className={`sm:basis-1/3  lg:basis-1/4 ${active!==''&&active!=='w'?"opacity-5":"block"} aspect-[16/9]`}>
              <span>
                <a href="/work-from-anywere?search=windowsvirtualdesktop#details"><img src="/micro-t.jpg"  className={`${active==='w'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-1":"border-[1px] border-[#76b4b1d0] shadow-md shadow-slate-500"}   p-1 rounded-md overflow-hidden aspect-[16/9]`}  /></a>
              </span>
          </div>
        </div>
          </div>
      </section>
      
    );
  };
  
  export default Webme;
  