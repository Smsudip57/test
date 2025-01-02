import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import axios from 'axios';
import Content from './content';
const industries = [
    "Automotive",
    "Construction",
    "Facility Management",
    "Legal & Administrative",
    "Mechanical & Engineering",
    "Healthcare and Pharmaceuticals",
    "Retail",
    "Logistics and Transportation",
    "Manufacturing",
    "Food & Agriculture",
    "Interior and Fitout",
    "Real Estate"
  ]



export default async function Page({params}) {
  
  const slug = await params.slug;


  const renderContent = () => {
    if (!slug) {
      notFound();
    }

    if(industries.map((industry) => industry.toLowerCase()).includes(decodeURIComponent(slug))){
        return <Content  />;

    }else{
        notFound();
    }
  };
  

  return (
    <div className='relative'>
      {renderContent()}
    </div>
  );
}
