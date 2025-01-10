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

  let industry ;
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/industry/get`);
    if (response.data.success) {
      industry = response.data.industries.find((industry) => industry?.Title.toLowerCase() === decodeURIComponent(slug).toLowerCase());
    }
  } catch (error) {
    industry = null
  }


  const renderContent = () => {
    if (!slug) {
      notFound();
    }

    if(true){
        return <Content industry={industry} />;

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
