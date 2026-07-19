export interface RuleDocument { id: string; title: string; text: string; page: number; }
export type SearchConfidence = 'high' | 'medium' | 'low';
export interface RulesDatabase { metadata: { sourceFile: string; effectiveDate: string; totalPages: number; totalRules: number; }; rules: RuleDocument[]; }
export interface RuleSearchIndexDocument { id: string; length: number; termFrequencies: Record<string, number>; titleTerms: string[]; }
export interface RulesSearchIndex { averageDocumentLength: number; documentFrequency: Record<string, number>; documents: RuleSearchIndexDocument[]; version: string; vocabulary: string[]; }
export interface RuleSearchResult extends RuleDocument { confidence: SearchConfidence; excerpt: string; matchedTerms: string[]; score: number; summary?: string; }
export interface SearchExecution { algorithmVersion: string; correctedTerms: Record<string, string>; durationMs: number; normalizedQuery: string; rankingDurationMs: number; results: RuleSearchResult[]; searchedTerms: string[]; }
export interface RuleDetail { relatedRules: RuleDocument[]; rule: RuleDocument; summary?: string; }
