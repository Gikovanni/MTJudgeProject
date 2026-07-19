import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { RuleDetail, RuleSearchResult, RulesDatabase } from '../models/rule.model';
import { searchRules, summaryForRule } from './rule-search.engine';

@Injectable({ providedIn: 'root' })
export class RuleSearchService {
  private readonly http = inject(HttpClient);
  private readonly database$ = this.http
    .get<RulesDatabase>('assets/rules/rules-index.json')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));
  search(query: string): Observable<RuleSearchResult[]> {
    return this.database$.pipe(map((database) => searchRules(database.rules, query)));
  }

  getDetail(id: string): Observable<RuleDetail | undefined> {
    return this.database$.pipe(map((database) => {
      const rule = database.rules.find((candidate) => candidate.id === id);
      if (!rule) return undefined;

      const rootId = rule.id.replace(/[a-z]$/, '');
      const relatedRules = database.rules
        .filter((candidate) => candidate.id !== rule.id && candidate.id.startsWith(rootId))
        .slice(0, 8);

      return { rule, relatedRules, summary: summaryForRule(rule) };
    }));
  }
}
