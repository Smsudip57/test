/**
 * CLIENT-SIDE BULK API UTILITY
 * For client components that need to use the bulk API endpoint
 */

import axios from 'axios';

/**
 * Client-side bulk API fetcher
 * @param {string[]} keys - Array of API keys to fetch
 * @param {object} options - Optional configuration
 * @returns {object} - Bulk API response data
 */
export async function fetchMultiple(keys, options = {}) {
    if (!Array.isArray(keys) || keys.length === 0) {
        throw new Error('fetchMultiple requires an array of keys');
    }

    try {
        const keysParam = keys.join(',');
        const response = await axios.get(`/api/get/bulk?keys=${keysParam}`, options);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Bulk API request failed');
        }

        return response.data.data;
    } catch (error) {
        console.error('❌ Error in client fetchMultiple:', error);
        // Return empty data for all keys on error
        const errorMap = {};
        keys.forEach(key => {
            errorMap[key] = [];
        });
        return errorMap;
    }
}

/**
 * Client-side convenience functions for common use cases
 */
export async function fetchCustomerStoriesData() {
    return await fetchMultiple(['testimonials', 'services', 'products', 'childServices']);
}

export async function fetchHomePageData() {
    return await fetchMultiple(['services', 'projects', 'industries', 'testimonials']);
}

export async function fetchBlogData() {
    return await fetchMultiple(['blogs', 'knowledgebase']);
}
