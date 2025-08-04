import { getBlogs, BlogPost } from './getBlogs';
import { getSanityBlogs, convertSanityPostToBlogPost, SanityBlogPost } from './sanityBlogs';
import { addInternalLinks } from './internalLinking';

export interface HybridBlogPost extends BlogPost {
  source: 'static' | 'sanity';
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
}

// Get all blogs from both sources
export async function getHybridBlogs(): Promise<HybridBlogPost[]> {
  const staticBlogs = getBlogs();
  
  // Convert static blogs to hybrid format
  const staticHybridBlogs: HybridBlogPost[] = staticBlogs.map(blog => ({
    ...blog,
    source: 'static' as const,
    seo: undefined
  }));
  
  // Convert Sanity blogs to hybrid format
  const sanityBlogs = await getSanityBlogs();
  const sanityHybridBlogs: HybridBlogPost[] = sanityBlogs.map((sanityPost, index) => {
    const converted = convertSanityPostToBlogPost(sanityPost);
    return {
      ...converted,
      id: 25 + index, // Start from ID 25 and increment
      source: 'sanity' as const,
      seo: sanityPost.seo
    };
  });
  
  // Combine blogs
  const allBlogs = [...staticHybridBlogs, ...sanityHybridBlogs];
  
  return allBlogs;
}

// Get a single blog post by slug (check both sources)
export async function getHybridBlogBySlug(slug: string): Promise<HybridBlogPost | null> {
  // First check static blogs
  const staticBlogs = getBlogs();
  const staticBlog = staticBlogs.find(blog => blog.slug === slug);
  
  if (staticBlog) {
    // Apply internal linking to static blogs using the 37 keywords
    const processedContent = addInternalLinks(staticBlog.content, staticBlog.slug);
    
    return {
      ...staticBlog,
      content: processedContent,
      source: 'static' as const,
      seo: undefined
    };
  }
  
  // Then check Sanity blogs
  const sanityBlogs = await getSanityBlogs();
  
  const sanityBlog = sanityBlogs.find(blog => {
    const blogSlug = blog.slug.current;
    const normalizedBlogSlug = blogSlug.replace(/^\//, ''); // Remove leading slash
    const normalizedSearchSlug = slug.replace(/^\//, ''); // Remove leading slash from search
    
    return normalizedBlogSlug === normalizedSearchSlug;
  });
  
  if (sanityBlog) {
    const converted = convertSanityPostToBlogPost(sanityBlog);
    return {
      ...converted,
      source: 'sanity' as const,
      content: sanityBlog.content, // Keep the original Sanity content for PortableText
      seo: sanityBlog.seo
    };
  }
  
  return null;
}

// Get all blog slugs for static generation
export async function getAllHybridBlogSlugs(): Promise<{ slug: string }[]> {
  const staticBlogs = getBlogs();
  const sanityBlogs = await getSanityBlogs();
  
  const staticSlugs = staticBlogs.map(blog => ({ slug: blog.slug }));
  const sanitySlugs = sanityBlogs.map(blog => ({ slug: blog.slug.current.replace(/^\//, '') }));
  
  return [...staticSlugs, ...sanitySlugs];
}

// Get related posts (excluding current post)
export async function getHybridRelatedPosts(currentSlug: string): Promise<HybridBlogPost[]> {
  const allBlogs = await getHybridBlogs();
  const relatedBlogs = allBlogs
    .filter(blog => blog.slug !== currentSlug)
    .slice(0, 3);
  
  return relatedBlogs;
}

// Get blog count by source
export function getBlogCounts() {
  const staticBlogs = getBlogs();
  return {
    static: staticBlogs.length,
    sanity: 0, // Will be updated when Sanity is configured
    total: staticBlogs.length
  };
} 