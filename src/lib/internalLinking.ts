import { BlogPost } from './getBlogs';
import { getStoredKeywords } from './keywordStorage';

// Define default keywords and their corresponding blog URLs
export const keywordToUrlMap: Record<string, string> = {
  // SEO Keywords
  'seo': '/blogs/what-is-seo',
  'search engine optimization': '/blogs/what-is-seo',
  'technical seo': '/blogs/what-technical-seo-includes',
  'local seo': '/blogs/local-seo-vs-national-seo',
  'national seo': '/blogs/local-seo-vs-national-seo',
  'white hat seo': '/blogs/white-hat-seo-vs-black-hat-seo',
  'black hat seo': '/blogs/white-hat-seo-vs-black-hat-seo',
  'schema markup': '/blogs/how-schema-markup-boosts-local-seo',
  'content pruning': '/blogs/what-is-content-pruning-and-why-it-matters',
  'link building': '/blogs/effective-link-building-strategies',
  'content management system': '/blogs/what-is-a-content-management-system',
  'cms': '/blogs/what-is-a-content-management-system',
  
  // Web Development Keywords
  'web development': '/blogs/important-web-development-trends',
  'web development framework': '/blogs/how-to-choose-right-development-framework',
  'responsive web design': '/blogs/why-responsive-web-design-is-essential',
  'front-end development': '/blogs/what-is-front-end-development-and-why-it-matters',
  'frontend development': '/blogs/what-is-front-end-development-and-why-it-matters',
  'web security': '/blogs/how-to-ensure-security-during-project-development',
  'website security': '/blogs/how-to-ensure-security-during-project-development',
  
  // Mobile App Keywords
  'mobile app': '/blogs/how-to-build-scalable-mobile-apps',
  'mobile app development': '/blogs/how-to-build-scalable-mobile-apps',
  'mobile app performance': '/blogs/ways-to-boost-mobile-app-performance',
  'ui/ux design': '/blogs/why-ui-ux-design-is-crucial',
  'user interface': '/blogs/why-ui-ux-design-is-crucial',
  'user experience': '/blogs/why-ui-ux-design-is-crucial',
  'scalable mobile apps': '/blogs/how-to-build-scalable-mobile-apps',
  
  // Digital Marketing Keywords
  'digital marketing': '/blogs/how-to-create-digital-marketing-campaigns',
  'digital marketing campaigns': '/blogs/how-to-create-digital-marketing-campaigns',
  'social media marketing': '/blogs/social-media-marketing-strategies',
  'content marketing': '/blogs/content-marketing-ideas-that-help-websites-rank',
  'paid advertising': '/blogs/how-paid-advertising-works',
  'marketing roi': '/blogs/how-to-measure-roi',
  'marketing campaign efficiency': '/blogs/how-to-improve-marketing-campaign-efficiency',
  'marketing analytics': '/blogs/how-to-measure-roi',
  // Additional SEO Terms
  'search visibility': '/blogs/how-to-improve-your-sites-visibility',
  'site visibility': '/blogs/how-to-improve-your-sites-visibility',
  'website visibility': '/blogs/how-to-improve-your-sites-visibility'
};

