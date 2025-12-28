import React from "react";
import Project from "./project";
import ServicePage from "./servicePage";
import { notFound } from "next/navigation";
import { fetchMultiple, fetchV1ByKey } from "@/lib/ssr-fetch";
import { id } from "date-fns/locale";

export default async function AdminPage({ params }) {
  let project;
  let services;
  let products;
  let childs;
  let parentServices;
  let childServices;

  try {
    const pageData = await fetchMultiple([
      "projects",
      "services",
      "products",
      "childServices",
    ]);
    const parentServicesData = await fetchV1ByKey("parentServices");
    const childServicesData = await fetchV1ByKey("childServices");

    childServices = childServicesData || [];
    parentServices = parentServicesData || [];
    project = pageData.projects || [];
    services = pageData.services || [];
    products = pageData.products || [];
    childs = pageData.childServices || [];
  } catch (e) {
    // console.error("Error fetching page data:", e);
  }
  const slug = params.slug;

  // Handle all async logic before rendering
  if (!slug) {
    return notFound();
  }

  if (slug[0] === "services") {
    const parentService = parentServices?.find(
      (service) => service?.slug === slug[1] || service?.Title === slug[1]
    );
    if (parentService) {
      const fullData = await fetchV1ByKey("parentServices", slug[1]);
      return <ServicePage details={fullData} type={"parent"} />;
    } else {
      return notFound();
    }
  }

  if (slug[0] === "products") {
    const childService = childServices?.find(
      (product) => product?.slug === slug[1] || product?.Title === slug[1]
    );
    if (childService) {
      const fullData = await fetchV1ByKey("childServices", slug[1]);
      return <ServicePage details={fullData} type={"child"} />;
    } else {
      return notFound();
    }
  }

  if (slug[0] === "projects") {
    const projectData = project?.find(
      (p) => p.Title === slug[1] || p.slug === slug[1]
    );
    if (projectData) {
      return <Project project={projectData} />;
    } else {
      return notFound();
    }
  }

  return notFound();
}
