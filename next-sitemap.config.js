module.exports = {
  siteUrl: 'https://www.bytesplatform.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/404'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.bytesplatform.com/sitemap-static.xml',
      'https://www.bytesplatform.com/sitemap-blogs.xml',
      'https://www.bytesplatform.com/sitemap-products.xml',
    ],
  },
  transform: async (config, path) => {
    // Separate blogs into their own sitemap
    if (path.startsWith('/blogs/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
        alternateRefs: [],
      }
    }
    
    // Separate products into their own sitemap
    if (path.startsWith('/products/')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
        alternateRefs: [],
      }
    }
    
    // Default for other pages
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    }
  },
  additionalPaths: async (config) => {
    const blogs = [
      '/blogs/content-marketing-ideas-that-help-websites-rank',
      '/blogs/effective-link-building-strategies',
      '/blogs/how-paid-advertising-works',
      '/blogs/how-schema-markup-boosts-local-seo',
      '/blogs/how-to-build-scalable-mobile-apps',
      '/blogs/how-to-choose-right-development-framework',
      '/blogs/how-to-create-digital-marketing-campaigns',
      '/blogs/how-to-ensure-security-during-project-development',
      '/blogs/how-to-implement-seo-strategies',
      '/blogs/how-to-improve-marketing-campaign-efficiency',
      '/blogs/how-to-improve-your-sites-visibility',
      '/blogs/how-to-measure-roi',
      '/blogs/important-web-development-trends',
      '/blogs/local-seo-vs-national-seo',
      '/blogs/social-media-marketing-strategies',
      '/blogs/ways-to-boost-mobile-app-performance',
      '/blogs/what-is-a-content-management-system',
      '/blogs/what-is-content-pruning-and-why-it-matters',
      '/blogs/what-is-front-end-development-and-why-it-matters',
      '/blogs/what-is-seo',
      '/blogs/what-technical-seo-includes',
      '/blogs/white-hat-seo-vs-black-hat-seo',
      '/blogs/why-responsive-web-design-is-essential',
      '/blogs/why-ui-ux-design-is-crucial',
    ]

    const products = [
      '/products/byte-bots',
      '/products/byte-suites',
    ]

    return [
      ...blogs.map((path) => ({
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      })),
      ...products.map((path) => ({
        loc: path,
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      })),
    ]
  },
} 