import { RuleDocument, RuleSearchResult, RulesSearchIndex, SearchConfidence, SearchExecution } from '../models/rule.model';

const STOP_WORDS = new Set(['a', 'as', 'at', 'como', 'com', 'da', 'de', 'do', 'e', 'em', 'funciona', 'o', 'os', 'para', 'por', 'que', 'the', 'uma', 'um', 'what', 'with', 'how', 'is', 'does', 'can', 'i', 'my', 'to', 'of', 'and', 'or', 'on', 'in', 'this', 'that']);
const ALIASES: Record<string, string[]> = { atropelar: ['trample'], trample: ['atropelar'], deathtouch: ['toque mortifero'], vigilancia: ['vigilance'], vigilance: ['vigilancia'], lifelink: ['vinculo com a vida'], pilha: ['stack'], stack: ['pilha'], exilar: ['exile'], exile: ['exilar'], anular: ['counter'], counter: ['anular'], etb: ['enters', 'battlefield'], morrer: ['dies', 'graveyard'] };
export const SEARCH_ALGORITHM_VERSION = 'bm25-local-v1';
export const normalizeRuleText = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[^a-z0-9.]+/g, ' ').replace(/\s+/g, ' ').trim();
const termsFor = (query: string): string[] => {
  const normalized = normalizeRuleText(query);
  const terms = new Set(normalized.split(' ').filter((word) => word.length > 1 && !STOP_WORDS.has(word)));
  Object.entries(ALIASES).forEach(([term, aliases]) => { if (normalized.includes(term)) aliases.forEach((alias) => alias.split(' ').forEach((word) => terms.add(word))); });
  return [...terms];
};
export const buildSearchIndex = (rules: RuleDocument[]): RulesSearchIndex => {
  const documentFrequency: Record<string, number> = {};
  const documents = rules.map((rule) => {
    const tokens = normalizeRuleText(`${rule.title} ${rule.text}`).split(' ').filter((term) => term.length > 1 && !STOP_WORDS.has(term));
    const termFrequencies: Record<string, number> = {};
    tokens.forEach((term) => { termFrequencies[term] = (termFrequencies[term] ?? 0) + 1; });
    Object.keys(termFrequencies).forEach((term) => { documentFrequency[term] = (documentFrequency[term] ?? 0) + 1; });
    return { id: rule.id, length: tokens.length || 1, termFrequencies, titleTerms: termsFor(rule.title) };
  });
  return { averageDocumentLength: documents.reduce((sum, document) => sum + document.length, 0) / Math.max(documents.length, 1), documentFrequency, documents, version: SEARCH_ALGORITHM_VERSION, vocabulary: Object.keys(documentFrequency) };
};
const editDistance = (left: string, right: string): number => { const row = Array.from({ length: right.length + 1 }, (_, i) => i); for (let i = 1; i <= left.length; i += 1) { let diagonal = row[0]; row[0] = i; for (let j = 1; j <= right.length; j += 1) { const previous = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (left[i - 1] === right[j - 1] ? 0 : 1)); diagonal = previous; } } return row[right.length]; };
const correctedTerm = (term: string, vocabulary: string[]): string | undefined => { if (term.length < 4) return undefined; const maximum = term.length >= 7 ? 2 : 1; let best: string | undefined; let distance = maximum + 1; for (const candidate of vocabulary) { if (Math.abs(candidate.length - term.length) > maximum) continue; const current = editDistance(term, candidate); if (current < distance || (current === distance && candidate < (best ?? candidate))) { best = candidate; distance = current; } } return distance <= maximum ? best : undefined; };
const confidenceFor = (score: number): SearchConfidence => score >= 9 ? 'high' : score >= 3 ? 'medium' : 'low';
const excerptFor = (text: string, terms: string[]): string => { const position = terms.map((term) => normalizeRuleText(text).indexOf(term)).find((value) => value >= 0) ?? -1; return position < 0 ? text.slice(0, 260).trim() : `${position > 90 ? '…' : ''}${text.slice(Math.max(0, position - 90), position + 180).trim()}…`; };
export const summaryForRule = (rule: RuleDocument): string | undefined => normalizeRuleText(rule.title).includes('trample') ? 'Atropelar permite atribuir dano excedente depois do dano letal.' : undefined;
export const searchRules = (rules: RuleDocument[], index: RulesSearchIndex, query: string, limit = 10, durationBeforeRanking = 0): SearchExecution => {
  const started = performance.now(); const normalizedQuery = normalizeRuleText(query); if (!normalizedQuery) return { algorithmVersion: index.version, correctedTerms: {}, durationMs: durationBeforeRanking, normalizedQuery, rankingDurationMs: 0, results: [], searchedTerms: [] };
  const correctedTerms: Record<string, string> = {}; const baseTerms = termsFor(query); const searchedTerms = baseTerms.map((term) => { if (index.documentFrequency[term]) return term; const correction = correctedTerm(term, index.vocabulary); if (correction && correction !== term) correctedTerms[term] = correction; return correction ?? term; });
  const exactId = /^\d{3}\.\d+(?:[a-z])?$/.test(normalizedQuery) ? normalizedQuery : undefined;
  const documentById = new Map(index.documents.map((document) => [document.id, document])); const total = rules.length;
  const results = rules.map((rule) => { const document = documentById.get(rule.id); if (!document) return undefined; const title = normalizeRuleText(rule.title); const text = normalizeRuleText(rule.text); let score = exactId === normalizeRuleText(rule.id) ? 100 : 0; const matchedTerms: string[] = [];
    searchedTerms.forEach((term) => { const frequency = document.termFrequencies[term] ?? 0; if (!frequency) return; const idf = Math.log(1 + (total - (index.documentFrequency[term] ?? 0) + .5) / ((index.documentFrequency[term] ?? 0) + .5)); const k1 = 1.2; const b = .75; score += idf * (frequency * (k1 + 1)) / (frequency + k1 * (1 - b + b * document.length / index.averageDocumentLength)); if (title.includes(term)) score += 4; matchedTerms.push(term); });
    if (title.includes(normalizedQuery)) score += 12; if (text.includes(normalizedQuery)) score += 4;
    return score > 0 ? { ...rule, confidence: confidenceFor(score), excerpt: excerptFor(rule.text, searchedTerms), matchedTerms, score, summary: undefined } : undefined;
  }).filter((result): result is RuleSearchResult => Boolean(result)).sort((left, right) => right.score - left.score || left.id.localeCompare(right.id, undefined, { numeric: true })).slice(0, limit);
  const rankingDurationMs = performance.now() - started; return { algorithmVersion: index.version, correctedTerms, durationMs: durationBeforeRanking + rankingDurationMs, normalizedQuery, rankingDurationMs, results, searchedTerms };
};
