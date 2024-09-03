"use client"
import React,{useState} from 'react'

export default function Page() {
    const [f1, setf1] = useState(false)
    const [f2, setf2] = useState(false)
    const [f3, setf3] = useState(false)
    const [f4, setf4] = useState(false)
  return (
    <div className='pt-16'>
        <div className='relative  bg-no-repeat bg-cover w-full bg-bottom'  >
        <div className='flex flex-col justify-center mt-16'>
        <div className='mx-auto text-center w-[1000px]  z-20'>
          <span className='text-4xl'> 
            {/* <strong> */}
           FAQ 
            {/* </strong> */}
          </span>
        </div>
          <div className='w-[1000px]  mx-auto mt-12 mb-52 z-20'>
            <div className='flex flex-col gap-10 mx-24'>
            <div className={`w-full border-b-2 border-[#446e6d44]`} onClick={() => setf1(prev=>!prev)}>
                <button className='text-[#446E6D] text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full'>
                  What is WEBMEDIGITAL? 
                  </strong>
                  <span className='text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]'>
                  {!f1 ? <svg xmlns="http://www.w3.org/2000/svg" width="13.54" height="13.54" fill="none" aria-hidden="true" className="fill-black accordion__icon accordion__icon--plus" viewBox="0 0 22 22"><path d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z" className="icon__plus" clip-rule="evenodd"></path></svg>:
                  <svg xmlns="http://www.w3.org/2000/svg" width="14.77" height="14.77 " fill="none" aria-hidden="true" className=" fill-black accordion__icon accordion__icon--minus" viewBox="0 0 24 3"><path d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z" className="icon__minus" clip-rule="evenodd"></path></svg>}
                  </span>
                </button>
                <p className={`${f1 ? 'block' : 'hidden'} mb-6 `}>
                WEBMEDIGITAL is the name of the IT Consultancy Package that WEBME INFORMATION TECHNOLOGY Provides.
                </p>
              </div>
              <div className={`w-full border-b-2 border-[#446e6d44]`} onClick={() => setf2(prev=>!prev)}>
                <button className='text-[#446E6D] text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full'>
                  What type of Services does WEBME INFORMATION TECHNOLOGY PROVIDES? 
                  </strong>
                  <span className='text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]'>
                  {!f2 ? <svg xmlns="http://www.w3.org/2000/svg" width="13.54" height="13.54" fill="none" aria-hidden="true" className="fill-black accordion__icon accordion__icon--plus" viewBox="0 0 22 22"><path d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z" className="icon__plus" clip-rule="evenodd"></path></svg>:
                  <svg xmlns="http://www.w3.org/2000/svg" width="14.77" height="14.77 " fill="none" aria-hidden="true" className=" fill-black accordion__icon accordion__icon--minus" viewBox="0 0 24 3"><path d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z" className="icon__minus" clip-rule="evenodd"></path></svg>}
                  </span>
                </button>
                <p className={`${f2 ? 'block' : 'hidden'} mb-6 `}>
                WEBME Provides all types of IT Consultancy Services.
                </p>
              </div>
              <div className={`w-full border-b-2 border-[#446e6d44]`} onClick={() => setf3(prev=>!prev)}>
                <button className='text-[#446E6D] text-xl w-full flex justify-between items-center mb-6'>
                  <strong className='bg-white flex w-full'>
                  What if I need the direct Meeting? 
                  </strong>
                  <span className='text-3xl p-[5px] rounded-full overflow-hidden bg-[#446e6d21]'>
                  {!f3 ? <svg xmlns="http://www.w3.org/2000/svg" width="13.54" height="13.54" fill="none" aria-hidden="true" className="fill-black accordion__icon accordion__icon--plus" viewBox="0 0 22 22"><path d="M13 12.5h8.25c.4 0 .75-.35.75-.75v-1.5c0-.4-.35-.75-.75-.75H13c-.3 0-.5-.2-.5-.5V.75c0-.4-.35-.75-.75-.75h-1.5c-.4 0-.75.35-.75.75V9c0 .3-.2.5-.5.5H.75c-.4 0-.75.35-.75.75v1.5c0 .4.35.75.75.75H9c.3 0 .5.2.5.5v8.25c0 .4.35.75.75.75h1.5c.4 0 .75-.35.75-.75V13c0-.3.2-.5.5-.5Z" className="icon__plus" clip-rule="evenodd"></path></svg>:
                  <svg xmlns="http://www.w3.org/2000/svg" width="14.77" height="14.77 " fill="none" aria-hidden="true" className=" fill-black accordion__icon accordion__icon--minus" viewBox="0 0 24 3"><path d="M24 2.25c0 .4-.35.75-.75.75H.75C.35 3 0 2.65 0 2.25V.75C0 .35.35 0 .75 0h22.5c.4 0 .75.35.75.75v1.5Z" className="icon__minus" clip-rule="evenodd"></path></svg>}
                  </span>
                </button>
                <p className={`${f3 ? 'block' : 'hidden'} mb-6 `}>
                Will be available as per your convenience for a discussion or Support for the Services.
                </p>
              </div>
                       
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
