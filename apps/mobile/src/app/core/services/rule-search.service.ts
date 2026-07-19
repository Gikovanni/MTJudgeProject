import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { RuleSearchResult, RulesDatabase } from '../models/rule.model';
import { searchRules } from './rule-search.engine';

@Injectable({ providedIn: 'root' })
export class RuleSearchService {
  private readonly http = inject(HttpClient);
  private readonly database$ = this.http
    .get<RulesDatabase>('assets/rules/rules-index.json')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));
  search(query: string): Observable<RuleSearchResult[]> {
    return this.database$.pipe(map((database) => searchRules(database.rules, query)));
  }
}
