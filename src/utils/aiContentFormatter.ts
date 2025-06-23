
export const formatAIContent = (content: string): string => {
  if (!content) return '';

  try {
    const parsed = JSON.parse(content);
    
    // Helper function to extract meaningful text from any object
    const extractMeaningfulText = (obj: any): string[] => {
      const texts: string[] = [];
      
      const traverse = (value: any) => {
        if (typeof value === 'string' && value.trim().length > 10) {
          // Only include strings that look like meaningful content (not keys or short values)
          if (!value.match(/^[a-z_]+$/i) && value.length > 15) {
            texts.push(value.trim());
          }
        } else if (typeof value === 'object' && value !== null) {
          Object.values(value).forEach(traverse);
        }
      };
      
      traverse(obj);
      return texts;
    };

    const meaningfulTexts = extractMeaningfulText(parsed);
    
    if (meaningfulTexts.length > 0) {
      return meaningfulTexts.join('\n\n').trim();
    }
    
    // Fallback: if no meaningful text found, try to extract from common field names
    if (parsed.summary) {
      return extractMeaningfulText(parsed.summary).join('\n\n').trim();
    }
    
    if (parsed.explanation) {
      return typeof parsed.explanation === 'string' ? parsed.explanation : extractMeaningfulText(parsed.explanation).join('\n\n').trim();
    }
    
    if (parsed.description) {
      return typeof parsed.description === 'string' ? parsed.description : extractMeaningfulText(parsed.description).join('\n\n').trim();
    }
    
  } catch {
    // If it's not JSON, return as-is
  }
  
  // Clean up any remaining JSON-like formatting
  return content
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .replace(/^\s*{\s*/g, '')
    .replace(/\s*}\s*$/g, '')
    .trim();
};
