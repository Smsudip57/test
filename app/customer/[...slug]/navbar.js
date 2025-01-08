'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      name: 'Services',
      basePath: '/customer/dashboard',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Products',
      basePath: '/customer/consultation',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Projects',
      basePath: '/customer/services',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Testimonials',
      basePath: '/customer/payment',
      buttons: [
        { name: 'Create', path: 'create' },
        // { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    {
      name: 'Industries',
      basePath: '/admin/industries',
      buttons: [
        { name: 'Create', path: 'create' },
        { name: 'Edit', path: 'edit' },
        { name: 'Delete', path: 'delete' },
      ],
    },
    // Add more routes as needed
  ];

  // Automatically set the dropdown state based on the current route
  useEffect(() => {
    const activeRoute = routes.find((route) =>
      pathname.startsWith(route.basePath)
    );
    if (activeRoute) {
      setOpenDropdown(activeRoute.name);
    } else {
      setOpenDropdown('');
    }
  }, [pathname]);

  return (
    <div className="h-screen w-1/5 pt-28 pl-[50px] bg-[#C1EBE7] sticky top-0 overflow-hidden">
      {routes.map((route) => {
        const isActiveDropdown = openDropdown === route.name;

        return (
          <div key={route.name} className="w-full mb-4">
            {/* Dropdown Button */}
            <button
              onClick={() =>
                setOpenDropdown((prev) => (prev === route.name ? '' : route.name))
              }
              className={`inline-flex justify-between w-full  border-b border-gray-300 shadow-sm px-5 py-3 font-medium text-gray-700 ${
                isActiveDropdown ? 'bg-[#446E6D] text-white' : 'hover:bg-[#446e6d61] hover:text-white'
              } focus:outline-none text-left`}
            >
              {route.name}
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
              <div className="ml-[20px] border-l-2 border-[#446E6D] w-full origin-top-right divide-y divide-gray-100 focus:outline-none">
                {route.buttons.map((button) => {
                  const isActiveButton =
                    pathname === `${route.basePath}/${button.path}`;
                  return (
                    <button
                      key={button.name}
                      onClick={() => router.push(`${route.basePath}/${button.path}`)}
                      className={`w-full block px-5 py-3 border-b-2 border-gray-300 text-left ${
                        isActiveButton
                          ? 'bg-[#446E6D] text-white'
                          : 'hover:bg-[#446e6d61] hover:text-white'
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
