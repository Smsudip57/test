'use client'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Adminnav from './adminnav';
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
import CreateBlog from './createblog';
import EditBlog from './editblog';
import CreateKnowledgebase from './createKnowledgebase';
import EditKnowledgebase from './editknowlegdebase';
import CreateFaq from './createFaq';
import EditFaq from './editfaq';
import CreateServiceDetails from './createServiceDetails';
import CreateChildService from './crateChild';
import EditChildService from './editChild';



export default function Page({params}) {
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
      case 'blog':
        if(slug[1] === 'create') {
          return <CreateBlog />
        }
        // else if(slug[1] === 'delete') {
          // return <DeleteIndustry/>
        // }
        else if(slug[1] === 'edit') {
          return <EditBlog />
        }
      case 'knowledgebase':
        if(slug[1] === 'create') {
          return <CreateKnowledgebase />
        }
        // else if(slug[1] === 'delete') {
          // return <DeleteIndustry/>
        // }
        else if(slug[1] === 'edit') {
          return <EditKnowledgebase />
        }
      case 'faq':
        if(slug[1] === 'create') {
          return <CreateFaq />
        }
        // else if(slug[1] === 'delete') {
          // return <DeleteIndustry/>
        // }
        else if(slug[1] === 'edit') {
          return <EditFaq />
        }
      case 'service-details':
        if(slug[1] === 'create') {
          return <CreateServiceDetails />
        }
        // else if(slug[1] === 'delete') {
          // return <DeleteIndustry/>
        // }
        else if(slug[1] === 'edit') {
          return <EditFaq />
        }
      case 'child-service':
        if(slug[1] === 'create') {
          return <CreateChildService />
        }
        // else if(slug[1] === 'delete') {
          // return <DeleteIndustry/>
        // }
        else if(slug[1] === 'edit') {
          return <EditChildService />
        }
      case 'login':
        return <Login />
      default:
        router.replace('/admin/cms/website/services/create');
        return <CreateService/>
    }
    
  };


  return (
    <div className='relative'>
      <div className='w-full relative flex flex-col gap-5'>
        <Navbar />
        <div className='bg- rounded-md sh  p-4 md:p-6 pt-0 md:pt-2 w-full'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
