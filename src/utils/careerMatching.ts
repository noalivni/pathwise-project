// Re-export all functions from the refactored modules
export { parseSkillsFromText } from './skillsParsing';
export { getMatchColor, getMatchDescription } from './matchScoring';
export { calculateCareerMatch } from './basicCareerMatching';
export { calculatePersonalizedCareerMatch } from './personalizedCareerMatching';

// Keep the types for backwards compatibility
export type { MatchCalculationParams, PersonalizedMatchParams } from '@/types/jobRecommendations';
