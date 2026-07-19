import { Component, inject } from '@angular/core';
import { RuleSearchResult } from '../core/models/rule.model';
import { RuleSearchService } from '../core/services/rule-search.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  private readonly ruleSearch = inject(RuleSearchService);
  query = '';
  results: RuleSearchResult[] = [];
  searched = false;
  loading = false;
  errorMessage = '';
  readonly examples = ['Como funciona atropelar?', 'Toque mortífero', 'ETB', '702.19'];

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

}
