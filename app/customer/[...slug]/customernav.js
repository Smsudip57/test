'use client'
import React,{useState} from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {useRouter} from 'next/navigation';
import { MyContext } from '@/context/context';
import { User, User2 } from 'lucide-react';

export default function Adminnav({user, login}) {
  const [isOn, setIsOn] = useState(false);
  const [isLoading,setisLoading] = useState(false)
  const context = React.useContext(MyContext);
  const router = useRouter();
  const [loginout, setloginout] = useState(false);
  const [profileopen, setprofileopen] = useState(false)


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
          router.push('/');
          setloginout(true);
          context?.setUser(null);
          context?.customToast(response?.data);
        }
      } catch (error) {
        context?.customToast({success:false, message:'Something went wrong'})
      }  
    }
  


  return (
    <header className='bg-white w-full px-20 py-5 text-[#446E6D border-b-2 border-[#446e6d25] shadow-md fixed top-0 z-10'>
        <div className=' w-full mx-auto flex justify-between items-center'>
        <div className='flex items-center space-x-4 justify-center'>
        <Link href={`/`}>
        <img alt="logo" width="17" height="17"  className="cursor-pointer hover:animate-slowspin"  src="/logo.svg"/>
        </Link>
        <h1 className='text-[#446E6D] text-lg font-semibold'>Webmedigital</h1>
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
                 <h1 className='text-gray-500 text-md font-bold'>
                  {context?.user && !context?.loading && context?.user?.profile?.name && <span className='flex gap-3 items-center relative'
                    onClick={()=>setprofileopen(!profileopen)}
                    onAbort={()=>setprofileopen(false)} 
                    onBlur={()=>setprofileopen(false)} 
                  >
                    {context?.user?.profile?.avatarUrl === 'https://default-avatar-url.com' ? <User2 className='border-2 border-gray-500 rounded-full' style={{width:'1.8em', height:'1.8em'}}/>: <img style={{width:'1.8em', height:'1.8em'}} className='border-2 border-gray-500 rounded-full' src={context?.user?.profile?.avatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIEd2zxEc_4IQ1jHyniHLECu15zRjkHTBJzA&s'}/>}
                    <span className=''>{`${context?.user?.profile?.name}`}</span>
                    
                    {profileopen && context?.user && context?.user?.role && <div className="absolute top-[200%] right-0 p-3 w-content bg-white rounded-lg overflow-hidden text-gray-600 flex flex-col gap-2
                    shadow-lg"
                      onMouseLeave={()=>setprofileopen(false)}
                    >

                    <span className='flex gap-3 items-center min-w-max border-b pb-3 px-2'>
                    {context?.user?.profile?.avatarUrl === 'https://default-avatar-url.com' ? <User2 className='border-2 border-gray-500 rounded-full' style={{width:'2em', height:'2em'}}/>: <img style={{width:'2em', height:'2em'}} className='border-2 border-gray-500 rounded-full' src={context?.user?.profile?.avatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIEd2zxEc_4IQ1jHyniHLECu15zRjkHTBJzA&s'}/>}
                    <span className='flex flex-col min-w-max'><span>{`${context?.user?.profile?.name}`}</span><span className='font-normal'>{`${context?.user?.email}`}</span></span></span>



                      {/* {
                                  context.user && !context.loading && context.user?.role==='user' &&
                                    // <Link href="/admin">
                                  <p className="text-nowrap flex gap-3 cursor-pointer" onClick={()=>{router.push('/customer');}}>
                                    <User style={{width:'1em', height:'1em'}} /> Customer Dashboard
                                    </p>
                                    // </Link>
                                } */}
                                {
                                  <p title='Logout' className='cursor-pointer text-inherit text-nowrap flex items-center gap-3 hover:bg-gray-100 px-2 py-2 rounded' onClick={handleLogout}>
                                  <LogoutIcon style={{ height:'1em', width:'1em',}}/> Logout
                                  </p>
                                }
                      </div>}
                    
                    </span>}
                  <Link href='/admin/login'>
                  {!context?.user && !context?.loading && 'Please log in!'}
                  </Link>
                    </h1>
                </li>
                
            </ul>
            </nav>
        </div>
    </header>
  )
}
