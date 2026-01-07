import { notFound } from 'next/navigation';
import { fetchV1ByKey } from '@/lib/ssr-fetch';
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



export default async function Page({ params }) {

  const slug = await params.slug;

  let industry;
  let services = [];
  let relatedChikfdServices = [];

  try {
    // Use fetchV1ByKey to get industry by slug with all related data
    industry = await fetchV1ByKey('industries', slug);

    if (industry && industry.data) {
      services = industry.data.relatedServices || [];
      relatedChikfdServices = industry.data.relatedChikfdServices || [];
    }
  } catch (error) {
    // console.error('Error fetching data:', error?.message);
    industry = null;
    services = [];
    products = [];
  }

  const renderContent = () => {
    if (!slug) {
      notFound();
    }

    if (industry) {
      return <Content industry={industry.data || industry}  />;
    } else {
      notFound();
    }
  };


  return (
    <div className='relative'>
      {renderContent()}
    </div>
  );
}
