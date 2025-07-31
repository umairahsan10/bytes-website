import { keywordToUrlMap as defaultKeywords } from './internalLinking';

// Get keywords from localStorage or use defaults
export function getStoredKeywords(): Record<string, string> {
  if (typeof window === 'undefined') {
    return defaultKeywords;
  }
  
  const stored = localStorage.getItem('internal-linking-keywords');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse stored keywords:', error);
      return defaultKeywords;
    }
  }
  
  return defaultKeywords;
}

// Save keywords to localStorage
export function saveKeywords(keywords: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('internal-linking-keywords', JSON.stringify(keywords));
  } catch (error) {
    console.error('Failed to save keywords:', error);
  }
}

// Add a new keyword
export function addKeyword(keyword: string, url: string): boolean {
  const keywords = getStoredKeywords();
  
  if (keywords[keyword.toLowerCase()]) {
    return false; // Keyword already exists
  }
  
  keywords[keyword.toLowerCase()] = url;
  saveKeywords(keywords);
  return true;
}

// Remove a keyword
export function removeKeyword(keyword: string): boolean {
  const keywords = getStoredKeywords();
  
  if (!keywords[keyword.toLowerCase()]) {
    return false; // Keyword doesn't exist
  }
  
  delete keywords[keyword.toLowerCase()];
  saveKeywords(keywords);
  return true;
}

// Reset to default keywords
export function resetToDefaults(): void {
  saveKeywords(defaultKeywords);
} 