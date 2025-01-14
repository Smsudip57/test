'use client'
import React,{useContext} from 'react'
import { MyContext } from "@/context/context";

export default function ConfirmModel() {
    const { showConfirm, setShowConfirm, confirmFunction, setConfirmFunction} = useContext(MyContext);

    const handleFalse = ()=>{
        setConfirmFunction(()=>{});
        setShowConfirm();
    }

    const handleTrue = ()=>{
        confirmFunction();
        setShowConfirm();
    }
     
  if(!showConfirm) return <></>

  return (
    <div className="fixed z-50 min-h-screen min-w-screen bg-black/25" style={{minWidth: '100vw', zIndex: 999999}}>
        {showConfirm && <div className='w-[400px] h-auto bg-white rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 text-center font-semibold text-2xl'>
        Are you sure?
        <p className='text-red-500 text-xs mt-2'>
          Note : {showConfirm}.
        </p>
        <div className='flex justify-center gap-14 mt-4'>
            <button className='pointer text-white bg-red-500 py-1 px-4 mt-4 rounded text-base hover:opacity-80' onClick={handleFalse}>Cancel</button>
            <button className='text-white bg-[#00CAB7] py-1 px-4 rounded  mt-4 text-base pointer hover:opacity-80' onClick={(e) => handleTrue()}>Confirm</button>
        </div>
          </div>}
    </div>
  )
}
