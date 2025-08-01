import { getStoredKeywords, saveKeywords } from './keywordStorage';

// Interface for keyword file format
export interface KeywordFileEntry {
  keyword: string;
  url: string;
  category?: string;
  description?: string;
}

export interface KeywordFile {
  keywords: KeywordFileEntry[];
  version?: string;
  lastUpdated?: string;
}

// Function to parse uploaded JSON file
export function parseKeywordFile(fileContent: string): { success: boolean; data?: KeywordFile; error?: string } {
  try {
    const data = JSON.parse(fileContent);
    
    // Validate file structure
    if (!data.keywords || !Array.isArray(data.keywords)) {
      return { success: false, error: 'Invalid file format: missing keywords array' };
    }
    
    // Validate each keyword entry
    for (const entry of data.keywords) {
      if (!entry.keyword || !entry.url) {
        return { success: false, error: 'Invalid keyword entry: missing keyword or URL' };
      }
      
      if (!entry.url.startsWith('/blogs/')) {
        return { success: false, error: `Invalid URL format for keyword "${entry.keyword}": ${entry.url}` };
      }
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Invalid JSON file' };
  }
}

// Function to import keywords from file
export function importKeywordsFromFile(fileContent: string): { success: boolean; message: string; count?: number } {
  const result = parseKeywordFile(fileContent);
  
  if (!result.success || !result.data) {
    return { success: false, message: result.error || 'Failed to parse file' };
  }
  
  // Convert to the format expected by storage
  const keywordMap: Record<string, string> = {};
  result.data.keywords.forEach(entry => {
    keywordMap[entry.keyword.toLowerCase()] = entry.url;
  });
  
  // Save to storage
  saveKeywords(keywordMap);
  
  return { 
    success: true, 
    message: `Successfully imported ${result.data.keywords.length} keywords`,
    count: result.data.keywords.length
  };
}

// Function to export current keywords to JSON file
export function exportKeywordsToFile(): string {
  const keywords = getStoredKeywords();
  const keywordEntries: KeywordFileEntry[] = Object.entries(keywords).map(([keyword, url]) => ({
    keyword,
    url,
    category: getCategoryFromUrl(url)
  }));
  
  const fileData: KeywordFile = {
    keywords: keywordEntries,
    version: '1.0',
    lastUpdated: new Date().toISOString()
  };
  
  return JSON.stringify(fileData, null, 2);
}

// Function to merge keywords from file (keep existing + add new)
export function mergeKeywordsFromFile(fileContent: string): { success: boolean; message: string; added?: number; total?: number } {
  const result = parseKeywordFile(fileContent);
  
  if (!result.success || !result.data) {
    return { success: false, message: result.error || 'Failed to parse file' };
  }
  
  const currentKeywords = getStoredKeywords();
  let addedCount = 0;
  
  // Add new keywords, skip existing ones
  result.data.keywords.forEach(entry => {
    const key = entry.keyword.toLowerCase();
    if (!currentKeywords[key]) {
      currentKeywords[key] = entry.url;
      addedCount++;
    }
  });
  
  // Save merged keywords
  saveKeywords(currentKeywords);
  
  return { 
    success: true, 
    message: `Added ${addedCount} new keywords (${Object.keys(currentKeywords).length} total)`,
    added: addedCount,
    total: Object.keys(currentKeywords).length
  };
}

// Helper function to determine category from URL
function getCategoryFromUrl(url: string): string {
  if (url.includes('seo')) return 'SEO';
  if (url.includes('web')) return 'Web Development';
  if (url.includes('mobile') || url.includes('app')) return 'Mobile Apps';
  if (url.includes('marketing')) return 'Digital Marketing';
  return 'General';
}

// Function to generate a template file for users
export function generateTemplateFile(): string {
  const template: KeywordFile = {
    keywords: [
      {
        keyword: "example keyword",
        url: "/blogs/example-blog-post",
        category: "SEO",
        description: "Optional description"
      },
      {
        keyword: "another keyword",
        url: "/blogs/another-blog-post",
        category: "Web Development"
      }
    ],
    version: "1.0",
    lastUpdated: new Date().toISOString()
  };
  
  return JSON.stringify(template, null, 2);
} 

// Function to generate code update for internalLinking.ts
export function generateCodeUpdate(fileContent: string): { success: boolean; codeUpdate?: string; error?: string } {
  const result = parseKeywordFile(fileContent);
  
  if (!result.success || !result.data) {
    return { success: false, error: result.error || 'Failed to parse file' };
  }
  
  // Convert to the format expected by the code
  const keywordMap: Record<string, string> = {};
  result.data.keywords.forEach(entry => {
    keywordMap[entry.keyword.toLowerCase()] = entry.url;
  });
  
  // Generate the code update
  const codeUpdate = `// Updated keywordToUrlMap - Generated on ${new Date().toISOString()}
export const keywordToUrlMap: Record<string, string> = ${JSON.stringify(keywordMap, null, 2)};`;
  
  return { success: true, codeUpdate };
}

// Function to merge keywords and generate code update
export function mergeKeywordsAndGenerateCode(fileContent: string): { 
  success: boolean; 
  message: string; 
  codeUpdate?: string;
  added?: number; 
  total?: number 
} {
  const result = parseKeywordFile(fileContent);
  
  if (!result.success || !result.data) {
    return { success: false, message: result.error || 'Failed to parse file' };
  }
  
  const currentKeywords = getStoredKeywords();
  let addedCount = 0;
  
  // Add new keywords, skip existing ones
  result.data.keywords.forEach(entry => {
    const key = entry.keyword.toLowerCase();
    if (!currentKeywords[key]) {
      currentKeywords[key] = entry.url;
      addedCount++;
    }
  });
  
  // Save to storage
  saveKeywords(currentKeywords);
  
  // Generate code update
  const codeResult = generateCodeUpdate(fileContent);
  
  return { 
    success: true, 
    message: `Successfully merged ${addedCount} new keywords (${Object.keys(currentKeywords).length} total)`,
    codeUpdate: codeResult.codeUpdate,
    added: addedCount,
    total: Object.keys(currentKeywords).length
  };
} 