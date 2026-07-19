import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { RuleDetail, RulesDatabase, SearchExecution } from '../models/rule.model';
import { buildSearchIndex, searchRules, summaryForRule } from './rule-search.engine';
@Injectable({ providedIn: 'root' })
export class RuleSearchService {
  private readonly http = inject(HttpClient);
  private readonly database$ = this.http.get<RulesDatabase>('assets/rules/rules-index.json').pipe(shareReplay({ bufferSize: 1, refCount: false }));
  private readonly indexedDatabase$ = this.database$.pipe(map((database) => ({ database, index: buildSearchIndex(database.rules) })), shareReplay({ bufferSize: 1, refCount: false }));
  search(query: string): Observable<SearchExecution> { const startedAt = performance.now(); return this.indexedDatabase$.pipe(map(({ database, index }) => searchRules(database.rules, index, query, 10, performance.now() - startedAt))); }
  getDetail(id: string): Observable<RuleDetail | undefined> { return this.database$.pipe(map((database) => { const rule = database.rules.find((candidate) => candidate.id === id); if (!rule) return undefined; const rootId = rule.id.replace(/[a-z]$/, ''); return { rule, relatedRules: database.rules.filter((candidate) => candidate.id !== rule.id && candidate.id.startsWith(rootId)).slice(0, 8), summary: summaryForRule(rule) }; })); }
}
