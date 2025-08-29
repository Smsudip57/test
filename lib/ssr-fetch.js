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

// Multi-fetch provider - fetch multiple APIs in parallel
export async function fetchMultiple(keys, options = {}) {
    if (!Array.isArray(keys) || keys.length === 0) {
        console.error('❌ fetchMultiple requires an array of keys');
        return {};
    }

    console.log(`🚀 Fetching multiple APIs: [${keys.join(', ')}]`);
    const startTime = Date.now();

    try {
        // Fetch all in parallel
        const promises = keys.map(key =>
            fetchByKey(key, options).catch(error => {
                console.error(`Error fetching ${key}:`, error);
                return []; // Return empty array on error
            })
        );

        const results = await Promise.all(promises);

        // Map results back to keys
        const dataMap = {};
        keys.forEach((key, index) => {
            dataMap[key] = results[index];
        });

        const endTime = Date.now();
        console.log(`✅ All APIs fetched in ${endTime - startTime}ms`);

        return dataMap;
    } catch (error) {
        console.error('❌ Error in fetchMultiple:', error);
        // Return empty data for all keys
        const errorMap = {};
        keys.forEach(key => {
            errorMap[key] = [];
        });
        return errorMap;
    }
}


// Convenience functions for common use cases
export async function fetchAllHomePageData() {
    const results = await fetchMultiple(['services', 'projects', 'industries', 'testimonials']);
    // console.log(results?.services);
    return results;
    
}

export async function fetchAllBlogData() {
    return fetchMultiple(['blogs', 'knowledgebase']);
}

export async function fetchAllServiceData() {
    return fetchMultiple(['services', 'products', 'childServices', 'serviceDetails']);
}
