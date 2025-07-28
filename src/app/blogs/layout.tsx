import { Metadata } from 'next';

// Define meta data for each blog post
const blogMetaData: Record<string, { title: string; description: string }> = {
  // First 8 blogs (in correct order)
  'what-technical-seo-includes': {
    title: 'What Technical SEO Includes for Websites | Bytes Platform',
    description: 'Discover what technical SEO includes for websites and why it\'s vital for businesses. Improve crawlability, speed, mobile UX, and search performance today.'
  },
  'local-seo-vs-national-seo': {
    title: 'Choosing Between Local SEO and National SEO',
    description: 'Compare local SEO vs national SEO to find the best fit for your business goals, market reach, and customer location strategy.'
  },
  'how-to-choose-right-development-framework': {
    title: 'Choosing the Right Web Development Framework',
    description: 'Learn how to choose web development framework options that align with your project goals, tech stack, and team capabilities.'
  },
  'how-to-ensure-security-during-project-development': {
    title: 'Ensuring Web Security During Project Development',
    description: 'Learn how to ensure web security during development with proven strategies that protect your data, APIs, and users from common vulnerabilities.'
  },
  'ways-to-boost-mobile-app-performance': {
    title: 'How to Boost Mobile App Performance: Best Practices for 2025',
    description: 'Discover how to boost mobile app performance using proven strategies. Learn how US businesses can create fast, reliable, user-friendly apps.'
  },
  'social-media-marketing-strategies': {
    title: 'Top Social Media Strategies for US Brands 2025',
    description: 'Discover the best social media marketing strategies for brands to grow engagement, build trust, and convert U.S. audiences in 2025.'
  },
  'content-marketing-ideas-that-help-websites-rank': {
    title: 'Content Ideas to Help US Websites Rank on Google',
    description: 'Explore content marketing ideas for Google ranking that help U.S. websites grow traffic, build authority, and earn first-page positions in 2025.'
  },
  'how-to-measure-roi': {
    title: 'How to Measure ROI in Digital Marketing | Bytes Platform',
    description: 'Learn how to measure digital marketing ROI with data-driven methods to track performance, optimize spend, and prove results across all channels.'
  },
  // Next 8 blogs (in correct order)
  'what-is-seo': {
    title: 'What is SEO and Why It\'s Essential for US Businesses',
    description: 'Learn what is SEO and why it matters for US businesses. Discover how our SEO services help you gain visibility and outrank competitors.'
  },
  'how-to-implement-seo-strategies': {
    title: 'How to Implement SEO Strategies for Small Businesses in the US',
    description: 'Find out how to implement SEO strategies for small businesses in the US. Get practical tips to boost visibility, earn trust, and grow your business.'
  },
  'important-web-development-trends': {
    title: 'Important Web Development Trends 2025 for US Companies',
    description: 'Explore the important web development trends 2025 that US companies need to know. Stay ahead with fast, secure, and future-ready websites.'
  },
  'why-responsive-web-design-is-essential': {
    title: 'Why Responsive Web Design is Essential for US Businesses in 2025',
    description: 'See why responsive web design is essential for US businesses in 2025. Learn how it helps improve search rankings, engagement, and growth.'
  },
  'why-ui-ux-design-is-crucial': {
    title: 'Why UI UX Design is Critical for Mobile App Success in the US',
    description: 'Learn why UI UX design is critical for mobile apps. Discover how US businesses can create apps that engage users and drive success.'
  },
  'how-to-build-scalable-mobile-apps': {
    title: 'How to Build Scalable Mobile Apps for Growth',
    description: 'Learn how to build scalable mobile apps with architecture, infrastructure, and strategies built to handle growth in the competitive U.S. market.'
  },
  'how-to-create-digital-marketing-campaigns': {
    title: 'How to Create Digital Marketing Campaigns That Engage Customers',
    description: 'Learn how to create digital marketing campaigns that engage customers. Get strategies to connect with your audience and achieve real results.'
  },
  'how-paid-advertising-works': {
    title: 'How Paid Advertising Can Drive Business Growth in the US',
    description: 'Learn how paid advertising drives business growth. Discover proven strategies to reach your audience, boost visibility, and achieve results.'
  }
};

// Default meta data for blog listing pages
const defaultMetaData = {
  title: 'Digital Marketing Insight Blogs | Bytes Platform',
  description: 'Blog from Bytes Platform, a source with digital marketing techniques, CMS tips, SEO, PPC, and Social media.'
};

export const metadata: Metadata = {
  title: defaultMetaData.title,
  description: defaultMetaData.description,
  alternates: {
    canonical: '/blogs',
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

// Export the blog meta data for use in individual blog pages
export { blogMetaData }; 