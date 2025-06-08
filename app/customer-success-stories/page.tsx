"use client";
import React, { useState, useEffect } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import axios from "axios";
import { Loader2, Play } from "lucide-react";
import Link from "next/link";
import Video from "@/components/shaerd/Video";


interface Testimonial {
  _id: string;
  Testimonial: string;
  video: string;
  image: string;
  postedBy: string;
  role: string;
  relatedService?: any;
  relatedIndustries?: any;
  relatedProduct?: any;
  relatedChikfdServices?: any;
}

interface Service {
  _id: string;
  Title: string;
  Name: string; 
  category: string;
}

interface Product {
  _id: string;
  Title: string;
  category: string;
}

interface ChildService {
  _id: string;
  Title: string;
  category: string; 
}

interface CategoryMap {
  [key: string]: Testimonial[];
}


const hashCode = (str: string): number => {
  let hash = 0;
  if (str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; 
  }
  return Math.abs(hash);
};

const generateStableRandomWithHash = (length: number): number => {
  if (length === 0) return 0;


  const seedString = `testimonials_${length}_stable_seed`;
  const hash = hashCode(seedString);

  return hash % length;
};

export default function CustomerSuccessStories() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categorizedTestimonials, setCategorizedTestimonials] =
    useState<CategoryMap>({});
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [allTestimonials, setAllTestimonials] = useState<Testimonial[]>([]); 
  const [random, setRandom] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [
          testimonialResponse,
          serviceResponse,
          productResponse,
          childServiceResponse,
        ] = await Promise.all([
          axios.get("/api/testimonial/get"),
          axios.get("/api/service/getservice"),
          axios.get("/api/product/get"),
          axios.get("/api/child/get"),
        ]);

        const testimonials: Testimonial[] =
          testimonialResponse.data.testimonials || [];
        const services: Service[] = serviceResponse.data.services || [];
        const products: Product[] = productResponse.data.products || [];
        const childServices: ChildService[] =
          childServiceResponse.data.products || [];

        setAllTestimonials(testimonials);

        const serviceMap = services.reduce(
          (map: { [key: string]: Service }, service) => {
            map[service._id] = service;
            return map;
          },
          {}
        );

        const productMap = products.reduce(
          (map: { [key: string]: Product }, product) => {
            map[product._id] = product;
            return map;
          },
          {}
        );

        const childServiceMap = childServices.reduce(
          (map: { [key: string]: ChildService }, childService) => {
            map[childService._id] = childService;
            return map;
          },
          {}
        );

        // Initialize categories object
        const categorizedData: CategoryMap = {};
        const categoriesSet = new Set<string>();

        // Process each testimonial to determine its category using Service's Name field
        testimonials.forEach((testimonial) => {
          let categoryName = "Others"; // Default category
          let parentService: Service | null = null;

          // Priority 1: Child Service (find its parent service through product)
          if (testimonial.relatedChikfdServices) {
            const childServiceId =
              typeof testimonial.relatedChikfdServices === "object"
                ? testimonial.relatedChikfdServices._id
                : testimonial.relatedChikfdServices;

            const childService = childServiceMap[childServiceId];
            if (childService) {
              const product = productMap[childService.category];
              if (product) {
                parentService = serviceMap[product.category];
              }
            }
          }
          // Priority 2: Product (find its parent service)
          else if (testimonial.relatedProduct) {
            const productId =
              typeof testimonial.relatedProduct === "object"
                ? testimonial.relatedProduct._id
                : testimonial.relatedProduct;

            const product = productMap[productId];
            if (product) {
              parentService = serviceMap[product.category];
            }
          }
          // Priority 3: Service (direct service relation)
          else if (testimonial.relatedService) {
            const serviceId =
              typeof testimonial.relatedService === "object"
                ? testimonial.relatedService._id
                : testimonial.relatedService;

            parentService = serviceMap[serviceId];
          }

          // Use the parent service's Name field for categorization
          if (parentService && parentService.Name) {
            categoryName = parentService.Name;
          }

          // Add category to our set of available categories
          categoriesSet.add(categoryName);

          // Initialize category array if it doesn't exist
          if (!categorizedData[categoryName]) {
            categorizedData[categoryName] = [];
          }

          // Add testimonial to the appropriate category
          categorizedData[categoryName].push(testimonial);
        });

        // Convert set to array and sort categories
        const sortedCategories = Array.from(categoriesSet).sort((a, b) => {
          // Put "Others" at the end
          if (a === "Others") return 1;
          if (b === "Others") return -1;
          return a.localeCompare(b);
        });

        const totalTestimonials = testimonials.length;

        // Generate stable random index
        const stableIndex = generateStableRandomWithHash(totalTestimonials);
        setRandom(stableIndex);

        setAvailableCategories(sortedCategories);
        setCategorizedTestimonials(categorizedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load testimonials. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Handle video play toggle
  const toggleVideo = (id: string) => {
    setActiveVideoId(activeVideoId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#446E6D]" />
          <p className="mt-4 text-lg">Loading customer success stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#446E6D] text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      {/* Hero Section */}
      <div className="w-[90%] xl:w-[1280px] flex-col xl:flex-row mx-auto pt-8 lg:pt-16 flex items-center gap-10">
        <div className="basis-1/2 xl:pr-32 xl:order-1 order-2 z-20">
          <p className="text-4xl xl:text-5xl">
            <strong>WEBME delivers Customer Success</strong>
          </p>
          <p className="mt-10 xl:text-xl">
            {allTestimonials[random]
              ? allTestimonials[random].Testimonial
              : "Discover how WEBME transforms challenges into success stories. Our clients' testimonials showcase the impact of our innovative IT solutions and dedicated support."}
          </p>
        </div>
        <div className="basis-1/2 rounded-2xl overflow-hidden z-20 xl:order-2 order-1">
          <Video
            src={allTestimonials[random]?.video}
            // poster={allTestimonials[random]?.image}
            title="Customer Success"
          />
        </div>
      </div>


      {availableCategories.map((category) => {
        if (
          !categorizedTestimonials[category] ||
          categorizedTestimonials[category].length === 0
        ) {
          return null;
        }

        return (
          <div
            key={category}
            className="w-[90%] xl:w-[1280px] mx-auto pt-20 xl:pt-32 gap-10"
          >
            <p className="text-2xl xl:text-4xl w-full text-center">
              <strong>Customer Success with {category}</strong>
            </p>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10 pt-16">
              {categorizedTestimonials[category]
                .slice(0, 3)
                .map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="bg-white overflow-hidden rounded-xl shadow-xl flex flex-col border-[1px] border-gray-300 h-full"
                  >
                    {/* Video at the top of the card */}
                    <div className="w-full aspect-video relative overflow-hidden rounded-t-xl">
                      {activeVideoId === testimonial._id ? (
                        <video
                          className="w-full h-full object-cover"
                          src={testimonial.video}
                          controls
                          autoPlay
                          onEnded={() => setActiveVideoId(null)}
                        />
                      ) : (
                        <>
                          <img
                            src={testimonial.image}
                            className="w-full h-full object-cover brightness-90"
                            alt={`${testimonial.postedBy} video thumbnail`}
                          />
                          <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={() => toggleVideo(testimonial._id)}
                          >
                            <div className="bg-[#446E6D] bg-opacity-80 rounded-full p-4 shadow-lg hover:bg-opacity-100 transition-all transform hover:scale-105">
                              <Play size={24} className=" ml-1 text-white" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 bg-[#446E6D] text-white text-xs px-2 py-1 rounded-full">
                            Video Testimonial
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-1 relative">
                      {/* Customer Info with Round Avatar */}
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#446E6D] flex-shrink-0 mr-3">
                          <img
                            src={testimonial.image}
                            className="w-full h-full object-cover"
                            alt={testimonial.postedBy || "Customer"}
                          />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 leading-tight">
                            {testimonial.postedBy}
                          </p>
                          <p className="text-sm text-gray-600">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>

                      {/* Category Tag */}
                      <p className="text-xs bg-[#6a949221] px-3 py-1 rounded-full w-max mb-3">
                        {category} Success Story
                      </p>

                      {/* Testimonial Text */}
                      <p className="text-gray-700 mb-12 line-clamp-3">
                        {testimonial.Testimonial}
                      </p>

                      {/* Learn More Link */}
                      <Link
                        href={`/customer-success-stories/${testimonial._id}`}
                        className="absolute bottom-0 mb-6 text-[#446E6D] flex items-center font-semibold cursor-pointer hover:underline"
                      >
                        <span>Read full story</span>
                        <OpenInNewIcon fontSize="small" className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            {/* Show "View more" button if more than 3 testimonials */}
            {categorizedTestimonials[category].length > 3 && (
              <div className="text-center mt-8">
                <Link
                  href={`/customer-success-stories/category/${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="inline-flex items-center px-6 py-3 bg-[#446E6D] text-white rounded-md hover:bg-[#355857] transition-colors"
                >
                  <span>View more {category} stories</span>
                  <OpenInNewIcon className="ml-2" fontSize="small" />
                </Link>
              </div>
            )}
          </div>
        );
      })}

      {/* Show message if no testimonials found */}
      {Object.values(categorizedTestimonials).every(
        (arr) => arr.length === 0
      ) && (
        <div className="w-[90%] xl:w-[1280px] mx-auto py-20 text-center">
          <p className="text-xl text-gray-500">
            No customer success stories found.
          </p>
          <p className="mt-4 text-gray-600">
            Check back later for inspiring stories about how our clients have
            achieved success with WEBME.
          </p>
        </div>
      )}
    </div>
  );
}
