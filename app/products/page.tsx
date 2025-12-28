import React from 'react';
import { fetchMultiple } from '@/lib/ssr-fetch';
import { Metadata } from 'next';
import ProductsListPage from './ProductsListPage';

// Generate metadata for SEO
export const metadata: Metadata = {
    title: 'Our Products | WEBME Digital Solutions & Services',
    description: 'Discover our comprehensive range of digital products and services. From ERP systems to web solutions, find the perfect technology solution for your business needs.',
    keywords: 'digital products, IT services, ERP systems, web solutions, business software, WEBME products, technology services',
    openGraph: {
        title: 'Our Products | WEBME Digital Solutions & Services',
        description: 'Discover our comprehensive range of digital products and services tailored for your business.',
        url: 'https://webmedigital.com/products',
        siteName: 'WEBME Digital',
        images: [
            {
                url: 'https://webmedigital.com/og-products.jpg',
                width: 1200,
                height: 630,
                alt: 'WEBME Digital Products',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Our Products | WEBME Digital Solutions & Services',
        description: 'Discover our comprehensive range of digital products and services.',
        images: ['https://webmedigital.com/og-products.jpg'],
    },
    alternates: {
        canonical: 'https://webmedigital.com/products',
    },
};

// SSR function to fetch products data
async function getProductsData() {
    try {
        // Fetch child services (products) along with parent services for categorization
        const allData = await fetchMultiple(['childServices', 'products', 'services']);

        return {
            products: allData.childServices || [],
            parentServices: allData.products || [],
            services: allData.services || [],
        };
    } catch (error) {
        console.error('Error fetching products data:', error);
        return {
            products: [],
            parentServices: [],
            services: [],
        };
    }
}

export default async function ProductsPage() {
    const { products, parentServices, services } = await getProductsData();

    return (
        <ProductsListPage
            products={products}
            parentServices={parentServices}
            services={services}
        />
    );
}
