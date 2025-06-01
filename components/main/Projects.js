"use client";
import React, { useState, useEffect } from "react";
import ProjectCard from "../sub/ProjectCard";
import Link from "next/link";
import axios from "axios";

const Projects = ({ industry = null, service = null }) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getProjects = async () => {
      try {
        const response = await axios.get("/api/project/get", {
          withCredentials: true,
          signal,
        });
        if (response.data.success) {
          if (industry || service) {
            const filteredProjects = response.data.data.filter(
              (project) =>
                (industry && project.relatedIndustries === industry) ||
                (service && project?.relatedServices === service)
            );
            setProjects(filteredProjects);
          } else {
            setProjects(response.data.data);
          }
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.log("Error:", error);
        }
      }
    };
    console.log(service, industry);
    getProjects();
    return () => {
      controller.abort();
    };
  }, []);

  return !(projects.length > 0) ? null : (
    <div
      className="flex flex-col items-center justify-center pb-20"
      id="projects"
    >
      <section className="mt-16 sm:mt-[100px] px-4 sm:px-12 lg:px-[136px]">
        <div className="mx-auto mb-10 sm:mb-14 px-4 max-w-2xl text-center">
          <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6">
            OUR PROJECTS
          </h1>
          <p className="text-[#393939] text-base lg:text-xl">
            Innovative Solutions Brought to Life
          </p>
        </div>
        <div className="flex flex-col flex-wrap lg:flex-row gap-4 sm:gap-8 justify-center">
          {projects &&
            projects?.map((project, index) => (
              <div
                className={`m-0.5 p-4 sm:p-10 ${
                  index % 4 === 0
                    ? "bg-[#FFE8D7]"
                    : index % 3 === 0
                    ? "bg-[#FCE5F3]"
                    : index % 2 === 0
                    ? "bg-[#E5EDFD]"
                    : "bg-[#FFF8BB]"
                } basis-[46%] lg:basis-[47.2%] rounded-xl`}
                key={index}
              >
                {!(index % 2 === 0) && (
                  <img
                    alt="project-image"
                    loading="lazy"
                    width="0"
                    height="239"
                    decoding="async"
                    data-nimg="1"
                    className="w-full rounded-lg h-[239px] object-cover"
                    style={{ color: "transparent" }}
                    src={project?.image}
                  />
                )}
                <h1
                  className="font-bold text-2xl lg:text-4xl text-[#0B2B20]  font-lora mb-[22px]"
                  style={{ marginTop: !(index % 2 === 0) && "24px" }}
                >
                  {project?.Title}
                </h1>
                <p className="text-[#0B2B20]  mb-[30px] whitespace-pre-wrap">
                  {project?.detail}
                </p>
                <button className="bg-[#0B2B20]  px-6 py-3 mb-7 rounded-lg text-white">
                  <Link
                    href={`/details/projects/${
                      project?.slug ? project?.slug : project?.Title
                    }`}
                  >
                    Know More
                  </Link>
                </button>
                {index % 2 === 0 && (
                  <img
                    alt="project-image"
                    loading="lazy"
                    width="0"
                    height="239"
                    decoding="async"
                    data-nimg="1"
                    className="w-full rounded-lg h-[239px] object-cover"
                    style={{ color: "transparent" }}
                    src={project?.image}
                  />
                )}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
