import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'y08r07g3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-01', // Use today's date or your preferred version
  useCdn: process.env.NODE_ENV === 'production', // Set to false if you want to ensure fresh data
  token: process.env.SANITY_API_TOKEN, // Only needed if you want to update content or bypass the CDN
});

// Image URL builder for Sanity images
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ queries for blog posts
export const blogQueries = {
  // Get all published blog posts
  getAllPosts: `*[_type == "post" && status == "published"] | order(publishedAt desc) {
    _id,
    id,
    title,
    slug,
    excerpt,
    listingImage,
    detailImage,
    content,
    publishedAt,
    category,
    seo,
    internalLinking
  }`,
  
  // Get a single post by slug
  getPostBySlug: `*[_type == "post" && slug.current == $slug && status == "published"][0] {
    _id,
    id,
    title,
    slug,
    excerpt,
    listingImage,
    detailImage,
    content,
    publishedAt,
    category,
    seo,
    internalLinking
  }`,
  
  // Get all post slugs for static generation
  getAllSlugs: `*[_type == "post" && status == "published"] {
    "slug": slug.current
  }`,
  
  // Get related posts (excluding current post)
  getRelatedPosts: `*[_type == "post" && slug.current != $currentSlug && status == "published"] | order(publishedAt desc)[0...3] {
    _id,
    id,
    title,
    slug,
    excerpt,
    listingImage,
    detailImage,
    publishedAt,
    category
  }`,
  
  // Get posts for internal linking (by keywords)
  getPostsForInternalLinking: `*[_type == "post" && status == "published"] {
    _id,
    title,
    slug,
    seo,
    "focusKeyword": seo.focusKeyword,
    "keywords": seo.keywords
  }`,
  
  // Get posts by category for related content
  getPostsByCategory: `*[_type == "post" && category == $category && status == "published" && slug.current != $excludeSlug] | order(publishedAt desc)[0...5] {
    _id,
    title,
    slug,
    excerpt,
    listingImage,
    publishedAt,
    category
  }`
}; 