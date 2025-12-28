import React from 'react'
import ContainerWrapper from '../shared/containerwrapper';
import { Mail, Bell, Search } from 'lucide-react';




export default function Navbar() {
    return (
        <ContainerWrapper className="mb-6 py-4">
            <div className=" flex items-center justify-between">
                {/* Left - Search */}
                <div className="flex items-center gap-3 flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Search className="w-5 h-5 text-gray-400" />
                </div>

                {/* Right - Icons and User Menu */}
                <div className="flex items-center gap-6">
                    {/* Mail Icon */}
                    <button className="text-gray-600 hover:text-primary transition-colors relative">
                        <Mail className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                    </button>

                    {/* Notification Bell */}
                    <button className="text-gray-600 hover:text-primary transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">5</span>
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-gray-900">John Doe</span>
                            <span className="text-xs text-gray-500">john@example.com</span>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                            JD
                        </div>
                    </div>
                </div>
            </div>
        </ContainerWrapper>
    )
}
