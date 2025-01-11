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
import CreateIndustry from './createindustry';
import EditIndustry from './editindustry';
import DeleteIndustry from './deleteindustry';
import CreateTestimonial from './createtestimonial';
import EditTestimonial from './edittestimonial';
import Editwebsite from './editwebsite';



export default async function Page({params}) {
  let user = null;
  let login


  try {
    const cookieHeader = cookies(); 
    const userCookie = cookieHeader.get('user')?.value; 
    
    
    
    if (!userCookie) {
      console.log('User cookie not found');
      notFound(); 
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getuserinfo`, {
      headers: {
        Cookie: `user=${userCookie}`, 
      },
      withCredentials: true
    });
    console.log(response?.data);

    user = response?.data?.user;
  } catch (error) {
    console.log(error);
    console.log(error.response?.data?.error);
    if(!login?.data?.loginOn){notFound();}
  }

  if (!user || user?.role !== 'admin') {
    notFound();
  }

  const slug = await params.slug;


  const renderContent = () => {
    if (!slug) {
        return (
          <div className='p-6 pt-24 h-[200vh]'>
          {user && user?.profile?.name && <h1 className='text-2xl font-bold'>Welcome, {user?.profile?.name}!</h1>}
          <p className='mt-4'>You are now logged in.</p>
        </div>
        )
    }
        
    switch (slug[0]) {
      case 'website':
        return <Editwebsite params={slug}/>
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
      case 'industries':
        if(slug[1] === 'create') {
          return <CreateIndustry />
        }else if(slug[1] === 'delete') {
          return <DeleteIndustry/>
        }else if(slug[1] === 'edit') {
          return <EditIndustry />
        }
      case 'testimonials':
        if(slug[1] === 'create') {
          return <CreateTestimonial />
        }
        // else if(slug[1] === 'delete') {
          // return <DeleteIndustry/>
        // }
        else if(slug[1] === 'edit') {
          return <EditTestimonial />
        }
      case 'login':
        return <Login />
      default:
        return (
          <div className='p-6 pt-24 h-[200vh]'>
          {user && user?.profile?.name && <h1 className='text-2xl font-bold'>Welcome, {user?.profile?.name}!</h1>}
          <p className='mt-4'>You are now logged in.</p>
        </div>
        )
    }
    
  };


  return (
    <div className='relative bg-[#F3F4F6]'>
      <Adminnav user={user} login={login?.data?.loginOn}/>
      <div className='w-full relative flex'>
        <Navbar />
        <div className='p-6 pt-28 w-full'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
