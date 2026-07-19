import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { RuleSearchService } from '../../core/services/rule-search.service';

@Component({
  selector: 'app-rule-detail',
  templateUrl: './rule-detail.page.html',
  styleUrls: ['./rule-detail.page.scss'],
  standalone: false,
})
export class RuleDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly ruleSearch = inject(RuleSearchService);
  readonly detail$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    switchMap((id) => this.ruleSearch.getDetail(id ?? '')),
  );
  mode: 'summary' | 'official' = 'summary';

  pdfUrl(page: number): string {
    return `assets/rules/MagicCompRules.pdf#page=${page}`;
  }
}
