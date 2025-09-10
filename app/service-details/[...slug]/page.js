import React from "react";
import ServicePage from "./servicePage";
import { notFound } from "next/navigation";
import { fetchMultiple } from "../../../lib/ssr-fetch";

export default async function AdminPage({ params }) {
  let services, industries, testimonials, faqs, blogs, projects;

  try {
    // Fetch all required data using SSR multifetch
    const data = await fetchMultiple([
      "services",
      "industries",
      "testimonials",
      "faqs",
      "blogs",
      "projects",
    ]);

    services = data.services;
    industries = data.industries || [];
    testimonials = data.testimonials || [];
    faqs = data.faqs || [];
    blogs = data.blogs || [];
    projects = data.projects || [];
  } catch (e) {
    console.error("Error fetching data:", e);
  }

  const slug = params.slug;

  const renderContent = () => {
    if (!slug) {
      <p>Loading...</p>;
      context.customToast({ success: false, message: "Something went wrong" });
    }

    const checkService = (name) => {
      const Name = decodeURIComponent(name);
      if (services && services.length > 0 && Name) {
        const Service = services.find(
          (service) => service.Title === Name || service.slug === Name
        );

        if (!Service) return false;

        const serviceId = Service._id.toString();

        // Filter related industries (array of ObjectIds)
        const relatedIndustries = industries.filter((industry) =>
          industry?.relatedServices?.some((id) => id.toString() === serviceId)
        );

        // Filter related testimonials (single ObjectId)
        const relatedTestimonials = testimonials.filter(
          (testimonial) => testimonial?.relatedService?._id?.toString() === serviceId
        );

        // Filter related FAQs (array of ObjectIds)
        const relatedFaqs = faqs.filter((faq) =>
          faq?.relatedServices?.some((id) => id.toString() === serviceId)
        );

        // Filter related blogs (array of ObjectIds)
        const relatedBlogs = blogs.filter((blog) =>
          blog?.relatedServices?.some((id) => id.toString() === serviceId)
        );

        // Filter related projects (array of ObjectIds)
        const relatedProjects = projects.filter((project) =>
          project?.relatedServices?.some((id) => id.toString() === serviceId)
        );

        return {
          Service,
          relatedIndustries,
          relatedTestimonials,
          relatedFaqs,
          relatedBlogs,
          relatedProjects,
        };
      } else {
        return false;
      }
    };

    if (checkService(slug[0])) {
      const result = checkService(slug[0]);
      return (
        <ServicePage
          details={result.Service}
          industries={result.relatedIndustries}
          testimonials={result.relatedTestimonials}
          faqs={result.relatedFaqs}
          blogs={result.relatedBlogs}
          projects={result.relatedProjects}
        />
      );
    } else {
      return notFound();
    }
  };

  return <div>{renderContent()}</div>;
}
