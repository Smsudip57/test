'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {HeartHandshake, PackageSearch,FolderGit ,MessageCircleCode,Factory  ,Newspaper, NewspaperIcon, FileQuestion, Baby   } from 'lucide-react'

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      name: 'Parent Services',
      icons: <HeartHandshake style={{ width: '1em', height: '1em' }}/>,
      basePath: '/admin/website/services',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Parent Service Details',
      icons: <FileQuestion  style={{ width: '1em', height: '1em' }}/>,
      basePath: '/admin/website/service-details',
      buttons: [
        { name: 'Create', path: 'create' },
        // { name: 'Edit', path: 'edit' },
        // { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Child Services',
      basePath: '/admin/website/products',
      icons: <PackageSearch  style={{ width: '1em', height: '1em' }}/>,
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Products',
      basePath: '/admin/website/child-service',
      icons: <Baby  style={{ width: '1em', height: '1em' }}/>,
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        // { name: 'Delete', path: 'delete' },
      ],
    },
    
    {
      name: 'Projects',
      basePath: '/admin/website/projects',
      icons: <FolderGit  style={{ width: '1em', height: '1em' }}/>,
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Testimonials',
      icons: <MessageCircleCode  style={{ width: '1em', height: '1em' }}/>,
      basePath: '/admin/website/testimonials',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
      ],
    },
    {
      name: 'Industries',
      icons: <Factory  style={{ width: '1em', height: '1em' }}/>,
      basePath: '/admin/website/industries',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Blogs',
      icons: <Newspaper   style={{ width: '1em', height: '1em' }}/>,
      basePath: '/admin/website/blog',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        // { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Knowledgebase',
      icons: <NewspaperIcon   style={{ width: '1em', height: '1em' }}/>,
      basePath: '/admin/website/knowledgebase',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        // { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Faq',
      icons: <FileQuestion  style={{ width: '1em', height: '1em' }}/>,
      basePath: '/admin/website/faq',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        // { name: 'Delete', path: 'delete' },
      ],
    },
    
    // Add more routes as needed
  ];

  // Automatically set the dropdown state based on the current route
  // useEffect(() => {
  //   const activeRoute = routes.find((route) =>
  //     pathname.startsWith(route.basePath)
  //   );
  //   if (activeRoute) {
  //     setOpenDropdown(activeRoute.name);
  //   } else {
  //     setOpenDropdown('');
  //   }
  // }, [pathname]);

  return (
    <div className="min-w-full flex flex-wrap gap-5 p-4 items-center justify-start bg-white rounded-md top-0 shadow">
      {routes.map((route) => {
        const isActiveDropdown = openDropdown === route.name;

        return (
          <div key={route.name} className="w-  relative">
            {/* Dropdown Button */}
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === route.name ? '' : route.name))
              }
              className={`inline-flex text-nowrap gap-2 items-center justify-between rounded font w-full border-gray-300 shadow-sm px-5 py-2 font-semibold ${
                (pathname.startsWith(route.basePath) && !isActiveDropdown) ? 'bg-[#446e6d24] text-[#446E6D]' : 'hover:bg-[#446e6d24]  text-gray-700'
              } focus:outline-none text-left`}
            >
              {route.icons}{route.name}
              <svg
                className={`-mr-1 ml-2 h-5 w-5 ${
                  isActiveDropdown ? 'rotate-180' : ''
                } transition-transform`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isActiveDropdown && (
              <div className="ml-[20px] z-[999999999999] bg-white absolute rounded-sm overflow-hidden shadow-md border-[#446E6D] w-full origin-top-right divide-y divide-gray-100 focus:outline-none" 
                onMouseLeave={() => setOpenDropdown('')}
              >
                {route.buttons.map((button) => {
                  const isActiveButton =
                    pathname === `${route.basePath}/${button.path}`;
                  return (
                    <button
                      key={button.name}
                      onClick={() => router.push(`${route.basePath}/${button.path}`)}
                      className={`w-full block px-5 py-3  border-gray-300 text-left textn-nowrap ${
                        isActiveButton
                          ? 'bg-[#446e6d3b] text-[#446E6D]'
                          : 'hover:bg-[#446e6d24] text-gray-700'
                      }`}
                    >
                      {button.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
