import React from 'react';
import axios from 'axios';
import Project from './project';
import ServicePage from './servicePage';
import { notFound } from 'next/navigation';

export default async function AdminPage({params}) {
  let project;
  let services;
  let products;
  try {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/project/get`);
  if (response.data.success) {
    project = response.data.data;
  }
    const responseto = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/service/getservice`);
    const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/get`);

    services  = responseto?.data?.services;
    products = productResponse?.data?.products;
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
    const Project = project.find((project) => project.Title === Name);
      return Project;
    }else{
      return false;
    }
  }


  const checkService = (name) => {
    const Name = decodeURIComponent(name);
    if (services && services.length > 0 && Name && products && products.length > 0) {
      const Service = services.find((service) => service.Title === Name);
      const Product = products.filter((product) => product?.category === Service?._id);
      return {Service, Product};
    }else{
      return false;
    }
  }
        
  if(slug[0] === 'products'){
    if(checkService(slug[1])){
      const serviceWithProduct = checkService(slug[1]);
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
