import { QueryHistoryService } from './query-history.service';
import { QueryHistoryEntry } from '../models/query-history.model';

describe('QueryHistoryService', () => {
  let service: QueryHistoryService;

  beforeEach(() => {
    localStorage.clear();
    service = new QueryHistoryService();
  });

  it('stores a completed search and selected rule', () => {
    const id = service.recordSearch('atropelar', 3);
    service.markSelected(id, '702.19');
    let entry: QueryHistoryEntry | undefined;
    service.entries$.subscribe((entries) => entry = entries[0]);

    expect(entry?.query).toBe('atropelar');
    expect(entry?.selectedRuleId).toBe('702.19');
  });

  it('toggles favorites and removes entries', () => {
    const id = service.recordSearch('pilha', 2);
    service.toggleFavorite(id);
    service.remove(id);
    let entries: QueryHistoryEntry[] = [];
    service.entries$.subscribe((value) => entries = value);

    expect(entries).toEqual([]);
  });
});
