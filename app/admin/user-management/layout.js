import React from 'react'

export default function UserManagementLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto">
        {children}
      </div>
    </div>
  )
}
