import React from "react";
import Navbar from "@/components/customer/shared/navbar";
import Sidebar from "@/components/customer/shared/sidebar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
     <div className="min-h-screen bg-gray-100 flex text-black p-6 gap-6">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper with navbar */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
