import React from "react";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f9fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between py-6 px-4">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-green-100 rounded-full p-2">
              <span className="text-green-700 font-bold text-xl">🦉</span>
            </div>
            <span className="font-bold text-lg tracking-wide">Donezo</span>
          </div>
          <nav className="flex flex-col gap-2">
            <a href="/customer/dashboard" className="py-2 px-3 rounded text-gray-700 hover:bg-green-50 flex items-center gap-2 font-medium">
              <span>🏠</span> Dashboard
            </a>
            <a href="/customer/tasks" className="py-2 px-3 rounded text-gray-700 hover:bg-green-50 flex items-center gap-2 font-medium">
              <span>🗂️</span> Tasks
            </a>
            <a href="/customer/calendar" className="py-2 px-3 rounded text-gray-700 hover:bg-green-50 flex items-center gap-2 font-medium">
              <span>📅</span> Calendar
            </a>
            <a href="/customer/analytics" className="py-2 px-3 rounded text-gray-700 hover:bg-green-50 flex items-center gap-2 font-medium">
              <span>📊</span> Analytics
            </a>
            <a href="/customer/team" className="py-2 px-3 rounded text-gray-700 hover:bg-green-50 flex items-center gap-2 font-medium">
              <span>👥</span> Team
            </a>
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <a href="/customer/settings" className="py-2 px-3 rounded text-gray-700 hover:bg-green-50 flex items-center gap-2 font-medium">
            <span>⚙️</span> Settings
          </a>
          <a href="/customer/help" className="py-2 px-3 rounded text-gray-700 hover:bg-green-50 flex items-center gap-2 font-medium">
            <span>❓</span> Help
          </a>
          <a href="/logout" className="py-2 px-3 rounded text-gray-700 hover:bg-green-50 flex items-center gap-2 font-medium">
            <span>🚪</span> Logout
          </a>
        </div>
        <div className="mt-8 bg-gradient-to-br from-green-600 to-green-400 rounded-xl p-4 text-white flex flex-col items-center">
          <span className="font-semibold mb-2">Download our Mobile App</span>
          <button className="bg-white text-green-700 px-4 py-1 rounded font-semibold">Download</button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
