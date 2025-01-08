import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import axios from 'axios';
import Adminnav from './adminnav';
import Navbar from './navbar';




export default async function Page({params}) {
  let user = null;
  let login


  try {
    const cookieHeader = cookies(); 
    const userCookie = cookieHeader.get('user')?.value; 
    
    try {
      login = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/setting/checkLogin`, {
      headers: {
        Cookie: `user=${userCookie}`, 
      },

    });
    } catch (error) {
    }
    
    
    if (!userCookie) {
      notFound();
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getuserinfo`, {
      headers: {
        Cookie: `user=${userCookie}`, 
      },
    });

    user = response?.data?.user;
  } catch (error) {
    console.log(error.response?.data?.error);
    // if(!login?.data?.loginOn){notFound();}
  }

  if (!user || user?.role !== 'admin') {
    // notFound();
  }

  const slug = await params.slug;


  const renderContent = () => {
    if (!slug) {
        return (
          <div className='p-6 pt-24 h-[200vh]'>
          {user && user.name && <h1 className='text-2xl font-bold'>Welcome, {user.name}!</h1>}
          <p className='mt-4'>You are now logged in.</p>
        </div>
        )
    }
        
    switch (slug[0]) {
      
      default:
        return (
          <div className='p-6 pt-24 h-[200vh]'>
          {user && user.name && <h1 className='text-2xl font-bold'>Welcome, {user.name}!</h1>}
          <p className='mt-4'>You are now logged in.</p>
        </div>
        )
    }
    
  };


  return (
    <div className='relative'>
      <Adminnav user={user} login={login?.data?.loginOn}/>
      <div className='w-full relative flex'>
        <Navbar />
        <div className='p-6 pt-24 w-full'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
