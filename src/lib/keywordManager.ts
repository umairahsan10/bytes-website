import { getStoredKeywords } from './keywordStorage';
import { getBlogs } from './getBlogs';

// Interface for keyword management
export interface KeywordEntry {
  keyword: string;
  url: string;
  category: string;
  description?: string;
}

// Function to add a new keyword to the map
export function addKeyword(keyword: string, url: string, category: string, description?: string): void {
  // This would typically update a database or CMS
  // For now, we'll log the addition
  console.log(`Adding keyword: "${keyword}" -> "${url}" (${category})`);
  
  // In a real implementation, you might:
  // 1. Update a database
  // 2. Update a CMS
  // 3. Update a configuration file
  // 4. Trigger a rebuild
}

// Function to remove a keyword
export function removeKeyword(keyword: string): void {
  console.log(`Removing keyword: "${keyword}"`);
}

// Function to get all keywords by category
export function getKeywordsByCategory(category: string): KeywordEntry[] {
  const entries: KeywordEntry[] = [];
  const keywords = getStoredKeywords();
  
  Object.entries(keywords).forEach(([keyword, url]) => {
    // Determine category based on URL or keyword
    let cat = 'General';
    if (url.includes('seo')) cat = 'SEO';
    else if (url.includes('web')) cat = 'Web Development';
    else if (url.includes('mobile') || url.includes('app')) cat = 'Mobile Apps';
    else if (url.includes('marketing')) cat = 'Digital Marketing';
    
    if (cat === category) {
      entries.push({ keyword, url, category: cat });
    }
  });
  
  return entries;
}

// Function to suggest keywords based on content
export function suggestKeywords(content: string, existingKeywords: string[]): string[] {
  const words = content.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  
  // Count word frequency
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 3) {
      wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
    }
  });
  
  // Find potential keywords (words that appear multiple times)
  const suggestions = Object.entries(wordFreq)
    .filter(([word, freq]) => freq > 2 && !existingKeywords.includes(word))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  return suggestions;
}

// Function to validate keyword mapping
export function validateKeywordMapping(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const keywords = getStoredKeywords();
  
  Object.entries(keywords).forEach(([keyword, url]) => {
    if (!url.startsWith('/blogs/')) {
      issues.push(`Invalid URL format for keyword "${keyword}": ${url}`);
    }
    
    if (keyword.length < 2) {
      issues.push(`Keyword too short: "${keyword}"`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// Function to export keyword mapping for backup
export function exportKeywordMapping(): string {
  const keywords = getStoredKeywords();
  return JSON.stringify(keywords, null, 2);
}

// Function to import keyword mapping from backup
export function importKeywordMapping(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);
    console.log('Keyword mapping imported successfully');
    console.log('New keywords:', Object.keys(data));
  } catch (error) {
    console.error('Failed to import keyword mapping:', error);
  }
}

// Function to get keyword statistics
export function getKeywordStats(): {
  totalKeywords: number;
  categories: Record<string, number>;
  averageKeywordLength: number;
} {
  const storedKeywords = getStoredKeywords();
  const keywords = Object.keys(storedKeywords);
  const categories: Record<string, number> = {};
  
  keywords.forEach(keyword => {
    const url = storedKeywords[keyword];
    let category = 'General';
    
    if (url.includes('seo')) category = 'SEO';
    else if (url.includes('web')) category = 'Web Development';
    else if (url.includes('mobile') || url.includes('app')) category = 'Mobile Apps';
    else if (url.includes('marketing')) category = 'Digital Marketing';
    
    categories[category] = (categories[category] || 0) + 1;
  });
  
  const averageLength = keywords.reduce((sum, keyword) => sum + keyword.length, 0) / keywords.length;
  
  return {
    totalKeywords: keywords.length,
    categories,
    averageKeywordLength: Math.round(averageLength * 100) / 100
  };
}

// Function to get all available blog URLs for the dropdown
export function getAvailableBlogUrls(): string[] {
  const blogs = getBlogs();
  return blogs.map(blog => `/blogs/${blog.slug}`);
} 