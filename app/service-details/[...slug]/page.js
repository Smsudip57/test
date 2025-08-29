import React from 'react';
import axios from 'axios';
import ServicePage from './servicePage';
import { notFound } from 'next/navigation';

export default async function AdminPage({ params }) {
  let services;
  try {
    const responseto = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/service/getservice`);
    services = responseto?.data?.services;
  } catch (e) {

  }
  const slug = params.slug

  const renderContent = () => {
    if (!slug) {
      <p>Loading...</p>;
      context.customToast({ success: false, message: 'Something went wrong' });
    }


    const checkService = (name) => {
      const Name = decodeURIComponent(name);
      if (services && services.length > 0 && Name ) {
        // console.log(services);
        const Service = services.find((service) => service.Title === Name || service.slug === Name);
        
        // console.log(Service);
        return  Service ;
      } else {
        return false;
      }
    }

    if (checkService(slug[0])) {
      const Service = checkService(slug[0]);
      return <ServicePage details={Service} />;
    } else {
      return notFound();
    }


  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}
