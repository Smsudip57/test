"use client";
import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import EastIcon from "@mui/icons-material/East";
import StarsCanvas from "@/components/main/StarBackground";
import Projects from "@/components/main/Projects";
import Industies from "@/components/main/Industies";
import CaseStudy from "@/components/main/CaseStudy";
import { MyContext } from "@/context/context";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// Helper component for content points
const PointComp = ({ points }) => {
  return (
    <div className="flex flex-col gap-8 mt-10">
      {points?.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="shrink-0 pt-1">
            <div className="bg-[#446E6D] w-3 h-3 rounded-full"></div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#202124]">{item?.title}</h3>
            <p className="text-[#666666] mt-2">{item?.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Firewall({ services, products, slug, Mainservice, childs }) {
  const [main, setMain] = useState(0);
  const rotationIntervalRef = useRef(null);
  const [currentDisplay, setCurrentDisplay] = useState({
    serviceIndex: 0,
    productData: null,
    childData: null,
  });
  const [itemsforChilds, setItemsforChilds] = useState([]);

  const { setChatBoxOpen } = useContext(MyContext);

  // Find the relevant service category based on URL
  useEffect(() => {
    if (!services?.length) return;

    const val = window.location.href.split("?")?.[1];
    const search = val ? val.split("=")?.[1]?.toLowerCase() : "";
    const index = services.findIndex((item) =>
      decodeURIComponent(search).includes(item?.Title?.toLowerCase())
    );
    setMain(index !== -1 ? index : 0);
  }, [services]);

  // Calculate filtered products and children once when dependencies change
  const { servicebasedProducts, filteredChildren } = useMemo(() => {
    if (!services?.[main] || !products?.length) {
      return { servicebasedProducts: [], filteredChildren: [] };
    }

    const selectedService = services[main];
    const filteredProducts = products.filter(
      (product) => product?.category === selectedService?._id
    );

    const relatedChildren = [];
    if (childs?.length) {
      filteredProducts.forEach((product) => {
        const childProduct = childs.find(
          (child) => child?.category === product?._id
        );
        if (childProduct) {
          relatedChildren.push(childProduct);
        }
      });
    }

    return { servicebasedProducts: filteredProducts, filteredChildren: relatedChildren };
  }, [main, services, products, childs]);



  // Fixed useEffect with proper dependencies and selectedService reference
  useEffect(() => {
    if (!childs?.length || !products?.length || !services?.[main]) return;

    const fetchChildData = async () => {
      try {
        const selectedService = services[main];
        const filteredProducts = products.filter(
          (product) => product?.category === selectedService?._id
        );
        const relatedChildren = [];
        filteredProducts.forEach((product) => {
          const childrenForProduct = childs.filter(
            (child) => child?.category === product?._id
          );
          relatedChildren.push(...childrenForProduct);
        });
        if (relatedChildren.length === 0) {
          console.log("No related children found for this service");
          return;
        }
        const promises = relatedChildren.map(child =>
          axios.get(process.env.NEXT_PUBLIC_API_URL || "https://server.webmedigital.com/api/products/catName", {
            params: { catName: child?.Title },
            timeout: 5000
          })
            .then(res => ({
              id: child?._id,
              title: child?.Title,
              category: child?.category,
              products: res?.data?.products || []
            }))
            .catch(error => {
              console.error(`Error fetching data for ${child?.Title}:`, error);
              return {
                id: child?._id,
                title: child?.Title,
                category: child?.category,
                products: [],
                error: true
              };
            })
        );

        // Wait for all requests to complete
        const results = await Promise.all(promises);

        // Only filter out completely failed requests
        const validResults = results.filter(item => item !== null);

        // Log success for debugging
        console.log(`Successfully fetched data for ${validResults.length} child products`);

        // Update state
        setItemsforChilds(validResults);
      } catch (error) {
        console.error("Error in batch child data fetching:", error);
      }
    };

    fetchChildData();
  }, [childs, products, services, main]); // Include all dependencies

  useEffect(() => {
    if (!servicebasedProducts.length) return;

    setCurrentDisplay(prev => ({
      ...prev,
      productData: servicebasedProducts[prev.serviceIndex],
      childData: filteredChildren.find(
        child => child?.category === servicebasedProducts[prev.serviceIndex]?._id
      ) || null
    }));
  }, [servicebasedProducts, filteredChildren]);

  // Content rotation effect with better performance
  useEffect(() => {
    if (!servicebasedProducts.length) return;

    const rotateContent = () => {
      setCurrentDisplay(prev => {
        const nextIndex = (prev.serviceIndex + 1) % servicebasedProducts.length;
        const nextProduct = servicebasedProducts[nextIndex];
        const nextChild = filteredChildren.find(
          child => child?.category === nextProduct?._id
        ) || null;

        return {
          serviceIndex: nextIndex,
          productData: nextProduct,
          childData: nextChild
        };
      });
    };

    // Clear any existing interval before setting a new one
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
    }

    // Set interval for rotation and store reference
    rotationIntervalRef.current = setInterval(rotateContent, 8000);

    // Cleanup when component unmounts or dependencies change
    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, [servicebasedProducts, filteredChildren]);

  // Handler for consultation button with memoization for performance
  const handleConsultation = useCallback(() => {
    setChatBoxOpen(true);
  }, [setChatBoxOpen]);

  // Current service data for easier rendering
  const currentService = services?.[main];
  const { productData, childData } = currentDisplay;

  // SEO structured data
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": currentService?.Title || "Our Services",
    "description": currentService?.deltail || Mainservice?.description || "Professional services from Webmedigital",
    "provider": {
      "@type": "Organization",
      "name": "Webmedigital",
      "url": "https://webmedigital.com/",
      "logo": "https://webmedigital.com/logo.png"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }), [currentService, Mainservice]);

  // Page title and meta description
  const pageTitle = useMemo(() => (
    Mainservice?.title || `${currentService?.Title} - Professional Solutions | Webmedigital`
  ), [Mainservice, currentService]);

  const pageDescription = useMemo(() => (
    Mainservice?.description || `Learn more about our ${currentService?.Title} services and solutions. Professional digital transformation and IT services from Webmedigital.`
  ), [Mainservice, currentService]);

  return (
    <div className="w-full relative">
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={pageDescription}
        />
        <meta name="keywords" content={`${currentService?.Title || ''}, IT services, digital transformation, webmedigital, ${slug.join(', ')}`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://webmedigital.com/${slug.join('/')}`} />

        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={currentService?.image || "https://webmedigital.com/default-og.jpg"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://webmedigital.com/${slug.join('/')}`} />
        <meta property="og:site_name" content="Webmedigital" />

        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={currentService?.image || "https://webmedigital.com/default-og.jpg"} />

        {/* Structured data for rich results */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      {/* Background elements */}
      <div className="min-h-[650px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni z-[-10]" aria-hidden="true"></div>
      <div className="min-h-screen w-full absolute" aria-hidden="true">
        <StarsCanvas />
      </div>

      <div className="w-full relative">
        <div className="min-h-full w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni z-[-10]" aria-hidden="true"></div>

        {/* Hero section */}
        <section className="w-full lg:w-[90%] max-w-[1920px] mx-auto">
          <div className="w-full h-full py-[19vh]">
            <div className="w-[90%] xl:w-[1280px] mx-auto flex flex-col xl:flex-row">
              {/* Service info */}
              <div className="xl:w-[50%] flex flex-col justify-around gap-10 z-30 order-2 xl:order-1">
                <h1 className="text-2xl xl:text-[36px] font-bold xl:leading-[45px] font-sans">
                  {currentService?.Title}
                </h1>
                <p className="pr-10 font-medium whitespace-pre-wrap">
                  {currentService?.deltail}
                </p>
                <div className="flex gap-6">
                  <button
                    className="align-start bg-[#446E6D] text-[#fff] px-4 py-2 rounded hover:opacity-80 text-sm transition-all duration-300"
                    onClick={handleConsultation}
                    aria-label="Book a free consultation"
                  >
                    Book Free Consultation
                  </button>
                  <Link
                    href={`/service-details/${currentService?.Title}`}
                    className="align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base flex items-center transition-colors duration-300"
                    aria-label={`Explore ${currentService?.Title}`}
                  >
                    <span className="mr-1">Explore</span>
                    <EastIcon fontSize="inherit" />
                  </Link>
                </div>
              </div>

              {/* Service image */}
              <div className="xl:w-[50%] flex justify-center items-center z-30 order-1 xl:order-2">
                <div className="w-full  flex justify-center mb-12 xl:flex-wrap items-center">
                  {currentService?.image && (
                    <div className="w-full  text-center text-nowrap basis-[65%] m-3 shadow-gray-400 overflow-hidden rounded-md">
                      <a
                        href="#details"
                        className="w-full cursor-pointer block relative aspect-[4/3]"
                        aria-label={`View details of ${currentService?.Title}`}
                      >
                        <Image
                          src={currentService.image}
                          alt={`${currentService?.Title} service illustration`}
                          className="w-full rounded-md object-cover hover:opacity-80 transition-opacity duration-300"
                          width={100}
                          height={100}
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Services, Products, and Projects section */}
      <main className="min-h-screen w-full lg:w-[90%] max-w-[1920px] mx-auto">
        <div className="w-full h-full">
          <div
            className="w-[90%] xl:w-[1280px] mx-auto flex flex-col xl:flex-row pt-16 gap-6"
            id="details"
          >
            {/* Product display */}
            {servicebasedProducts.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={productData?._id || "product-placeholder"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col basis-1/3 justify-between items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]"
                >
                  <div className="flex flex-col justify-center items-start gap-10 w-full">
                    {productData?.image && (
                      <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
                        <Image
                          src={productData.image}
                          alt={`${productData.Title} product image`}
                          className="object-cover rounded-md"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </div>
                    )}
                    <h2 className="text-2xl font-semibold font-sans">
                      {productData?.Title}
                    </h2>
                    <div className="w-full flex flex-col gap-4 pr-3 whitespace-pre-wrap">
                      {productData?.detail}
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 my-16">
                    <button
                      className="text-sm hover:opacity-80 active:scale-95 bg-[#446E6D] text-white rounded py-2 px-4 transition-all duration-300"
                      onClick={handleConsultation}
                    >
                      Get it today!
                    </button>
                    <Link
                      href={`/details/services/${productData?.Title}`}
                      className="align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base flex items-center transition-colors duration-300"
                    >
                      <span className="mr-1">Discover</span>
                      <EastIcon fontSize="inherit" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex justify-center items-center w-full py-10 bg-gray-50 rounded-md">
                {/* <p className="text-lg text-gray-500">No products available for this service</p> */}
              </div>
            )}

            {/* Child product display */}
            {childData ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={childData?._id || "child-placeholder"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col basis-1/3 justify-between items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px]"
                >
                  <div className="flex flex-col justify-center items-start gap-10 w-full">
                    {childData.image && (
                      <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden">
                        <Image
                          src={childData.image}
                          alt={`${childData.Title} product image`}
                          className="object-cover rounded-md"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                        />
                      </div>
                    )}
                    <h2 className="text-2xl font-semibold font-sans">
                      {childData.Title}
                    </h2>
                    <div className="w-full flex flex-col gap-4 pr-3 whitespace-pre-wrap">
                      {childData.detail}
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 my-16">
                    <button
                      className="text-sm hover:opacity-80 active:scale-95 bg-[#446E6D] text-white rounded py-2 px-4 transition-all duration-300"
                      onClick={handleConsultation}
                    >
                      Get it today!
                    </button>
                    <Link
                      href={`/details/childs/${childData.Title}`}
                      className="align-start hover:bg-[#00000028] text-black px-4 py-2 rounded hover:text-white text-base flex items-center transition-colors duration-300"
                    >
                      <span className="mr-1">Discover</span>
                      <EastIcon fontSize="inherit" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              // Only show this if there should be a child but none was found
              servicebasedProducts.length > 0 && (
                <div className="flex justify-center items-center basis-1/3 py-10 bg-gray-50 rounded-md">
                  {/* <p className="text-lg text-gray-500">No child products available</p> */}
                </div>
              )
            )}
            {/* Products grid for current child */}
            {childData && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`child-products-${childData._id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col basis-1/3 justify-start items-start z-30 mx-3 p-6 rounded-md shadow-lg shadow-gray-400 border-gray-400 border-[1px] overflow-hidden"
                >
                  <h2 className="text-xl font-semibold font-sans w-full mb-4 pb-2 border-b border-gray-200">
                    {childData.Title} Products
                  </h2>

                  {/* Find products for this child */}
                  {(() => {
                    const productsForChild = itemsforChilds.find(item => item?.id === childData?._id);

                    if (!productsForChild || !productsForChild.products || productsForChild.products.length === 0) {
                      return (
                        <div className="w-full h-full flex justify-center items-center py-8">
                          {/* <p className="text-gray-500">No products available</p> */}
                        </div>
                      );
                    }

                    return (
                      <div className="w-full flex flex-col max-h-[500px] overflow-y-auto pr-2">
                        {productsForChild.products.map((product) => (
                          <div
                            key={product._id}

                            className="group  min-w-full rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <Link href={`https://store.webmedigital.com/product/${product._id}`}
                              target="_blank"
                            >
                              {/* Image container with fixed aspect ratio */}
                              <div className="w-full aspect-[4/3] relative overflow-hidden">
                                {product.images && product.images[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">No image</span>
                                  </div>
                                )}

                                {/* Simple discount badge */}
                                {product.discount > 0 && (
                                  <div className="absolute top-2 right-2 bg-[#446E6D] text-white text-xs font-bold px-2 py-1 rounded z-10">
                                    {product.discount}% OFF
                                  </div>
                                )}
                              </div>

                              {/* Clean, minimal product information */}
                              <div className="p-3">
                                <h3 className="font-medium text-sm text-gray-800 line-clamp-1 mb-1">{product.name}</h3>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#446E6D]">RS {product.price}</span>
                                    {product.oldPrice > product.price && (
                                      <span className="text-gray-400 line-through text-xs">${product.oldPrice}</span>
                                    )}
                                  </div>

                                  {product.rating && (
                                    <div className="text-xs text-gray-600">
                                      <span className="text-yellow-500">★</span> {product.rating}/5
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* View all button */}
                  <div className="w-full flex justify-center mt-4">
                    <Link
                      href={`/products/${childData.Title}`}
                      className="text-sm hover:bg-[#446E6D] hover:text-white border border-[#446E6D] text-[#446E6D] px-4 py-2 rounded flex items-center transition-colors duration-300"
                    >
                      View All Products
                      <EastIcon fontSize="small" className="ml-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Projects, Industries, and Case Studies sections */}
          <section aria-labelledby="related-projects-heading" className="mt-20">
            <h2 id="related-projects-heading" className="sr-only">Related Projects</h2>
            <Projects />
          </section>

          <section aria-labelledby="industries-heading" className="mt-16">
            <h2 id="industries-heading" className="sr-only">Industries We Serve</h2>
            <Industies />
          </section>

          <section aria-labelledby="case-studies-heading" className="w-[90%] xl:w-full mx-auto mt-16">
            <h2 id="case-studies-heading" className="sr-only">Case Studies</h2>
            <CaseStudy />
          </section>
        </div>
      </main>
    </div>
  );
}