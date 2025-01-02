import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import axios from 'axios';
import Adminnav from './adminnav';
import Navbar from './navbar';
import CreateService from './createService';
import DeleteService from './deleteservice';
import EditService from './editservice';
import Login from './login';
import CreateProduct from './createproduct';
import EditProduct from './editproduct';
import DeleteProduct from './deleteproduct';
import CreateProject from './createproject';
import EditProject from './editproject';
import DeleteProject from './deleteproject';


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
    
    
    if (!userCookie && !login?.data?.loginOn) {
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
    if(!login?.data?.loginOn){notFound();}
  }

  if (!user && !login?.data?.loginOn) {
    notFound();
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
      case 'services':
        if(slug[1] === 'create') {
          return <CreateService />
        }else if(slug[1] === 'delete') {
          return <DeleteService />
        }else if(slug[1] === 'edit') {
          return <EditService />
        }
      case 'products':
        if(slug[1] === 'create') {
          return <CreateProduct />
        }else if(slug[1] === 'delete') {
          return <DeleteProduct/>
        }else if(slug[1] === 'edit') {
          return <EditProduct />
        }
      case 'projects':
        if(slug[1] === 'create') {
          return <CreateProject />
        }else if(slug[1] === 'delete') {
          return <DeleteProject/>
        }else if(slug[1] === 'edit') {
          return <EditProject />
        }
      case 'login':
        return <Login />
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
