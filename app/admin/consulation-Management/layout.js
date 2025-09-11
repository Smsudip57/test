import React from 'react'

export default function ConsultationManagementLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50  p-4 md:p-6">
      <div className="mx-auto">
        {children}
      </div>
    </div>
  )
}
