import React from "react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold">+ Add Project</button>
          <button className="bg-white border px-4 py-2 rounded font-semibold">Import Data</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 flex flex-col items-start shadow-sm">
          <span className="text-gray-500 text-xs mb-2">Total Projects</span>
          <span className="text-3xl font-bold text-green-700 mb-1">24</span>
          <span className="text-xs text-green-600">↑ Increased from last month</span>
        </div>
        <div className="bg-white rounded-xl p-6 flex flex-col items-start shadow-sm">
          <span className="text-gray-500 text-xs mb-2">Ended Projects</span>
          <span className="text-3xl font-bold text-green-700 mb-1">10</span>
          <span className="text-xs text-green-600">↑ Increased from last month</span>
        </div>
        <div className="bg-white rounded-xl p-6 flex flex-col items-start shadow-sm">
          <span className="text-gray-500 text-xs mb-2">Running Projects</span>
          <span className="text-3xl font-bold text-green-700 mb-1">12</span>
          <span className="text-xs text-green-600">↑ Increased from last month</span>
        </div>
        <div className="bg-white rounded-xl p-6 flex flex-col items-start shadow-sm">
          <span className="text-gray-500 text-xs mb-2">Pending Project</span>
          <span className="text-3xl font-bold text-green-700 mb-1">2</span>
          <span className="text-xs text-gray-400">On Discuss</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-4">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <span className="font-semibold mb-2">Project Analytics</span>
          <div className="flex gap-2 items-end h-20">
            <div className="w-6 h-12 bg-green-200 rounded-t" style={{height:'48%'}}></div>
            <div className="w-6 h-16 bg-green-400 rounded-t" style={{height:'74%'}}></div>
            <div className="w-6 h-14 bg-green-600 rounded-t" style={{height:'60%'}}></div>
            <div className="w-6 h-10 bg-gray-200 rounded-t" style={{height:'40%'}}></div>
            <div className="w-6 h-8 bg-gray-200 rounded-t" style={{height:'32%'}}></div>
            <div className="w-6 h-8 bg-gray-200 rounded-t" style={{height:'32%'}}></div>
            <div className="w-6 h-8 bg-gray-200 rounded-t" style={{height:'32%'}}></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <span className="font-semibold mb-2">Reminders</span>
          <div className="flex flex-col gap-1">
            <span className="text-gray-700 font-medium">Meeting with Arc Company</span>
            <span className="text-xs text-gray-400">Time : 02.00 pm - 04.00 pm</span>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold w-fit">Start Meeting</button>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <span className="font-semibold mb-2">Project</span>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Develop API Endpoints <span className="ml-auto text-xs text-gray-400">Nov 26, 2024</span></li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Onboarding Flow <span className="ml-auto text-xs text-gray-400">Nov 28, 2024</span></li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Build Dashboard <span className="ml-auto text-xs text-gray-400">Nov 30, 2024</span></li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Optimize Page Load <span className="ml-auto text-xs text-gray-400">Dec 5, 2024</span></li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span> Cross-Browser Testing <span className="ml-auto text-xs text-gray-400">Dec 6, 2024</span></li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <span className="font-semibold mb-2">Team Collaboration</span>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold">A</span> Alexandra Deff <span className="ml-auto text-xs text-green-600">Completed</span></li>
            <li className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold">E</span> Edwin Adenike <span className="ml-auto text-xs text-yellow-600">In Progress</span></li>
            <li className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold">I</span> Isaac Oluwatemilorun <span className="ml-auto text-xs text-blue-600">In Progress</span></li>
            <li className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold">D</span> David Oshodi <span className="ml-auto text-xs text-gray-400">Pending</span></li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <span className="font-semibold mb-2">Project Progress</span>
          <div className="flex flex-col items-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="#e5e7eb" strokeWidth="12" fill="none" />
              <circle cx="60" cy="60" r="54" stroke="#22c55e" strokeWidth="12" fill="none" strokeDasharray="339.292" strokeDashoffset="200" strokeLinecap="round" />
            </svg>
            <span className="text-3xl font-bold text-green-700 mt-2">41%</span>
            <span className="text-xs text-gray-400">Project Ended</span>
            <div className="flex gap-2 mt-2">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span> Completed
              <span className="w-3 h-3 bg-green-400 rounded-full"></span> In Progress
              <span className="w-3 h-3 bg-gray-300 rounded-full"></span> Pending
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 mt-4 w-full max-w-xs">
        <span className="font-semibold mb-2">Time Tracker</span>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-mono font-bold text-green-700">01:24:08</span>
          <button className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">⏹️</button>
        </div>
      </div>
    </div>
  );
}
