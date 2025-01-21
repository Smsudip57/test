'use client'
import { useRouter } from 'next/navigation';
import Navbar from './navbarr';
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



export default async function Page({params}) {
  const router = useRouter();
  const slug = params.filter((element,i) => {
    if(i !== 0) {
      return element
    }
  });;
  const user = {}
  const login = {}


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
        router.replace('/customer/website/services/create');
        return <CreateService/>
    }
    
  };


  return (
    <div className='relative'>
      <div className='w-full relative flex flex-col gap-5'>
        <Navbar />
        <div className='bg- rounded-md sh  w-full'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
