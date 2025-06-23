
export const formatAIContent = (content: string): string => {
  if (!content) return '';

  try {
    const parsed = JSON.parse(content);
    
    // Helper function to extract meaningful text from any object
    const extractMeaningfulText = (obj: any): string[] => {
      const texts: string[] = [];
      
      const traverse = (value: any, key?: string) => {
        if (typeof value === 'string' && value.trim().length > 20) {
          // Only include substantial text content, not keys or short identifiers
          const trimmed = value.trim();
          // Skip if it looks like a simple key/identifier (all lowercase, underscores, or very short)
          if (!trimmed.match(/^[a-z_\s]+$/i) || trimmed.length > 50) {
            texts.push(trimmed);
          }
        } else if (typeof value === 'object' && value !== null) {
          // For objects, traverse values but prioritize content fields
          if (Array.isArray(value)) {
            value.forEach(item => traverse(item));
          } else {
            // Prioritize certain field types that typically contain content
            const contentFields = ['description', 'value', 'benefits', 'explanation', 'summary', 'role', 'excitement', 'appeal', 'importance', 'careerBenefit'];
            const otherFields = Object.keys(value).filter(k => !contentFields.includes(k));
            
            // Process content fields first
            contentFields.forEach(field => {
              if (value[field]) {
                traverse(value[field], field);
              }
            });
            
            // Then process other fields
            otherFields.forEach(field => {
              traverse(value[field], field);
            });
          }
        }
      };
      
      traverse(obj);
      return texts;
    };

    const meaningfulTexts = extractMeaningfulText(parsed);
    
    if (meaningfulTexts.length > 0) {
      return meaningfulTexts.join('\n\n').trim();
    }
    
  } catch {
    // If it's not JSON, clean up any formatting and return
    return content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*{\s*/g, '')
      .replace(/\s*}\s*$/g, '')
      .replace(/"[^"]+"\s*:\s*/g, '') // Remove field names like "skill": 
      .replace(/[{}"\[\]]/g, '') // Remove JSON syntax
      .replace(/,\s*/g, '\n\n') // Convert commas to line breaks
      .trim();
  }
  
  // If JSON parsing succeeded but no content found, return cleaned version
  return content
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
};
