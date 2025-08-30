import React from 'react';
import { fetchMultiple } from '@/lib/ssr-fetch';
import { Metadata } from 'next';
import ProjectsListPage from './ProjectsListPage';

// Generate metadata for SEO
export const metadata: Metadata = {
    title: 'Our Projects | WEBME Digital Solutions Portfolio',
    description: 'Explore our comprehensive portfolio of successful IT projects, digital solutions, and technology implementations. Discover how WEBME delivers exceptional results for businesses across various industries.',
    keywords: 'IT projects, digital solutions, technology portfolio, web development, software projects, WEBME portfolio, business solutions',
    openGraph: {
        title: 'Our Projects | WEBME Digital Solutions Portfolio',
        description: 'Explore our comprehensive portfolio of successful IT projects and digital solutions.',
        url: 'https://webmedigital.com/projects',
        siteName: 'WEBME Digital',
        images: [
            {
                url: 'https://webmedigital.com/og-projects.jpg',
                width: 1200,
                height: 630,
                alt: 'WEBME Digital Projects Portfolio',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Projects | WEBME Digital Solutions Portfolio',
        description: 'Explore our comprehensive portfolio of successful IT projects and digital solutions.',
        images: ['https://webmedigital.com/og-projects.jpg'],
    },
    alternates: {
        canonical: 'https://webmedigital.com/projects',
    },
};

// SSR function to fetch projects data
async function getProjectsData() {
    try {
        // Use optimized fetchMultiple function - single bulk API call instead of 4 separate requests
        const allData = await fetchMultiple(['projects', 'services', 'products', 'childServices']);

        return {
            projects: allData.projects || [],
            services: allData.services || [],
            products: allData.products || [],
            childServices: allData.childServices || [],
        };
    } catch (error) {
        console.error('Error fetching projects data:', error);
        return {
            projects: [],
            services: [],
            products: [],
            childServices: [],
        };
    }
}

export default async function ProjectsPage() {
    const { projects, services, products, childServices } = await getProjectsData();

    return (
        <ProjectsListPage
            projects={projects}
            services={services}
            products={products}
            childServices={childServices}
        />
    );
}
