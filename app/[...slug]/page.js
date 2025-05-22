import { notFound } from 'next/navigation';
import axios from 'axios';
import Content from './content';

// Define metadata for better SEO
export async function generateMetadata({ params }) {
  const slug = params.slug || [];
  const mainCategory = slug[0]?.toLowerCase() || '';
  
  // Predefined service categories for static metadata
  const serviceMetadata = {
    'branding': {
      title: "Unleash Your Brand's Potential with Premier Website and Mobile App Development",
      description: "Discover the power of exceptional branding with our top-tier website and mobile app development services. We craft visually stunning websites and user-friendly mobile apps that engage and delight your audience.",
    },
    'workfrom-anywhere': {
      title: "Enhance Your Business with Modern Solutions – Secure and Flexible Work from Anywhere",
      description: "In the fast-paced world of modern business, stay ahead with our Microsoft Modern Workplace—a suite of cutting-edge tools and technologies designed to empower your workforce and revolutionize your business.",
    },
    'modern-workplace': {
      title: "Lead the Digital Era with State-of-the-Art Technology",
      description: "Elevate your business with our top-tier Network Security and ERP Software services. Shield your digital assets with advanced security solutions while revolutionizing operations with our seamless ERP software.",
    },
    'digital': {
      title: "Transform Your World with Cutting-Edge Digital Solutions",
      description: "From advanced Surveillance Systems to innovative IoT solutions, we provide the technology that empowers your business with seamless integration, enhanced efficiency, and unparalleled control.",
    },
    'endless-support': {
      title: "Endless Support: Your 24/7 Tech Lifeline",
      description: "Experience uninterrupted productivity with our round-the-clock technical assistance. Our dedicated experts are always ready to troubleshoot, guide, and resolve any issues with your technology.",
    }
  };
  
  // Get metadata for the current category
  const metadata = serviceMetadata[mainCategory] || {
    title: "Professional IT Services & Solutions | Webmedigital",
    description: "Webmedigital offers comprehensive IT services from modern workplace solutions to digital transformation, branding, and 24/7 technical support."
  };
  
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `https://webmedigital.com/${slug.join('/')}`,
      siteName: 'Webmedigital',
      images: [
        {
          url: 'https://webmedigital.com/og-image.jpg',
          width: 1200,
          height: 630,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: ['https://webmedigital.com/og-image.jpg'],
    },
  };
}

export default async function Page({params}) {
  const slug = params.slug || [];
  
  // Predefined service categories with structured metadata
  const Mainservice = {
    "branding": {
      name: "Branding",
      title: "Unleash Your Brand's Potential with Premier Website and Mobile App Development",
      description: "Discover the power of exceptional branding with our top-tier website and mobile app development services.\n\nWe craft visually stunning websites and user-friendly mobile apps that not only represent your brand but also engage and delight your audience. Transform your digital presence and make a lasting impression.",
    },
    "workfrom-anywhere": {
      name: "Workfrom Anywhere",
      title: "Enhance Your Business with Modern Solutions – Secure and Flexible Work from Anywhere",
      description: "In the fast-paced world of modern business, staying ahead means embracing the latest in digital transformation.\n\nEnter the Microsoft Modern Workplace—a suite of cutting-edge tools and technologies designed to empower your workforce and revolutionize the way you do business.",
    },
    "modern-workplace": {
      name: "Modern Workplace",
      title: "Lead the Digital Era with State-of-the-Art Technology",
      description: "Elevate your business with our top-tier Network Security and ERP Software services. Shield your digital assets with our advanced network security solutions, featuring state-of-the-art firewall management, real-time intrusion detection, and comprehensive vulnerability assessments.",
    },
    "digital": {
      name: "Digital",
      title: "Transform Your World with Cutting-Edge Digital Solutions",
      description: "Step into the future with our comprehensive Digital services!\n\nFrom advanced Surveillance Systems that ensure security and peace of mind, to innovative IoT solutions that connect and automate your environment, we provide the technology that empowers your business.",
    },
    "endless-support": {
      name: "Endless Support",
      title: "Endless Support: Your 24/7 Tech Lifeline",
      description: "At Endless Support, we believe in providing seamless, round-the-clock assistance to keep your technology running smoothly.\n\nOur dedicated team of experts is always ready to troubleshoot, guide, and resolve any issues, ensuring your devices and systems are always at their best.",
    }
  };

  try {
    // Optimize API calls by combining them into a single Promise.all request
    const [servicesRes, productsRes, childsRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/service/getservice`),
      axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/get`),
      axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/child/get`)
    ]);
    
    const services = servicesRes?.data?.services || [];
    const products = productsRes?.data?.products || [];
    const childs = childsRes?.data?.products || [];
    
    // Get the current category from the slug
    const category = slug[0]?.toLowerCase();
    const currentMainService = Mainservice[category] || null;
    
    // Pass required props to Content component
    return (
      <Content 
        services={services} 
        products={products} 
        childs={childs} 
        slug={slug} 
        Mainservice={currentMainService}
      />
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return notFound();
  }
}

// Generate static paths for better performance
export async function generateStaticParams() {
  const categories = ['branding', 'workfrom-anywhere', 'modern-workplace', 'digital', 'endless-support'];
  return categories.map(category => ({ slug: [category] }));
}