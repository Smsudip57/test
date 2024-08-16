"use client";
import React,{useState, useEffect} from "react";

  const Webme = () => {
    const [active, setActive] = useState('');

    useEffect(() => {
      console.log(active)
    }, [active])

    return (
        <section className="" style={{backgroundColor: "rgba(231,247,246,1)"}} id="services">

          <div className="w-full md:text-xl lg:text-2xl text-[#282828] font-lora mb-10 font-semibold list-none flex  justify-between p-5 uppercase cursor-pointer opacity-50" >
            <li className="px-5 py-0 hover:opacity-60" onMouseEnter={() => setActive("w")} onMouseLeave={() => setActive('')}>Workfrom Anywhere</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className="px-5 py-0 hover:opacity-60" onMouseEnter={() => setActive("ex")} onMouseLeave={() => setActive('')}>Expertise</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className="px-5 py-0 hover:opacity-60" onMouseEnter={() => setActive("b")} onMouseLeave={() => setActive('')}> Branding</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className="px-5 py-0 hover:opacity-60" onMouseEnter={() => setActive("m")} onMouseLeave={() => setActive('')}>Modern Workplace</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className="px-5 py-0 hover:opacity-60" onMouseEnter={() => setActive("en")} onMouseLeave={() => setActive('')}>Endless Support</li>
            <li className=" border-[1px] border-[#446E6D] opacity-50"></li>
            <li className="px-5 py-0 hover:opacity-60" onMouseEnter={() => setActive("d")} onMouseLeave={() => setActive('')}>Digital</li>
            </div>
          <div className="text-center pb-10 md:pb-20 px-4 sm:px-0 lg:px-[48px] z-10">
        <div className="mb-5 sm:mb-10 md:px-20 lg:px-89 px-5 ">
          <div className="relative cursor-pointer">
            
            <div className=" mx-auto w-full md:text-xl lg:text-4xl text-[#282828] font-lora mb-16 font-bold list-none flex  justify-center items-center" >
            <p className="upper">
              <span className={`uppercase ${active==="w" ? "text-[#D5E928]" : ""}`}>w</span>
              <span className={`uppercase ${active==="ex" ? "text-[#D5E928]" : ""}`}>e</span>
              <span className={`uppercase ${active==="b" ? "text-[#D5E928]" : ""}`} >b</span>
              <span className={`uppercase ${active==="m" ? "text-[#D5E928]" : ""}`}>m</span>
              <span className={`uppercase ${active==="en" ? "text-[#D5E928]" : ""}`}>e</span>
               <span > </span>
               <span className={` ${active==="d" ? "text-[#D5E928]" : ""}`}>Digital</span></p>
            </div>
            
            
          </div>
        </div>
        <div className="flex flex-col justify-center flex-wrap gap-2 lg:gap-5 sm:flex-row">
          <div className={`sm:basis-1/3  lg:basis-1/4 ${active!==''&&active!=='d'&&active!=='b'?"hidden":"block"}`}>
              <span>
                <a href="/branding"><img src="/nextjs.png"  className={`${active==='b'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-2":"bg-[#446E6D]"}   p-1 rounded-md overflow-hidden`}  /></a>
              </span>
          </div>
          <div className={`${active!==''&&active!=='d'&&active!=='m'?"hidden":"block"} sm:basis-1/3  lg:basis-1/4`}>
          <span>
                {/* <img src="Odoo ERP.jpg"/> */}
                <a href="/modern-workplace"><img src="/micro.png" className={`${active==='m'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-2":"bg-[#446E6D]"}  p-1 rounded-md overflow-hidden`}/></a>
              </span>
          </div>
          <div className={`${active!==''&&active!=='d'&&active!=='en'?"hidden":"block"} sm:basis-1/3  lg:basis-1/4`}>
          <span>
          <a href="/endless-support"><img src="/consult.png" className={`${active==='en'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-2":"bg-[#446E6D]"}  p-1 rounded-md overflow-hidden`}/></a>
              </span>
          </div>
          <div className={`${active!==''&&active!=='d'&&active!=='5'?"hidden":"block"} sm:basis-1/3  lg:basis-1/4`}>
          <span>
          <a href="/secure-firewall"><img src="/firewall.png" className={`${active==='5'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-2":"bg-[#446E6D]"}  p-1 rounded-md overflow-hidden`}/></a>
              </span>
          </div>
          <div className={`sm:basis-1/3  lg:basis-1/4 ${active!==''&&active!=='d'&&active!=='w'?"hidden":"block"}`} >
          <span>
          <a href="/work-from-anywere"><img src="/Odoo ERP.jpg" className={`${active==='w'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-2":"bg-[#446E6D]"} ${active!==''&&active!=='d'&&active!=='w'?"hidden":"block"} p-1 rounded-md overflow-hidden`}/></a>
              </span>
          </div>
          <div className={`sm:basis-1/3  lg:basis-1/4 ${active!==''&&active!=='d'&&active!=='ex'?"hidden":"block"}`}>
          <span>
          <a href="/expertise"><img src="/stacks.png" className={`${active==='ex'?"bg-gradient-to-r from-[#00FFF3] to-[#FFE500] p-2":"bg-[#446E6D]"} ${active!==''&&active!=='d'&&active!=='ex'?"hidden":"block"} p-1 rounded-md overflow-hidden`}/></a>
              </span>
          </div>
        </div>
          </div>
      </section>
      
    );
  };
  
  export default Webme;
  