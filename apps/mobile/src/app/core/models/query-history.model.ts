export interface QueryHistoryEntry {
  favorite: boolean;
  id: string;
  query: string;
  searchedAt: string;
  selectedRuleId?: string;
  totalResults: number;
}
