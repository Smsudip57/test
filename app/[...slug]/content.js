"use client";
import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import EastIcon from "@mui/icons-material/East";
import StarsCanvas from "@/components/main/StarBackground";
import Projects from "@/components/main/Projects";
import Industies from "@/components/main/Industies";
import CaseStudy from "@/components/main/CaseStudy";
import { MyContext } from "@/context/context";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Star } from "lucide-react";

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
            <h3 className="text-xl font-semibold text-[#202124]">
              {item?.title}
            </h3>
            <p className="text-[#666666] mt-2">{item?.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Firewall({
  services,
  products,
  slug,
  Mainservice,
  childs,
}) {
  const rotationIntervalRef = useRef(null);
  const [currentDisplay, setCurrentDisplay] = useState({
    serviceIndex: 0,
    productData: null,
    childData: null,
  });
  const [itemsforChilds, setItemsforChilds] = useState([]);

  const { setChatBoxOpen } = useContext(MyContext);

  // Find the selected service based on Mainservice
  const selectedService = useMemo(() => {
    if (!Mainservice || !services?.length) return null;

    // If Mainservice has serviceData (specific service), use that directly
    if (Mainservice.serviceData) {
      return Mainservice.serviceData;
    }

    // Otherwise find the service by name
    return services.find(
      (service) =>
        service?.Title?.toLowerCase() === Mainservice?.name?.toLowerCase() ||
        service?.category?.toLowerCase() === Mainservice?.name?.toLowerCase()
    );
  }, [Mainservice, services]);

  // Calculate filtered products and children once when dependencies change
  const { servicebasedProducts, filteredChildren } = useMemo(() => {
    if (!selectedService || !products?.length) {
      return { servicebasedProducts: [], filteredChildren: [] };
    }

    // Find products related to this service
    const filteredProducts = products.filter(
      (product) => product?.category === selectedService?._id
    );

    // Find children related to these products
    const relatedChildren = [];
    if (childs?.length) {
      filteredProducts.forEach((product) => {
        const childrenForProduct = childs.filter(
          (child) => child?.category === product?._id
        );
        relatedChildren.push(...childrenForProduct);
      });
    }

    return {
      servicebasedProducts: filteredProducts,
      filteredChildren: relatedChildren,
    };
  }, [selectedService, products, childs]);

  // Fetch child product data
  useEffect(() => {
    if (!filteredChildren?.length) return;

    const fetchChildData = async () => {
      try {
        const promises = filteredChildren.map((child) =>
          axios
            .get("https://server.webmedigital.com/api/products/getbytag", {
              params: { tag: child?.itemsTag },
              timeout: 5000,
            })
            .then((res) => ({
              id: child?._id,
              title: child?.Title,
              category: child?.category,
              products: res?.data || [],
            }))
            .catch((error) => {
              return {
                id: child?._id,
                title: child?.Title,
                category: child?.category,
                products: [],
                error: true,
              };
            })
        );

        const results = await Promise.all(promises);
        const validResults = results.filter((item) => item !== null);
        // console.log(`Successfully fetched data for ${validResults.length} child products`);
        setItemsforChilds(validResults);
      } catch (error) {
        console.error("Error in batch child data fetching:", error);
      }
    };

    fetchChildData();
  }, [filteredChildren]);

  // Update current display when products or children change
  useEffect(() => {
    if (!servicebasedProducts.length) return;

    setCurrentDisplay((prev) => ({
      ...prev,
      productData: servicebasedProducts[prev.serviceIndex],
      childData:
        filteredChildren.find(
          (child) =>
            child?.category === servicebasedProducts[prev.serviceIndex]?._id
        ) || null,
    }));
  }, [servicebasedProducts, filteredChildren]);

  // Content rotation effect with better performance
  useEffect(() => {
    if (!servicebasedProducts.length) return;

    const rotateContent = () => {
      setCurrentDisplay((prev) => {
        const nextIndex = (prev.serviceIndex + 1) % servicebasedProducts.length;
        const nextProduct = servicebasedProducts[nextIndex];
        const nextChild =
          filteredChildren.find(
            (child) => child?.category === nextProduct?._id
          ) || null;

        return {
          serviceIndex: nextIndex,
          productData: nextProduct,
          childData: nextChild,
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
  const currentService = Mainservice?.serviceData || selectedService;

  const { productData, childData } = currentDisplay;

  // SEO structured data
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: currentService?.Title || "Our Services",
      description:
        currentService?.deltail ||
        Mainservice?.description ||
        "Professional services from Webmedigital",
      provider: {
        "@type": "Organization",
        name: "Webmedigital",
        url: "https://webmedigital.com/",
        logo: "https://webmedigital.com/logo.png",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
    [currentService, Mainservice]
  );

  // Page title and meta description
  const pageTitle = useMemo(
    () =>
      Mainservice?.title ||
      `${currentService?.Title} - Professional Solutions | Webmedigital`,
    [Mainservice, currentService]
  );

  const pageDescription = useMemo(
    () =>
      currentService?.deltail ||
      Mainservice?.description ||
      `Learn more about our ${
        currentService?.Title || "professional"
      } services and solutions. Professional digital transformation and IT services from Webmedigital.`,
    [Mainservice, currentService]
  );

  return (
    <div className="w-full relative">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={`${
            currentService?.Title || ""
          }, IT services, digital transformation, webmedigital, ${slug.join(
            ", "
          )}`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://webmedigital.com/${slug.join("/")}`}
        />

        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content={
            currentService?.image || "https://webmedigital.com/default-og.jpg"
          }
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://webmedigital.com/${slug.join("/")}`}
        />
        <meta property="og:site_name" content="Webmedigital" />

        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content={
            currentService?.image || "https://webmedigital.com/default-og.jpg"
          }
        />

        {/* Structured data for rich results */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      {/* Background elements */}
      <div
        className="min-h-[650px] w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni z-[-10]"
        aria-hidden="true"
      ></div>
      <div className="min-h-screen w-full absolute" aria-hidden="true">
        <StarsCanvas />
      </div>

      <div className="w-full relative">
        <div
          className="min-h-full w-full bg-[#C1EBE7] bg-no-repeat bg-cover absolute uni z-[-10]"
          aria-hidden="true"
        ></div>

        {/* Hero section */}
        <section className="w-full lg:w-[90%] max-w-[1920px] mx-auto">
          <div className="w-full h-full py-[19vh]">
            <div className="w-[90%] xl:w-[1280px] mx-auto flex flex-col xl:flex-row">
              {/* Service info */}
              <div className="xl:w-[50%] flex flex-col justify-around gap-10 z-30 order-2 xl:order-1">
                <h1 className="text-2xl xl:text-[36px] font-bold xl:leading-[45px] font-sans">
                  {Mainservice?.title || currentService?.Title}
                </h1>
                <p className="pr-10 font-medium whitespace-pre-wrap">
                  {currentService?.deltail || Mainservice?.description}
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
                    href={`/service-details/${
                      currentService?.slug ||
                      currentService?.Title?.toLowerCase()
                    }`}
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
                <div className="w-full flex justify-center mb-12 xl:flex-wrap items-center">
                  {currentService?.image && (
                    <div className="w-full text-center text-nowrap basis-[65%] m-3 shadow-gray-400 overflow-hidden rounded-md">
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
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
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
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
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
                  {/* Find products for this child */}
                  {(() => {
                    const productsForChild = itemsforChilds.find(
                      (item) => item?.id === childData?._id
                    );

                    if (
                      !productsForChild ||
                      !productsForChild.products ||
                      productsForChild.products.length === 0
                    ) {
                      return (
                        <div className="w-full h-full flex justify-center items-center py-8">
                          {/* <p className="text-gray-500">No products available</p> */}
                        </div>
                      );
                    }

                    return (
                      <div className="w-full flex flex-col min-h-full overflow-y-auto pr-2">
                        {productsForChild.products
                          ?.slice(0, 1)
                          ?.map((product) => (
                            <div
                              key={product._id}
                              className="group w-full rounded-xl overflow-hidden bg-whitetransition-all duration-300  flex flex-col h-full"
                            >
                              <Link
                                href={`https://store.webmedigital.com/product/${product._id}`}
                                target="_blank"
                                className="block flex-1 flex flex-col"
                              >
                                {/* Image container with badges */}
                                <div className="relative w-full aspect-[4/3] overflow-hidden">
                                  {product.images && product.images[0] ? (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                      fill
                                      sizes="(max-width: 768px) 50vw, 33vw"
                                      placeholder="blur"
                                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                      <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-8 h-8 text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </div>
                                        <span className="text-sm text-gray-400 font-medium">
                                          No Image Available
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Discount badge */}
                                  {product.discount > 0 && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                                      <span className="drop-shadow-sm">
                                        {product.discount}% OFF
                                      </span>
                                    </div>
                                  )}

                                  {/* Rating badge */}
                                  {(product?.rating ||
                                    product?.rating === 0) && (
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                                      <span>{product.rating}</span>
                                    </div>
                                  )}

                                  {/* Hover overlay */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                                </div>

                                {/* Product content - flex-1 to take available space */}
                                <div className="p-5 flex flex-col flex-1">
                                  {/* Main content area - grows to fill space */}
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 leading-tight group-hover:text-[#446E6D] transition-colors duration-200">
                                      {product.name}
                                    </h3>

                                    {/* Product description */}
                                    {product.description && (
                                      <div className="mb-4">
                                        <div className="relative">
                                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#446E6D] to-[#37c0bd] rounded-full"></div>
                                          <div className="pl-4 pr-2">
                                            <p className=" text-gray-600 line-clamp-18 mt-6">
                                              &quot;{product.description}&quot;
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Additional product features */}
                                    {product.features &&
                                      product.features.length > 0 && (
                                        <div className="mt-4">
                                          <div className="flex flex-wrap gap-1">
                                            {product.features
                                              .slice(0, 3)
                                              .map((feature, index) => (
                                                <span
                                                  key={index}
                                                  className="inline-block px-2 py-1 bg-[#446E6D]/10 text-[#446E6D] text-xs rounded-md font-medium"
                                                >
                                                  {feature}
                                                </span>
                                              ))}
                                            {product.features.length > 3 && (
                                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                                +{product.features.length - 3}{" "}
                                                more
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  {/* Price section - Always at bottom */}
                                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
                                    {/* Price section */}
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl font-bold text-[#446E6D]">
                                        RS {product.price.toLocaleString()}
                                      </span>
                                      {product.oldPrice > product.price && (
                                        <span className="text-sm text-gray-400 line-through">
                                          RS {product.oldPrice.toLocaleString()}
                                        </span>
                                      )}
                                    </div>

                                    {/* Call to action */}
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                      <span className="text-xs text-green-600 font-medium">
                                        Available
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Hover action bar */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#446E6D] to-[#446E6D]/90 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                      </svg>
                                      <span className="text-sm font-medium">
                                        View Product
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs opacity-90">
                                        Visit Store
                                      </span>
                                      <svg
                                        className="w-3 h-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                      </div>
                    );
                  })()}

                  {/* View all button */}
                  {/* <div className="w-full flex justify-center mt-4">
                    <Link
                      href={`/products/${childData.Title}`}
                      className="text-sm hover:bg-[#446E6D] hover:text-white border border-[#446E6D] text-[#446E6D] px-4 py-2 rounded flex items-center transition-colors duration-300"
                    >
                      View All Products
                      <EastIcon fontSize="small" className="ml-1" />
                    </Link>
                  </div> */}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Projects, Industries, and Case Studies sections */}
          <section
            aria-labelledby="related-projects-heading"
            className="mt-20 relative z-30"
          >
            <h2 id="related-projects-heading" className="sr-only">
              Related Projects
            </h2>
            <Projects service={currentService?._id} />
          </section>

          <section aria-labelledby="industries-heading" className="mt-16">
            <h2 id="industries-heading" className="sr-only">
              Industries We Serve
            </h2>
            <Industies parent={currentService?._id} />
          </section>

          <section
            aria-labelledby="case-studies-heading"
            className="w-[90%] xl:w-full mx-auto mt-16"
          >
            <h2 id="case-studies-heading" className="sr-only">
              Case Studies
            </h2>
            <CaseStudy parent={currentService?._id} />
          </section>
        </div>
      </main>
    </div>
  );
}
