import { MetadataRoute } from 'next'
import { fetchMultiple } from '@/lib/ssr-fetch'

function safeDate(updatedAt?: any, createdAt?: any): Date {
    if (updatedAt && !isNaN(new Date(updatedAt).getTime())) {
        return new Date(updatedAt);
    }
    if (createdAt && !isNaN(new Date(createdAt).getTime())) {
        return new Date(createdAt);
    }
    return new Date();
}

// Helper function to safely encode URLs for XML sitemap  
function safeUrl(url: string): string {
    return url.replace(/&/g, '&amp;');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://webmedigital.com'

    try {
        // Use single optimized fetchMultiple call instead of 6 separate API calls
        const allData = await fetchMultiple([
            'services',
            'products',
            'childServices',
            'projects',
            'blogs',
            'knowledgebase',
            'industries',
            'testimonials'
        ]);

        // Extract data from the bulk response
        const {
            services,
            products,
            childServices,
            projects,
            blogs,
            knowledgebase,
            industries,
            testimonials
        } = allData;

        // Static pages with high priority
        const staticRoutes = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1.0,
            },
            {
                url: `${baseUrl}/about/about-webme`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            },
            {
                url: `${baseUrl}/customer-success-stories`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            },
            {
                url: `${baseUrl}/projects`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            },
            {
                url: `${baseUrl}/about/faq`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            },
            {
                url: `${baseUrl}/about/privacy-policy`,
                lastModified: new Date(),
                changeFrequency: 'yearly' as const,
                priority: 0.3,
            },
            {
                url: `${baseUrl}/about/terms-&amp;-conditions`,
                lastModified: new Date(),
                changeFrequency: 'yearly' as const,
                priority: 0.3,
            },
        ]

        // Service category routes (from your predefined categories)
        const serviceCategories = ['branding', 'workfrom-anywhere', 'modern-workplace', 'digital', 'endless-support']
        const serviceCategoryRoutes = serviceCategories.map((category) => ({
            url: `${baseUrl}/${category}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))

        // Dynamic service routes
        const serviceRoutes = services?.map((service: any) => ({
            url: safeUrl(`${baseUrl}/${service.slug || service.Title?.toLowerCase().replace(/\s+/g, '-')}`),
            lastModified: safeDate(service.updatedAt, service.createdAt),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })) || []

        // Industry routes
        const industryRoutes = industries?.map((industry: any) => ({
            url: safeUrl(`${baseUrl}/industries/${industry.name || industry.Title?.toLowerCase().replace(/\s+/g, '-')}`),
            lastModified: safeDate(industry.updatedAt, industry.createdAt),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })) || []

        // Blog routes
        const blogRoutes = blogs?.map((blog: any) => ({
            url: safeUrl(`${baseUrl}/about/blog/${blog.slug || blog._id}`),
            lastModified: safeDate(blog.updatedAt, blog.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })) || []

        // Knowledgebase routes
        const knowledgebaseRoutes = knowledgebase?.map((article: any) => ({
            url: safeUrl(`${baseUrl}/about/knowledgebase/${article.slug || article._id}`),
            lastModified: safeDate(article.updatedAt, article.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })) || []

        // Project detail routes (if you have public project pages)
        const projectRoutes = projects?.map((project: any) => ({
            url: safeUrl(`${baseUrl}/details/projects/${project.slug || project.Title}`),
            lastModified: safeDate(project.updatedAt, project.createdAt),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        })) || []

        // Combine all routes
        const allRoutes = [
            ...staticRoutes,
            ...serviceCategoryRoutes,
            ...serviceRoutes,
            ...industryRoutes,
            ...blogRoutes,
            ...knowledgebaseRoutes,
            ...projectRoutes,
        ]

        console.log(`✅ Generated sitemap with ${allRoutes.length} URLs`)
        return allRoutes

    } catch (error) {
        console.error('❌ Error generating sitemap:', error)

        // Fallback to static routes only
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            }
        ]
    }
}
