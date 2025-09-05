import { notFound } from 'next/navigation';
import { fetchMultiple } from '@/lib/ssr-fetch';
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
  let products = [];

  try {
    // Use fetchMultiple to get industries, services, and products with caching
    const data = await fetchMultiple(['industries', 'services', 'products']);

    const industries = data.industries || [];
    services = data.services || [];
    products = data.products || [];


    if (industries && industries.length > 0) {
      industry = industries.find((industry) => industry?.Title.toLowerCase() === decodeURIComponent(slug).toLowerCase());
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

    if (slug) {
      return <Content industry={industry} services={services} products={products} />;

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
