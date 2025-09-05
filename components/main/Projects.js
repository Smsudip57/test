"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import VideoPlayer from "@/components/shaerd/Video";

const Projects = ({ product = null, service = null, child = null, projects: projectsProp = null, title = null }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(8); // Initially show 8 projects
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (projectsProp && Array.isArray(projectsProp)) {
      if (product || service || child) {
        const filteredProjects = projectsProp.filter((project) => {
          const matchesService =
            service &&
            Array.isArray(project.relatedServices) &&
            project.relatedServices.includes(service);

          const matchesProduct =
            product &&
            Array.isArray(project.relatedProducts) &&
            project.relatedProducts.includes(product);

          const matchesChild =
            child &&
            Array.isArray(project.relatedChikfdServices) &&
            project.relatedChikfdServices.includes(child);

          // Return true if any of the filters match
          return matchesService || matchesProduct || matchesChild;
        });

        setProjects(filteredProjects);
        setEmpty(filteredProjects.length === 0);
      } else {
        setProjects(projectsProp);
        setEmpty(projectsProp.length === 0);
      }
      setLoading(false);
      return;
    }

    // Fallback: fetch from API if no props provided or props is null/undefined
    console.log("Fetching projects from API (slower)");
    const controller = new AbortController();
    const signal = controller.signal;

    const getProjects = async () => {
      setLoading(true); // Ensure loading is set to true at the beginning

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await axios.get("/api/project/get", {
          withCredentials: true,
          signal,
        });

        if (response.data.success) {
          if (product || service || child) {
            const filteredProjects = response.data.data.filter((project) => {
              // Check if any of the project's related items match the provided filters
              const matchesService =
                service &&
                Array.isArray(project.relatedServices) &&
                project.relatedServices.includes(service);

              const matchesProduct =
                product &&
                Array.isArray(project.relatedProducts) &&
                project.relatedProducts.includes(product);

              const matchesChild =
                child &&
                Array.isArray(project.relatedChikfdServices) &&
                project.relatedChikfdServices.includes(child);

              // Return true if any of the filters match
              return matchesService || matchesProduct || matchesChild;
            });

            setProjects(filteredProjects);
            if (filteredProjects.length === 0) {
              setTimeout(() => {
                setEmpty(true);
              }, 1000);
            } else {
              setEmpty(false);
            }
          } else {
            setProjects(response.data.data);
            if (response.data.data.length === 0) {
              setTimeout(() => {
                setEmpty(true);
              }, 1000);
            } else {
              setEmpty(false);
            }
          }
        } else {
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching projects:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    // Call the function
    getProjects();

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, [product, service, child, projectsProp]);

  // Reset visible projects when projects change
  useEffect(() => {
    setVisibleProjects(8);
    setIsExpanded(false);
  }, [projects]);

  // Handle show more/less functionality
  const handleShowMore = () => {
    if (isExpanded) {
      // Show less - go back to initial 8
      setVisibleProjects(8);
      setIsExpanded(false);
      // Scroll to top of projects section
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Show more - add 4 more projects
      const newVisible = Math.min(visibleProjects + 4, projects.length);
      setVisibleProjects(newVisible);
      // If we're now showing all projects, mark as expanded
      if (newVisible === projects.length) {
        setIsExpanded(true);
      }
    }
  };

  // Get the projects to display
  const displayedProjects = projects.slice(0, visibleProjects);

  // Determine if we should show the button
  const shouldShowButton = projects.length > 8;

  // Determine button text
  const getButtonText = () => {
    if (isExpanded) {
      return "Show Less";
    } else {
      const remaining = projects.length - visibleProjects;
      return `Show More (${remaining} more)`;
    }
  };

  // Loading skeleton component for project cards
  const ProjectSkeleton = ({ index }) => (
    <div
      className={`m-0.5 p-4 sm:p-10 ${index % 4 === 0
          ? "bg-[#FFE8D7]"
          : index % 3 === 0
            ? "bg-[#FCE5F3]"
            : index % 2 === 0
              ? "bg-[#E5EDFD]"
              : "bg-[#FFF8BB]"
        } basis-[46%] lg:basis-[47.2%] rounded-xl`}
    >
      {!(index % 2 === 0) && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200 animate-pulse"></div>
      )}

      <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mt-6 mb-6"></div>

      <div className="space-y-3 mb-[30px]">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="h-12 w-32 bg-gray-300 rounded-lg animate-pulse mb-7"></div>

      {index % 2 === 0 && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );

  return (
    <div
      className="flex flex-col items-center justify-center pb-20"
      id="projects"
    >
      <section className="mt-16 sm:mt-[100px] px-4 sm:px-12 lg:px-[136px]">
        <div className="mx-auto mb-10 sm:mb-14 px-4 max-w-2xl text-center">
          <h1 className="font-lora text-2xl lg:text-4xl text-green-900 font-bold mb-6">
            {
              title ? title.toUpperCase() : "OUR PROJECTS"
            }
            
          </h1>
          <p className="text-[#393939] text-base lg:text-xl">
            Innovative Solutions Brought to Life
          </p>
        </div>

        {loading ? (
          // Display skeleton loaders while loading - ensure this branch is reached
          <div className="flex flex-col flex-wrap lg:flex-row gap-4 sm:gap-8 justify-center">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProjectSkeleton key={index} index={index} />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            {/* Display actual projects when loaded */}
            <div className="flex flex-col flex-wrap lg:flex-row gap-4 sm:gap-8 justify-center">
              {displayedProjects.map((project, index) => (
                <div
                  className={`m-0.5 p-4 sm:p-10 ${index % 4 === 0
                      ? "bg-[#FFE8D7]"
                      : index % 3 === 0
                        ? "bg-[#FCE5F3]"
                        : index % 2 === 0
                          ? "bg-[#E5EDFD]"
                          : "bg-[#FFF8BB]"
                    } basis-[46%] lg:basis-[47.2%] rounded-xl`}
                  key={index}
                >
                  {!(index % 2 === 0) &&
                    (project?.media?.type === "video" ? (
                      <div className="w-full aspect-video rounded-lg overflow-hidden">
                        <VideoPlayer
                          src={project?.media?.url}
                          themeColor="#446E6D"
                          controls={true}
                        />
                      </div>
                    ) : (
                      <img
                        alt={`${project?.Title || "Project"} image`}
                        loading="lazy"
                        decoding="async"
                        data-nimg="1"
                        className="w-full rounded-lg aspect-video object-cover"
                        style={{ color: "transparent" }}
                        src={project?.media?.url || project?.image}
                      />
                    ))}
                  <h1
                    className="font-bold text-2xl lg:text-4xl text-[#0B2B20] font-lora mb-[22px]"
                    style={{ marginTop: !(index % 2 === 0) && "24px" }}
                  >
                    {project?.Title}
                  </h1>
                  <p className="text-[#0B2B20] mb-[30px] whitespace-pre-wrap">
                    {project?.detail}
                  </p>
                  <button className="bg-[#0B2B20] px-6 py-3 mb-7 rounded-lg text-white hover:bg-[#173c2f] transition-colors">
                    <Link
                      href={`/details/projects/${project?.slug ? project?.slug : project?.Title
                        }`}
                    >
                      Know More
                    </Link>
                  </button>
                  {index % 2 === 0 &&
                    (project?.media?.type === "video" ? (
                      <div className="w-full aspect-video rounded-lg overflow-hidden">
                        <VideoPlayer
                          src={project?.media?.url}
                          themeColor="#446E6D"
                          controls={true}
                        />
                      </div>
                    ) : (
                      <img
                        alt={`${project?.Title || "Project"} image`}
                        loading="lazy"
                        decoding="async"
                        data-nimg="1"
                        className="w-full rounded-lg aspect-video object-cover"
                        style={{ color: "transparent" }}
                        src={project?.media?.url || project?.image}
                      />
                    ))}
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {shouldShowButton && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleShowMore}
                  className="bg-[#446E6D] hover:bg-[#357a78] text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <span>{getButtonText()}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          // Display message when no projects are found
          <div
            className={`text-center py-10 ${!loading && !empty ? "hidden" : "block"
              }`}
          >
            <div className="mx-auto w-24 h-24 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Projects Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {product || service || child
                ? "No projects match the selected criteria. Please try another category."
                : "No projects have been added yet. Check back later for updates."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Projects;
