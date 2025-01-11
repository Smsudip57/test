'use client'
import React,{useState} from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import Link from 'next/link';
import { set } from 'mongoose';
import {useRouter} from 'next/navigation';
import { MyContext } from '@/context/context';

export default function Adminnav({user, login}) {
  const [isOn, setIsOn] = useState(false);
  const [isLoading,setisLoading] = useState(false)
  const context = React.useContext(MyContext);
  const router = useRouter();

  React.useEffect(()=>{
    setIsOn(login);
  },[login])
  const handleToggle = async() => {
    try {
      setisLoading(true);
      const response = await axios.post(`/api/setting/toggleLogin`,{
        loginOn: !isOn
      },{
        withCredentials: true
      });
      if(response.data.success){
        setIsOn(prev=>!prev);
      }
    } catch (error) {

    } finally{
      setisLoading(false);
    }
    };

    const handleLogout = async() => {
      try {
        const response = await axios.get('/api/user/logout',
          {withCredentials: true}
        );
        if(response?.data?.success){
          context?.setUser(null);
          context?.customToast(response?.data);
          router.push('/');
        }
      } catch (error) {
        context?.customToast({success:false, message:'Something went wrong'})
      }  
    }
  


  return (
    <header className='bg-[#C1EBE7] w-full px-[10%] py-5 text-[#446E6D border-b-2 border-[#446e6d25] shadow-md fixed top-0 z-10'>
        <div className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center space-x-4 justify-center'>
        <Link href={`/`}>
        <img alt="logo" width="17" height="17"  className="cursor-pointer hover:animate-slowspin"  src="/logo.svg"/>
        </Link>
        <h1 className='text-[#446E6D] text-xl font-bold'>Webmedigital Admin pannel</h1>
        </div>
            <nav>
            <ul className='flex space-x-16'>
           {/* {user && <li className='flex items-center gap-5'>
              <h1 className='text-[#446E6D] text-balg font-bold'>{isOn ? 'Is' : 'Not'} visible to strangers</h1>
                <div
                  onClick={handleToggle}
                  className={`w-10 h-4 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                    isOn ? 'bg-[#446E6D]' : 'bg-gray-400'
                  }`}
                >
                <div
                  className={`w-3 h-3 realtive bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    isOn ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                 {isLoading && <div className="animate-spin border-4 border-t-4 border-transparent border-t-[#446E6D] border-b-[#446E6D] rounded-full  aspect-square"></div>}
                </div>
                </div>
                </li>} */}
                <li className='grid cursor-pointer'>
                 <h1 className='text-[#446E6D] text-xl font-bold'>
                  {context?.user && context?.user?.profile?.name && `Welcome, ${context?.user?.profile?.name}!`}
                  <Link href='/admin/login'>
                  {!user && 'Please log in!'}
                  </Link>
                    </h1>
                </li>
                
                <li title='Logout' className='cursor-pointer' onClick={handleLogout}>
                <LogoutIcon className="text-[#446E6D]"/>
                </li>
            </ul>
            </nav>
        </div>
    </header>
  )
}
