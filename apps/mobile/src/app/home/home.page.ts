import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { RuleSearchResult } from '../core/models/rule.model';
import { QueryHistoryService } from '../core/services/query-history.service';
import { RuleSearchService } from '../core/services/rule-search.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  private readonly history = inject(QueryHistoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ruleSearch = inject(RuleSearchService);
  readonly recentEntries$ = this.history.entries$.pipe(map((entries) => entries.slice(0, 3)));
  private activeHistoryId?: string;
  query = '';
  results: RuleSearchResult[] = [];
  searched = false;
  loading = false;
  errorMessage = '';
  readonly examples = ['Como funciona atropelar?', 'Toque mortífero', 'ETB', '702.19'];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const query = params.get('q');
      if (query && query !== this.query) this.search(query);
    });
  }

  search(query = this.query): void {
    this.query = query;
    const trimmedQuery = this.query.trim();
    this.searched = Boolean(trimmedQuery);
    this.results = [];
    this.errorMessage = '';

    if (!trimmedQuery) return;

    this.loading = true;
    this.ruleSearch.search(trimmedQuery).subscribe({
      next: (results) => {
        this.results = results;
        this.activeHistoryId = this.history.recordSearch(trimmedQuery, results.length);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar a base local de regras.';
        this.loading = false;
      },
    });
  }

  clear(): void {
    this.query = '';
    this.results = [];
    this.searched = false;
    this.errorMessage = '';
  }

  pdfUrl(page: number): string {
    return `assets/rules/MagicCompRules.pdf#page=${page}`;
  }

  openDetail(ruleId: string): void {
    this.history.markSelected(this.activeHistoryId, ruleId);
    this.router.navigate(['/rules', ruleId]);
  }

}
