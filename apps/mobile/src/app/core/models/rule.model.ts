export interface RuleDocument {
  id: string;
  title: string;
  text: string;
  page: number;
}

export interface RulesDatabase {
  metadata: {
    sourceFile: string;
    effectiveDate: string;
    totalPages: number;
    totalRules: number;
  };
  rules: RuleDocument[];
}

export type SearchConfidence = 'high' | 'medium' | 'low';

export interface RuleSearchResult extends RuleDocument {
  confidence: SearchConfidence;
  excerpt: string;
  matchedTerms: string[];
  score: number;
  summary?: string;
}
