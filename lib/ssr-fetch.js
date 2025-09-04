/**
 * ROBUST SSR API PROVIDER SYSTEM
 * Centralized, flexible, and scalable API management
 */

// Complete API registry - all your endpoints in one place
const apiRegistry = [
    {
        key: 'services',
        endpoint: '/api/service/getservice',
        dataPath: 'services' // where the actual data is in response
    },
    {
        key: 'projects',
        endpoint: '/api/project/get',
        dataPath: 'data'
    },
    {
        key: 'industries',
        endpoint: '/api/industry/get',
        dataPath: 'industries'
    },
    {
        key: 'testimonials',
        endpoint: '/api/testimonial/get',
        dataPath: 'testimonials'
    },
    {
        key: 'products',
        endpoint: '/api/product/get',
        dataPath: 'products'
    },
    {
        key: 'childServices',
        endpoint: '/api/child/get',
        dataPath: 'products'
    },
    {
        key: 'blogs',
        endpoint: '/api/blog/get',
        dataPath: 'blogs'
    },
    {
        key: 'knowledgebase',
        endpoint: '/api/knowledgebase/get',
        dataPath: 'knowledgebases'
    },
    {
        key: 'faqs',
        endpoint: '/api/faq/get',
        dataPath: 'faqs'
    },
    {
        key: 'serviceDetails',
        endpoint: '/api/servicedetails/get',
        dataPath: 'servicedetails'
    },
    {
        key: 'users',
        endpoint: '/api/user/get',
        dataPath: 'users'
    }
];

const revalidateDefault = 0; // Default revalidation time in seconds

// Provider function - fetch single API by key
export async function fetchByKey(key, options = {}) {
    const api = apiRegistry.find(item => item.key === key);

    if (!api) {
        console.error(`❌ API key '${key}' not found in registry`);
        return [];
    }

    try {
        console.log(`🔄 Fetching ${key}...`);
        const startTime = Date.now();

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}${api.endpoint}`;
        const response = await fetch(url, {
            next: { revalidate: options.revalidate || 300 },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const result = data[api.dataPath] || [];

        const endTime = Date.now();
        console.log(`✅ ${key} fetched in ${endTime - startTime}ms (${result.length} items)`);

        return result;
    } catch (error) {
        console.error(`❌ Error fetching ${key}:`, error);
        return [];
    }
}

// OPTIMIZED: Single bulk API call instead of multiple parallel requests
export async function fetchMultiple(keys, options = {}) {
    if (!Array.isArray(keys) || keys.length === 0) {
        console.error('❌ fetchMultiple requires an array of keys');
        return {};
    }

    console.log(`🚀 Bulk fetching APIs: [${keys.join(', ')}]`);
    const startTime = Date.now();

    try {
        // Use the new bulk endpoint - single HTTP request
        const keysParam = keys.join(',');
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/get/bulk?keys=${keysParam}`;

        const response = await fetch(url, {
            next: { revalidate: options.revalidate || 300 },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Bulk API request failed');
        }

        const endTime = Date.now();
        console.log(`✅ Bulk API completed in ${endTime - startTime}ms (${result.totalItems} total items)`);

        return result.data;
    } catch (error) {
        console.error('❌ Error in bulk fetchMultiple:', error);
        // Return empty data for all keys on error
        const errorMap = {};
        keys.forEach(key => {
            errorMap[key] = [];
        });
        return errorMap;
    }
}


// Convenience functions for common use cases - using fetchMultiple
export async function fetchAllHomePageData() {
    return await fetchMultiple(['services', 'projects', 'industries', 'testimonials'], {
        revalidate: revalidateDefault
    });
}

export async function fetchAllBlogData() {
    return await fetchMultiple(['blogs', 'knowledgebase'], {
        revalidate: revalidateDefault // 10-minute cache
    });
}

export async function fetchAllServiceData() {
    return await fetchMultiple(['services', 'products', 'childServices', 'serviceDetails'], {
        revalidate: revalidateDefault
    });
}

export async function fetchSlugPageData(options = {}) {
    const result = await fetchMultiple(['services', 'products', 'childServices'], {
        revalidate: revalidateDefault, // 5-minute cache
        ...options
    });

    return {
        services: result.services || [],
        products: result.products || [],
        childs: result.childServices || [], // Keep the same naming as the original
    };
}

// No-cache function for admin panels or real-time data
export async function fetchFreshData(keys) {
    return fetchMultiple(keys, {
        cache: 'no-store',
        next: { revalidate: 0 }
    });
}
