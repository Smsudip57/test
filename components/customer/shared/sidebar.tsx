"use client"
import React, { useEffect, useState } from 'react';
import ContainerWrapper from '../shared/containerwrapper';
import { Home, FileStack, Calendar, BarChart3, Users, Settings, HelpCircle, LogOut, Bird, LucideIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarItem {
    icon: LucideIcon;
    label: string;
    href: string;
    isActive?: boolean;
    badge?: string;
}

interface SidebarSectionConfig {
    title: string;
    items: SidebarItem[];
    isGeneralSection?: boolean;
}

interface SidebarSectionProps {
    title: string;
    items: SidebarItem[];
    isGeneralSection?: boolean;
}

export default function Sidebar(): JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarSections, setSidebarSections] = useState<SidebarSectionConfig[]>([]);

    useEffect(() => {
        // Define sidebar items
        const sections: SidebarSectionConfig[] = [
            {
                title: "Menu",
                items: [
                    { icon: Home, label: "Dashboard", href: "/customer/dashboard" },
                    { icon: FileStack, label: "Tasks", href: "/customer/tasks", badge: "new" },
                    { icon: Calendar, label: "Calendar", href: "/customer/calendar" },
                    { icon: BarChart3, label: "Analytics", href: "/customer/analytics" },
                    { icon: Users, label: "Team", href: "/customer/team" },
                ],
            },
            {
                title: "Settings",
                isGeneralSection: true,
                items: [
                    { icon: Settings, label: "Settings", href: "/customer/settings" },
                    { icon: HelpCircle, label: "Help", href: "/customer/help" },
                    { icon: LogOut, label: "Logout", href: "/logout" },
                ],
            },
        ];

        // Update active state based on current pathname
        const updatedSections = sections.map(section => ({
            ...section,
            items: section.items.map(item => ({
                ...item,
                isActive: pathname ? (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/customer")) : false,
            })),
        }));

        setSidebarSections(updatedSections);
    }, [pathname]);

    const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items, isGeneralSection = false }): JSX.Element => {
        return (
            <div className={isGeneralSection ? "" : "mb-8"}>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-3 pl-4">{title}</p>
                <nav className="flex flex-col gap-1">
                    {items.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className={`py-2 px-3 rounded flex items-center gap-2 pl-7 font-medium transition-colors ${item.isActive
                                ? "bg-primary-bg text-primary relative hover:bg-primary-bg"
                                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                                }`}
                        >
                            {item.isActive && (
                                <div className="min-h-full left-0 border-[4px] border-primary absolute rounded-r-xl"></div>
                            )}
                            {!item.isActive && (
                                <div className="min-h-full left-0 border-[4px] border-transparent hover:border-primary absolute rounded-r-xl transition-colors"></div>
                            )}
                            <item.icon className="w-5 h-5" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </a>
                    ))}
                </nav>
            </div>
        );
    };


    return (
        <ContainerWrapper className="w-64 h-[calc(100vh-3.2rem)] flex flex-col py-6 px-4 pl-0 rounded-2xl sticky top-6 shadow-lg">
            <div>
                <div className="flex items-center gap-2 mb-8 pl-4 cursor-pointer" onClick={() => {
                    router.push("/")
                }}>
                    <div className="bg-primary-bg rounded-full p-2">
                        <Bird className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-lg tracking-wide">Webme</span>
                </div>

                {/* Sidebar Sections */}
                {sidebarSections.map((section, index) => (
                    <SidebarSection
                        key={index}
                        title={section.title}
                        items={section.items}
                        isGeneralSection={section.isGeneralSection}
                    />
                ))}
            </div>

            {/* Mobile App Promo */}
            {/* <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white flex flex-col items-center">
          <div className="text-2xl mb-2">⭕</div>
          <span className="font-semibold mb-2 text-sm">Download our Mobile App</span>
          <p className="text-xs mb-3 text-gray-300">Get easy AI-powered way</p>
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full">
            Download
          </button>
        </div> */}
        </ContainerWrapper>
    )
}
