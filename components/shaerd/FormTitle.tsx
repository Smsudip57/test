import React from 'react';

interface FormTitleProps {
    title: string;
    details?: string;
    className?: string;
}

export default function FormTitle({ title, details, className }: FormTitleProps) {
    return (
        <div className={`w-full flex flex-col items-start justify-center mb-4 ${className || ''}`}>
            <h1 className="text-3xl font-bold text-primary_dark tracking-tight mb-1">{title}</h1>
            {details && (
                <p className="text-base text-gray-500 mb-2">{details}</p>
            )}
            <div className="h-0.5 w-12 bg-primary rounded-full opacity-70" />
        </div>
    );
}
