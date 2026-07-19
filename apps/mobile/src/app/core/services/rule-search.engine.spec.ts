import { RuleDocument } from '../models/rule.model';
import { normalizeRuleText, searchRules } from './rule-search.engine';

const rules: RuleDocument[] = [
  { id: '702.19', title: 'Trample', text: '702.19. Trample 702.19a Trample is a static ability that modifies combat damage.', page: 150 },
  { id: '702.2', title: 'Deathtouch', text: '702.2. Deathtouch is a static ability.', page: 143 },
];

describe('rule search engine', () => {
  it('normalizes accents and letter case', () => {
    expect(normalizeRuleText('Vínculo com a Vida')).toBe('vinculo com a vida');
  });

  it('finds English rules through Portuguese aliases', () => {
    const results = searchRules(rules, 'Como funciona atropelar?');
    expect(results[0].id).toBe('702.19');
    expect(results[0].confidence).toBe('high');
    expect(results[0].summary).toContain('Atropelar');
  });

  it('prioritizes an exact rule number', () => {
    const results = searchRules(rules, '702.19');
    expect(results).toHaveSize(1);
    expect(results[0].id).toBe('702.19');
  });

  it('returns no result for an unknown query', () => {
    expect(searchRules(rules, 'uma habilidade inexistente')).toEqual([]);
  });
});
