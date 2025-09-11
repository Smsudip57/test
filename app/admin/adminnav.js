"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MyContext } from "@/context/context";
import {
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Home,
} from "lucide-react";

export default function Adminnav({ user, login }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const context = React.useContext(MyContext);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      if (response?.data?.success) {
        router.push("/");
        context?.setUser(null);
        context?.customToast(response?.data);
      }
    } catch (error) {
      context?.customToast({ success: false, message: "Something went wrong" });
    }
  };

  const currentUser = context?.user;

  return (
    <header className="bg-white border-b border-gray-200 w-full px-6 py-3 shadow-sm fixed top-0 z-50">
      <div className="flex justify-between items-center max-w-full">
        {/* Left Side - Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#446E6D] rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">WebMe Digital</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search admin panel..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#446E6D] focus:border-[#446E6D] text-sm"
            />
          </div>
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          {currentUser === undefined ? (
            // Skeleton loader while user data is loading
            <div className="flex items-center space-x-3 p-2 rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="hidden md:block">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
          ) : currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {currentUser?.profile?.avatarUrl ? (
                    <img
                      src={currentUser.profile.avatarUrl}
                      alt={currentUser?.profile?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.profile?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser?.role || "Administrator"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.profile?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.email}
                    </p>
                  </div>

                  <Link
                    href="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>

                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>

                  <hr className="my-2" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-[#446E6D] text-white rounded-lg hover:bg-[#3a5c5b] transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
