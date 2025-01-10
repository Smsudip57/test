import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import axios from 'axios';
import Content from './content';
import { title } from 'process';
import { url } from 'inspector';



export default async function Page({params}) {
  let services = null;
  let products = null;
  const Mainservice = [
    {
      name: "Branding",
      title: "Unleash Your Brand’s Potential with Premier Website and Mobile App Development",
      description: "Discover the power of exceptional branding with our top-tier website and mobile app development services.\n\nWe craft visually stunning websites and user-friendly mobile apps that not only represent your brand but also engage and delight your audience. Transform your digital presence and make a lasting impression.",
    },
    {
      name: "Workfrom Anywhere",
      title: "Enhance Your Business with Modern Solutions – Secure and Flexible Work from Anywhere",
      description: "In the fast-paced world of modern business, staying ahead means embracing the latest in digital transformation.\n\nEnter the Microsoft Modern Workplace—a suite of cutting-edge tools and technologies designed to empower your workforce and revolutionize the way you do business.",
    },
    {
      name: "Modern Workplace",
      title: "Lead the Digital Era with State-of-the-Art Technology",
      description: "In the complex world of business management, simplicity is the ultimate sophistication.\n\nElevate your business with our top-tier Network Security and ERP Software services. Shield your digital assets with our advanced network security solutions, featuring state-of-the-art firewall management, real-time intrusion detection, and comprehensive vulnerability assessments. Simultaneously, revolutionize your operations with our ERP software, seamlessly integrating finance, HR, and supply chain into one powerful system. Experience unparalleled efficiency, enhanced decision-making, and robust growth with our tailored solutions designed for businesses of all sizes.",
    },
    {
      name: "Digital",
      title: "Transform Your World with Cutting-Edge Digital Solutions",
      description: "Step into the future with our comprehensive Digital services!\n\nFrom advanced Surveillance Systems that ensure security and peace of mind, to innovative IoT solutions that connect and automate your environment, we provide the technology that empowers your business. Experience seamless integration, enhanced efficiency, and unparalleled control with our state-of-the-art digital offerings",
    },
    {
      name: "Endless Support",
      title: "Endless Support: Your 24/7 Tech Lifeline",
      description: "At Endless Support, we believe in providing seamless, round-the-clock assistance to keep your technology running smoothly.\n\nOur dedicated team of experts is always ready to troubleshoot, guide, and resolve any issues, ensuring your devices and systems are always at their best. Experience uninterrupted productivity and peace of mind with our reliable and efficient support services.",
    },
  ];
  

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/service/getservice`);
    
    services  = response?.data?.services;
  } catch (error) {
    services = [];
  }
  try {
    const productResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/get`);

    products = productResponse?.data?.products;
  } catch (error) {
    console.log(error.response?.data);
    products = [];
  }

  const slug = await params.slug;


  const renderContent = () => {
    if (!slug) {
      notFound();
    }
  
   
    const normalizedMainServices = Mainservice.map((service) =>
      service.name.toLowerCase()
    );
    const slugCategory = decodeURIComponent(slug[0]?.toLowerCase());
    // const slugCategory = 'digital';
    // const slugCategory = 'branding';
    // console.log(slugCategory);
    
    
    if (normalizedMainServices.includes(slugCategory)) {
    // if (false) {
    const filteredServices = services.filter(
        (service) => service.category.toLowerCase() === slugCategory
      );
      const serviceIds = filteredServices.map((service) => service._id);
      
      const filteredProducts = products.filter((product) =>
        serviceIds.includes(product.category)
    );

    const mainservice = Mainservice.find((service) => service.name.toLowerCase() === slugCategory);



      return <Content services={filteredServices} slug={slugCategory} products={filteredProducts} Mainservice={mainservice} />;
    }
  
    // If no match, render 404
    notFound();
  };
  

  return (
    <div className='relative'>
      {renderContent()}
    </div>
  );
}
