import { BlogPost } from './getBlogs';
import { getStoredKeywords } from './keywordStorage';

// Memoization cache for processed content
const contentCache = new Map<string, string>();

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

// Function to add internal links to content using the 37 keywords
export function addInternalLinks(content: string, excludeSlug?: string): string {
  // Create a cache key
  const cacheKey = `${excludeSlug || 'default'}_${content.substring(0, 100)}`;
  
  // Check cache first
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }
  
  let processedContent = content;
  const keywords = getStoredKeywords();
  const keywordKeys = Object.keys(keywords);
  
  // Limit to top 20 most important keywords to speed up processing
  const limitedKeywords = keywordKeys.slice(0, 20);
  
  // Sort keywords by length (longer keywords first to avoid partial matches)
  // Also sort by specificity - more specific terms first
  const sortedKeywords = limitedKeywords.sort((a, b) => {
    // First sort by length (longer first)
    if (b.length !== a.length) {
      return b.length - a.length;
    }
    // Then sort alphabetically for consistency
    return a.localeCompare(b);
  });
  
  // Track which keywords have been linked (case-insensitive) - only once per keyword
  const linkedKeywords = new Set<string>();
  
  // Track linked positions to prevent overlapping
  const linkedPositions = new Set<number>();
  
  // Find all potential keywords in the content
  const foundKeywords: Array<{ keyword: string; url: string; index: number; length: number }> = [];
  
  // Process each keyword
  for (const keyword of sortedKeywords) {
    const conceptUrl = keywords[keyword];
    const keywordLower = keyword.toLowerCase();
    
    // Skip if this keyword has already been linked (case-insensitive)
    if (linkedKeywords.has(keywordLower)) {
      continue;
    }
    
    // Find the first occurrence of this keyword in the content
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const match = regex.exec(processedContent);
    
    if (match) {
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;
      
      // Check if this position overlaps with an already linked position
      let overlaps = false;
      for (let i = startIndex; i < endIndex; i++) {
        if (linkedPositions.has(i)) {
          overlaps = true;
          break;
        }
      }
      
      if (overlaps) {
        continue;
      }
      
      // Skip if this is in a heading (lines starting with #)
      const lineStart = processedContent.lastIndexOf('\n', startIndex);
      const lineEnd = processedContent.indexOf('\n', startIndex);
      const line = processedContent.substring(
        lineStart === -1 ? 0 : lineStart + 1,
        lineEnd === -1 ? processedContent.length : lineEnd
      );
      
      if (line.trim().startsWith('#')) {
        continue;
      }
      
      // Enhanced HTML tag detection to prevent nesting
      const beforeMatch = processedContent.substring(0, startIndex);
      const afterMatch = processedContent.substring(endIndex);
      
      // Check if we're inside heading tags (h1, h2, h3, h4, h5, h6) - skip these
      const lastHeadingOpen = beforeMatch.lastIndexOf('<h');
      const nextHeadingClose = afterMatch.indexOf('>');
      
      if (lastHeadingOpen !== -1) {
        // Check if it's actually a heading tag (h1-h6)
        const headingTag = beforeMatch.substring(lastHeadingOpen, lastHeadingOpen + 3);
        if (/<h[1-6]/.test(headingTag)) {
          // Check if we're inside the heading (before the closing tag)
          if (nextHeadingClose !== -1) {
            continue; // We're inside a heading tag
          }
        }
      }
      
      // Additional check for existing <a> tags specifically
      const lastATag = beforeMatch.lastIndexOf('<a');
      const nextATagClose = afterMatch.indexOf('</a>');
      const nextATagOpen = afterMatch.indexOf('<a>');
      
      if (lastATag !== -1) {
        if (nextATagClose !== -1 && (nextATagOpen === -1 || nextATagClose < nextATagOpen)) {
          continue; // We're inside an existing link
        }
      }
      
      // Check if the keyword is part of an existing HTML attribute
      const beforeKeywordText = beforeMatch.substring(Math.max(0, beforeMatch.length - 50));
      if (beforeKeywordText.includes('href=') || beforeKeywordText.includes('src=') || beforeKeywordText.includes('alt=')) {
        continue;
      }
      
      // Check if the replacement would create invalid HTML
      const lastOpenTag = beforeMatch.lastIndexOf('<');
      const lastCloseTag = beforeMatch.lastIndexOf('>');
      const nextOpenTag = afterMatch.indexOf('<');
      const nextCloseTag = afterMatch.indexOf('>');
      
      // Only proceed if we're not inside any HTML tag
      if (lastOpenTag <= lastCloseTag && (nextOpenTag === -1 || nextCloseTag < nextOpenTag)) {
        // Add this keyword to the found list
        foundKeywords.push({
          keyword: match[0],
          url: conceptUrl,
          index: startIndex,
          length: match[0].length
        });
        
        // Mark these positions as linked
        for (let i = startIndex; i < endIndex; i++) {
          linkedPositions.add(i);
        }
        
        // Mark this keyword as linked (case-insensitive)
        linkedKeywords.add(keywordLower);
      }
    }
  }
  
  // Sort by index in reverse order to avoid offset issues when replacing
  foundKeywords.sort((a, b) => b.index - a.index);
  
  // Add links with HTML structure validation
  foundKeywords.forEach(({ keyword, url, index, length }) => {
    const beforeIndex = processedContent.substring(0, index);
    const afterIndex = processedContent.substring(index + length);
    
    const link = `<a href="${url}" class="internal-link text-blue-600 hover:text-blue-800 underline" title="Learn more about ${keyword}">${keyword}</a>`;
    processedContent = beforeIndex + link + afterIndex;
  });
  
  // Store in cache (limit cache size to prevent memory issues)
  if (contentCache.size > 200) {
    // Clear oldest entries
    const firstKey = contentCache.keys().next().value;
    if (firstKey !== undefined) {
      contentCache.delete(firstKey);
    }
  }
  contentCache.set(cacheKey, processedContent);
  
  return processedContent;
}