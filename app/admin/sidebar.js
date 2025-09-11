"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Users,
  Calendar,
  Settings,
  ChevronDown,
  Home,
} from "lucide-react";

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      name: "Dashboard",
      basePath: "/admin/dashboard",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      name: "Website CMS",
      basePath: "/admin/cms/website",
    },
    {
      icon: <Users className="w-5 h-5" />,
      name: "User Management",
      basePath: "/admin/user-management",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      name: "Consultations",
      basePath: "/admin/consulation-Management",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      name: "Settings",
      basePath: "/admin/settings",
      buttons: [
        { name: "General", path: "general" },
        { name: "Security", path: "security" },
        { name: "Integrations", path: "integrations" },
      ],
    },
  ];

  // Automatically set the dropdown state based on the current route
  useEffect(() => {
    const activeRoute = routes.find((route) =>
      pathname.startsWith(route.basePath)
    );
    if (activeRoute) {
      setOpenDropdown(activeRoute.name);
    } else {
      setOpenDropdown("");
    }
  }, [pathname]);

  return (
    <div className="h-[calc(100vh-4.5rem)] w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col sticky top-[4.5rem]">
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 pt-6">
        {routes.map((route) => {
          const isActiveDropdown = openDropdown === route.name;
          const isActive = pathname.startsWith(route.basePath);

          return (
            <div key={route.name} className="space-y-1">
              {/* Main Navigation Button */}
              <button
                onClick={() => {
                  if (!route?.buttons || route?.buttons?.length === 0) {
                    setOpenDropdown(route.name);
                    router.push(route.basePath);
                  } else {
                    setOpenDropdown((prev) =>
                      prev === route.name ? "" : route.name
                    );
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-[#446E6D]/10 text-[#446E6D] border border-[#446E6D]/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      isActive
                        ? "text-[#446E6D]"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {route.icon}
                  </span>
                  <span>{route.name}</span>
                </div>

                {route?.buttons?.length > 0 && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActiveDropdown ? "rotate-180" : ""
                    } ${isActive ? "text-[#446E6D]" : "text-gray-400"}`}
                  />
                )}
              </button>

              {/* Dropdown Menu */}
              {isActiveDropdown && route?.buttons?.length > 0 && (
                <div className="ml-8 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {route.buttons.map((button) => {
                    const isActiveButton =
                      pathname === `${route.basePath}/${button.path}`;
                    return (
                      <button
                        key={button.name}
                        onClick={() =>
                          router.push(`${route.basePath}/${button.path}`)
                        }
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                          isActiveButton
                            ? "bg-[#446E6D]/15 text-[#446E6D] font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
      </nav>
    </div>
  );
}
