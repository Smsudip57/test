import React from 'react'

export default function ContainerWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={` mb-10 bg-white p-8 rounded-2xl shadow ${className}`}>
      {children}
    </div>
  )
}
