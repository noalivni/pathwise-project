
export const formatAIContent = (content: string): string => {
  if (!content) return '';

  try {
    const parsed = JSON.parse(content);
    
    // Helper function to extract meaningful text from any object
    const extractMeaningfulText = (obj: any): string[] => {
      const texts: string[] = [];
      
      const traverse = (value: any) => {
        if (typeof value === 'string' && value.trim().length > 5) {
          // Include any string that looks like meaningful content
          // Exclude simple keys or very short values
          const trimmed = value.trim();
          if (trimmed.length > 10 && !trimmed.match(/^[a-z_]+$/i)) {
            texts.push(trimmed);
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
    // If it's not JSON, return as-is but clean up any formatting
    return content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*{\s*/g, '')
      .replace(/\s*}\s*$/g, '')
      .trim();
  }
  
  // If we get here, the JSON didn't contain extractable content
  return content
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
};
