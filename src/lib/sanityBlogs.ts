import { client, blogQueries, urlFor } from './sanity';

export interface SanityBlogPost {
  _id: string;
  id: number;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  listingImage?: any;
  detailImage?: any;
  publishedAt: string;
  category?: string;
  content?: any;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    focusKeyword?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: any;
    twitterCard?: string;
    noIndex?: boolean;
    noFollow?: boolean;
  };
  internalLinking?: {
    relatedPosts?: any[];
    linkKeywords?: Array<{
      keyword: string;
      targetPost: any;
      linkText?: string;
    }>;
    autoLinkKeywords?: boolean;
    maxInternalLinks?: number;
  };
}

// Convert Sanity post to match existing BlogPost interface
export function convertSanityPostToBlogPost(sanityPost: SanityBlogPost) {
  return {
    id: 1, // Default ID, will be overridden in getHybridBlogs
    slug: sanityPost.slug.current.replace(/^\//, ''), // Remove leading slash
    title: sanityPost.title,
    excerpt: sanityPost.excerpt || '',
    image: sanityPost.listingImage ? urlFor(sanityPost.listingImage).width(400).height(400).url() : '/assets/Blogs/photos1-1/new1.jpg',
    detailImage: sanityPost.detailImage ? urlFor(sanityPost.detailImage).width(1200).height(700).url() : '/assets/Blogs/photo16-9/new1.jpg',
    date: sanityPost.publishedAt,
    content: sanityPost.content || '' // Keep as is for PortableText
  };
}

// Get all blog posts from Sanity
export async function getSanityBlogs(): Promise<SanityBlogPost[]> {
  try {
    const posts = await client.fetch(blogQueries.getAllPosts);
    return posts || [];
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error);
    return [];
  }
}

// Get a single blog post by slug
export async function getSanityBlogBySlug(slug: string): Promise<SanityBlogPost | null> {
  try {
    const post = await client.fetch(blogQueries.getPostBySlug, { slug });
    return post || null;
  } catch (error) {
    console.error('Error fetching blog post from Sanity:', error);
    return null;
  }
}

// Get all blog slugs for static generation
export async function getAllBlogSlugs(): Promise<{ slug: string }[]> {
  try {
    const slugs = await client.fetch(blogQueries.getAllSlugs);
    return slugs || [];
  } catch (error) {
    console.error('Error fetching blog slugs from Sanity:', error);
    return [];
  }
}

// Get related posts
export async function getRelatedPosts(currentSlug: string): Promise<SanityBlogPost[]> {
  try {
    const posts = await client.fetch(blogQueries.getRelatedPosts, { currentSlug });
    return posts || [];
  } catch (error) {
    console.error('Error fetching related posts from Sanity:', error);
    return [];
  }
} 