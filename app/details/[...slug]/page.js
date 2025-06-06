import React from 'react';
import axios from 'axios';
import Project from './project';
import ServicePage from './servicePage';
import { notFound } from 'next/navigation';

export default async function AdminPage({params}) {
  let project;
  let services;
  let products;
  let childs
  try {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/get`);
  if (response.data.success) {
    project = response.data.data;
  }
    const responseto = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/service/getservice`);
    const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/get`);
    const childREs = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/child/get`);

    services  = responseto?.data?.services;
    products = productResponse?.data?.products;
    childs = childREs?.data?.products;
  } catch (e) {
    
  }
  const slug = params.slug

  const renderContent = () => {
    if (!slug) {
        <p>Loading...</p>; 
        context.customToast({success:false, message:'Something went wrong'});
    }

  const checkProject = (name) => {
    const Name = decodeURIComponent(name);
    if (project && project.length > 0) {
    const Project = project.find((project) => project.Title === Name || project.slug === Name);
      return Project;
    }else{
      return false;
    }
  }


  const checkService = (name) => {
    const Name = decodeURIComponent(name);
    if (products && products.length > 0 && Name) {
      const Product = products.find((product) => product?.slug === Name || product?.Title === Name);
      return Product
    }else{
      return false;
    }
  }
  const checkChild = (name) => {
    const Name = decodeURIComponent(name);
    if (childs && childs.length > 0 && Name) {
      const Product = childs.find((product) => product?.slug === Name || product?.Title === Name);
      return Product
    }else{
      return false;
    }
  }
        
  if(slug[0] === 'services'){
    if(checkService(slug[1])){
      const serviceWithProduct = checkService(slug[1]);
      return <ServicePage details={serviceWithProduct} />;
    }else{
        return notFound(); 
    }
  }
  if(slug[0] === 'childs'){
    if(checkChild(slug[1])){
      const serviceWithProduct = checkChild(slug[1]);
      return <ServicePage details={serviceWithProduct} />;
    }else{
        return notFound(); 
    }
  }else if(slug[0] === 'projects'){
    if(checkProject(slug[1])){
      const project = checkProject(slug[1]);
      return <Project project={project} />;
    }else{
        return notFound(); 
    }
  }
    
  };

  return (
    <div>
        {renderContent()}
    </div>
  );
}
