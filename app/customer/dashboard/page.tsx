import React from 'react'
import { Plus, Upload, Zap, Share2, Grid3x3, CheckCircle2, BarChart2, Video, Square } from 'lucide-react';
import BarChart from '@/components/customer/shared/barchart';
import HalfDonutChart from '@/components/customer/shared/halfdonutchart';

export default function page() {
  const teamData = [
    {
      name: "Alexandra Deff",
      initials: "A",
      avatarBg: "#fbb5bd",
      task: "Github Project Repository",
      status: "Completed",
      statusStyle: "bg-green-100 text-green-700"
    },
    {
      name: "Edwin Adenike",
      initials: "E",
      avatarBg: "#b3e5a8",
      task: "Integrate User Authentication System",
      status: "In Progress",
      statusStyle: "bg-yellow-100 text-yellow-700"
    },
    {
      name: "Isaac Oluwatemilorun",
      initials: "I",
      avatarBg: "#a8c9e0",
      task: "Develop Search and Filter Functionality",
      status: "Pending",
      statusStyle: "bg-red-100 text-red-700"
    },
    {
      name: "David Oshodi",
      initials: "D",
      avatarBg: "#f5d9a8",
      task: "Responsive Layout for Homepage",
      status: "In Progress",
      statusStyle: "bg-yellow-100 text-yellow-700"
    }
  ];

  const projectData = [
    {
      title: "Develop API Endpoints",
      dueDate: "Nov 26, 2024",
      icon: Zap,
      iconBg: "#4f46e5"
    },
    {
      title: "Onboarding Flow",
      dueDate: "Nov 28, 2024",
      icon: Share2,
      iconBg: "#06b6d4"
    },
    {
      title: "Build Dashboard",
      dueDate: "Nov 30, 2024",
      icon: Grid3x3,
      iconBg: "#10b981"
    },
    {
      title: "Optimize Page Load",
      dueDate: "Dec 5, 2024",
      icon: CheckCircle2,
      iconBg: "#f59e0b"
    },
    {
      title: "Cross-Browser Testing",
      dueDate: "Dec 6, 2024",
      icon: BarChart2,
      iconBg: "#a855f7"
    }
  ];

  const reminderData = [
    {
      title: "Meeting with Arc Company",
      time: "02.00 pm - 04.00 pm",
      buttonText: "Start Meeting",
      icon: Video
    }
  ];

  const statsData = [
    {
      label: "Total Projects",
      value: "24",
      change: "↑ Increased from last month",
      valueColor: "text-green-600"
    },
    {
      label: "Ended Projects",
      value: "10",
      change: "↑ Increased from last month",
      valueColor: "text-green-600"
    },
    {
      label: "Running Projects",
      value: "12",
      change: "↑ Increased from last month",
      valueColor: "text-green-600"
    },
    {
      label: "Pending Project",
      value: "2",
      change: "On Discuss",
      valueColor: "text-gray-400"
    }
  ];
  const GeneralHeaderClass = "font-semibold mb-2 text-xl";
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gradient-to-b from-primary to-primary-light hover:from-primary hover:to-primary-darker text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors">
            <Plus className="w-5 h-5" />
            Add Project
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors">
            <Upload className="w-5 h-5" />
            Import Data
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 flex flex-col items-start shadow-sm">
            <span className="text-gray-500 text-xs font-medium mb-3">{stat.label}</span>
            <span className="text-4xl font-bold text-primary mb-2">{stat.value}</span>
            <span className={`text-xs font-medium flex items-center gap-1 ${stat.valueColor}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-wrap gap-6">
          {/* Top row - BarChart and Reminders */}
          <div className="flex-1">
            <BarChart />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <span className={GeneralHeaderClass}>Reminders</span>
            {reminderData.map((reminder, index) => (
              <div key={index} className="flex flex-col gap-3">
                <div>
                  <p className="text-lg font-bold text-gray-900">{reminder.title}</p>
                  <p className="text-xs text-gray-500">Time : {reminder.time}</p>
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-colors w-full justify-center">
                  <reminder.icon className="w-5 h-5" />
                  {reminder.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Bottom row - Team Collaboration and Project Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className={GeneralHeaderClass}>Team Collaboration</span>
              <button className="border-2 border-primary text-primary px-4 py-1.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-primary-bg transition-colors">
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {teamData.map((member, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: member.avatarBg }}
                  >
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">Working on <span className="font-semibold text-gray-700">{member.task}</span></p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${member.statusStyle}`}>
                    {member.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-[40%]">
            <HalfDonutChart />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between mb-4">
              <span className={GeneralHeaderClass}>Project</span>
              <button className="border-2 border-primary text-primary px-4 py-1.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-primary-bg transition-colors">
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {projectData.map((project, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: project.iconBg }}
                  >
                    <project.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{project.title}</p>
                    <p className="text-xs text-gray-500">Due date: {project.dueDate}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4 mt-4 w-full max-w-xs">
            <span className={GeneralHeaderClass}>Time Tracker</span>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-mono font-bold text-primary">01:24:08</span>
              <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                <Square className="w-5 h-5 fill-white" />
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-6 mt-4">

      </div>

    </div>
  );
}