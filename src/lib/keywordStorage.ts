import { keywordToUrlMap as defaultKeywords } from './internalLinking';

// Get keywords from localStorage or use defaults (the 37 keywords)
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

// Save keywords to localStorage (for admin functionality)
export function saveKeywords(keywords: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('internal-linking-keywords', JSON.stringify(keywords));
  } catch (error) {
    console.error('Failed to save keywords:', error);
  }
}

// Remove a keyword (for admin functionality)
export function removeKeyword(keyword: string): boolean {
  const keywords = getStoredKeywords();
  
  if (!keywords[keyword.toLowerCase()]) {
    return false; // Keyword doesn't exist
  }
  
  delete keywords[keyword.toLowerCase()];
  saveKeywords(keywords);
  return true;
}

// Reset to default 37 keywords
export function resetToDefaults(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('internal-linking-keywords', JSON.stringify(defaultKeywords));
  } catch (error) {
    console.error('Failed to reset keywords:', error);
  }
} 