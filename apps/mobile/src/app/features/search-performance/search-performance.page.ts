import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { QueryHistoryEntry } from '../../core/models/query-history.model';
import { QueryHistoryService } from '../../core/services/query-history.service';

interface DashboardData { averageMs: number; medianMs: number; noResultRate: number; total: number; topQueries: { label: string; count: number }[]; topRules: { label: string; count: number }[]; entries: QueryHistoryEntry[]; }

@Component({ selector: 'app-search-performance', templateUrl: './search-performance.page.html', styleUrls: ['./search-performance.page.scss'], standalone: false })
export class SearchPerformancePage {
  private readonly history = inject(QueryHistoryService);
  readonly dashboard$ = this.history.entries$.pipe(map((entries) => this.toDashboard(entries)));
  clear(): void { this.history.clear(); }
  private toDashboard(entries: QueryHistoryEntry[]): DashboardData {
    const durations = entries.map((entry) => entry.durationMs ?? 0).filter((value) => value >= 0).sort((a, b) => a - b);
    const averageMs = durations.length ? durations.reduce((sum, value) => sum + value, 0) / durations.length : 0;
    const medianMs = durations.length ? durations[Math.floor(durations.length / 2)] : 0;
    const selectedRules = entries.map((entry) => entry.selectedRuleId ? `Regra ${entry.selectedRuleId}` : undefined).filter((ruleId): ruleId is string => ruleId !== undefined);
    return { averageMs, medianMs, noResultRate: entries.length ? entries.filter((entry) => entry.totalResults === 0).length / entries.length * 100 : 0, total: entries.length, topQueries: this.count(entries.map((entry) => entry.query)), topRules: this.count(selectedRules), entries: entries.slice(0, 10) };
  }
  private count(values: string[]): { label: string; count: number }[] { const counts = new Map<string, number>(); values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1)); return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, 5); }
}