// Function to find the best matching keyword for a given text
function findBestKeyword(text: string, keywords: string[]): string | null {
  const lowerText = text.toLowerCase();
  
  // Sort keywords by length (longer keywords are more specific)
  const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
  
  for (const keyword of sortedKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  
  return null;
}

// Function to add internal links to content (Wikipedia-style)
export function addInternalLinks(content: string, excludeSlug?: string): string {
  let processedContent = content;
  const keywords = getStoredKeywords();
  const keywordKeys = Object.keys(keywords);
  
  // Sort keywords by length (longer keywords first to avoid partial matches)
  const sortedKeywords = keywordKeys.sort((a, b) => b.length - a.length);
  
  // Track which concepts have been linked (by URL)
  const linkedConcepts = new Set<string>();
  
  // Track which keywords have been linked (case-insensitive)
  const linkedKeywords = new Set<string>();
  
  // Find all potential keywords in the content
  const foundKeywords: Array<{ keyword: string; url: string; index: number }> = [];
  
  // Process each keyword only once
  for (const keyword of sortedKeywords) {
    const conceptUrl = keywords[keyword];
    
    // Skip if this concept has already been linked
    if (linkedConcepts.has(conceptUrl)) {
      continue;
    }
    
    // Skip if this keyword has already been linked
    if (linkedKeywords.has(keyword.toLowerCase())) {
      continue;
    }
    
    // Find the first occurrence of this keyword in the content
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const match = regex.exec(processedContent);
    
    if (match) {
      // Skip if this is in a heading (lines starting with #)
      const lineStart = processedContent.lastIndexOf('\n', match.index);
      const lineEnd = processedContent.indexOf('\n', match.index);
      const line = processedContent.substring(
        lineStart === -1 ? 0 : lineStart + 1,
        lineEnd === -1 ? processedContent.length : lineEnd
      );
      
      if (line.trim().startsWith('#')) {
        continue;
      }
      
      // Skip if we're inside any existing <a> tag
      const beforeMatch = processedContent.substring(0, match.index);
      const afterMatch = processedContent.substring(match.index + match[0].length);
      
      const lastATag = beforeMatch.lastIndexOf('<a');
      const nextATagClose = afterMatch.indexOf('</a>');
      const nextATagOpen = afterMatch.indexOf('<a>');
      
      if (lastATag !== -1) {
        if (nextATagClose !== -1 && (nextATagOpen === -1 || nextATagClose < nextATagOpen)) {
          continue; // We're inside an existing link
        }
      }
      
      // Add this keyword to the found list
      foundKeywords.push({
        keyword: match[0],
        url: conceptUrl,
        index: match.index
      });
      
      // Mark this concept and keyword as linked
      linkedConcepts.add(conceptUrl);
      linkedKeywords.add(keyword.toLowerCase());
      
      // Mark all other keywords that point to the same URL as linked
      keywordKeys.forEach(k => {
        if (keywords[k] === conceptUrl) {
          linkedKeywords.add(k.toLowerCase());
        }
      });
    }
  }
  
  // Sort by index in reverse order to avoid offset issues when replacing
  foundKeywords.sort((a, b) => b.index - a.index);
  
  // Add links
  foundKeywords.forEach(({ keyword, url, index }) => {
    const link = `<a href="${url}" class="internal-link text-blue-600 hover:text-blue-800 underline" title="Learn more about ${keyword}">${keyword}</a>`;
    processedContent = processedContent.substring(0, index) + 
                      link + 
                      processedContent.substring(index + keyword.length);
  });
  
  return processedContent;
}

// Function to get related posts based on content similarity
export function getRelatedPosts(currentSlug: string, allPosts: BlogPost[], limit: number = 3): BlogPost[] {
  const currentPost = allPosts.find(post => post.slug === currentSlug);
  if (!currentPost) return [];
  
  // Extract keywords from current post
  const keywords = getStoredKeywords();
  const currentKeywords = Object.keys(keywords).filter(keyword => 
    currentPost.content.toLowerCase().includes(keyword.toLowerCase()) ||
    currentPost.title.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // Score other posts based on keyword overlap
  const scoredPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let score = 0;
      const postText = `${post.title} ${post.content}`.toLowerCase();
      
      currentKeywords.forEach(keyword => {
        if (postText.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      
      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  return scoredPosts.slice(0, limit).map(item => item.post);
}

// Function to generate a related posts component
export function generateRelatedPostsComponent(currentSlug: string, allPosts: BlogPost[]): string {
  const relatedPosts = getRelatedPosts(currentSlug, allPosts, 3);
  
  if (relatedPosts.length === 0) return '';
  
  let component = '\n\n## Related Articles\n\n';
  
  relatedPosts.forEach(post => {
    component += `- [${post.title}](/blogs/${post.slug})\n`;
  });
  
  return component;
}

// Function to process a single blog post with internal linking
export function processBlogPostWithInternalLinks(post: BlogPost): BlogPost {
  const processedContent = addInternalLinks(post.content, post.slug);
  const relatedPostsSection = generateRelatedPostsComponent(post.slug, [post]);
  
  return {
    ...post,
    content: processedContent + relatedPostsSection
  };
}

// Function to process all blog posts with internal linking
export function processAllBlogPostsWithInternalLinks(posts: BlogPost[]): BlogPost[] {
  return posts.map(post => processBlogPostWithInternalLinks(post));
}