'use client'
import React from "react";
import ProjectCard from "../sub/ProjectCard";
import { useRouter } from "next/navigation";
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';



const Contact = () => {
  const router = useRouter();

  const handlemail = () => {
    router.push("mailto:webme@webmedigital.com");
  }
  const handlcall = () => {
    router.push("tel:+9710567295834");
  }
  return (
     <section className="px-4 sm:px-12 lg:px-[136px] pb-12 sm:pb-24 pt-5 sm:pt-12">
  <div className="border border-[#00CAB7] rounded-xl flex flex-col sm:flex-row justify-between">
    <div className="p-3 sm:p-8 gap-5 flex flex-col">
      {/* <h2 className="font-graphik text-[20px] leading-[34px] font-semibold text-[#00CAB7]">Custom</h2> */}
      <div className="flex flex-col gap-2">
        <h1 className="font-lora text-2xl lg:text-4xl leading-[34px] text-[#282828] font-bold">Connect WEBME</h1>
        <p className="font-graphik text-sm font-normal text-darkblack-700">Subscribe for Exclusive Updates</p>
      </div>
      <button className="border border-[#00CAB7] rounded-md px-[22px] py-[13px] text-base font-semibold text-[#00CAB7]" onClick={handlemail}>Get started</button>
    </div>
    <div className="bg-slate-200 border border-slate-500 grid grid-cols-1 md:grid-cols-2 rounded-es-xl rounded-ee-xl sm:rounded-es-none sm:rounded-e-xl p-6 gap-2 w-full sm:w-[60%]">
    <button onClick={handlemail} className="text-[#00CAB7] text-4xl">
      <EmailIcon fontSize="inherit"/>
    </button>
    <button onClick={handlcall} className="text-[#00CAB7] text-4xl">
      <CallIcon fontSize="inherit"/>
    </button>

    </div>
  </div>
</section>
  );
};

export default Contact;
