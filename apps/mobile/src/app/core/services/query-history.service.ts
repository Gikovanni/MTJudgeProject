import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryHistoryEntry } from '../models/query-history.model';
import { SearchExecution } from '../models/rule.model';
const STORAGE_KEY = 'mtjudge.query-history.v1'; const MAX_ENTRIES = 100;
@Injectable({ providedIn: 'root' })
export class QueryHistoryService {
  private readonly entriesSubject = new BehaviorSubject<QueryHistoryEntry[]>(this.read());
  readonly entries$ = this.entriesSubject.asObservable();
  recordSearch(query: string, execution: SearchExecution): string { const entry: QueryHistoryEntry = { algorithmVersion: execution.algorithmVersion, correctedTerms: execution.correctedTerms, durationMs: execution.durationMs, favorite: false, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, normalizedQuery: execution.normalizedQuery, query: query.trim(), rankingDurationMs: execution.rankingDurationMs, searchedAt: new Date().toISOString(), searchedTerms: execution.searchedTerms, topConfidence: execution.results[0]?.confidence, totalResults: execution.results.length }; this.update([entry, ...this.entriesSubject.value]); return entry.id; }
  markSelected(id: string | undefined, selectedRuleId: string): void { if (id) this.update(this.entriesSubject.value.map((entry) => entry.id === id ? { ...entry, selectedRuleId } : entry)); }
  toggleFavorite(id: string): void { this.update(this.entriesSubject.value.map((entry) => entry.id === id ? { ...entry, favorite: !entry.favorite } : entry)); }
  remove(id: string): void { this.update(this.entriesSubject.value.filter((entry) => entry.id !== id)); }
  clear(): void { this.update([]); }
  private read(): QueryHistoryEntry[] { try { const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as QueryHistoryEntry[]; return Array.isArray(entries) ? entries.slice(0, MAX_ENTRIES) : []; } catch { return []; } }
  private update(entries: QueryHistoryEntry[]): void { const limited = entries.slice(0, MAX_ENTRIES); this.entriesSubject.next(limited); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(limited)); } catch { /* Storage is optional. */ } }
}
