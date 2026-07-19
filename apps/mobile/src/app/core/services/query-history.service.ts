import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryHistoryEntry } from '../models/query-history.model';

const STORAGE_KEY = 'mtjudge.query-history.v1';
const MAX_ENTRIES = 100;

@Injectable({ providedIn: 'root' })
export class QueryHistoryService {
  private readonly entriesSubject = new BehaviorSubject<QueryHistoryEntry[]>(this.read());
  readonly entries$ = this.entriesSubject.asObservable();

  recordSearch(query: string, totalResults: number): string {
    const entry: QueryHistoryEntry = { favorite: false, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, query: query.trim(), searchedAt: new Date().toISOString(), totalResults };
    this.update([entry, ...this.entriesSubject.value]);
    return entry.id;
  }

  markSelected(id: string | undefined, selectedRuleId: string): void {
    if (!id) return;
    this.update(this.entriesSubject.value.map((entry) => entry.id === id ? { ...entry, selectedRuleId } : entry));
  }

  toggleFavorite(id: string): void {
    this.update(this.entriesSubject.value.map((entry) => entry.id === id ? { ...entry, favorite: !entry.favorite } : entry));
  }

  remove(id: string): void { this.update(this.entriesSubject.value.filter((entry) => entry.id !== id)); }
  clear(): void { this.update([]); }

  private read(): QueryHistoryEntry[] {
    try {
      const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as QueryHistoryEntry[];
      return Array.isArray(entries) ? entries : [];
    } catch { return []; }
  }

  private update(entries: QueryHistoryEntry[]): void {
    const limitedEntries = entries.slice(0, MAX_ENTRIES);
    this.entriesSubject.next(limitedEntries);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedEntries)); } catch { /* Storage is optional. */ }
  }
}
