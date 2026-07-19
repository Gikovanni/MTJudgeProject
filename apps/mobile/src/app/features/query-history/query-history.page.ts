import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QueryHistoryEntry } from '../../core/models/query-history.model';
import { QueryHistoryService } from '../../core/services/query-history.service';

@Component({
  selector: 'app-query-history',
  templateUrl: './query-history.page.html',
  styleUrls: ['./query-history.page.scss'],
  standalone: false,
})
export class QueryHistoryPage {
  private readonly history = inject(QueryHistoryService);
  private readonly router = inject(Router);
  readonly entries$ = this.history.entries$;

  repeat(entry: QueryHistoryEntry): void {
    this.router.navigate(['/home'], { queryParams: { q: entry.query } });
  }

  toggleFavorite(id: string): void { this.history.toggleFavorite(id); }
  remove(id: string): void { this.history.remove(id); }
  clear(): void { this.history.clear(); }
}
