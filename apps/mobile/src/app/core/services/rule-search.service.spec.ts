import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RuleSearchService } from './rule-search.service';

const database = {
  metadata: { sourceFile: 'MagicCompRules.pdf', effectiveDate: '2026-02-27', totalPages: 1, totalRules: 3 },
  rules: [
    { id: '702.19', title: 'Trample', text: '702.19. Trample is a static ability.', page: 150 },
    { id: '702.19a', title: 'Rule 702.19a', text: '702.19a Details of trample.', page: 150 },
    { id: '702.2', title: 'Deathtouch', text: '702.2. Deathtouch is a static ability.', page: 144 },
  ],
};

describe('RuleSearchService detail lookup', () => {
  let service: RuleSearchService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(RuleSearchService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the full rule and its subrules', () => {
    service.getDetail('702.19').subscribe((detail) => {
      expect(detail?.rule.title).toBe('Trample');
      expect(detail?.summary).toContain('Atropelar');
      expect(detail?.relatedRules.map((rule) => rule.id)).toEqual(['702.19a']);
    });

    http.expectOne('assets/rules/rules-index.json').flush(database);
  });

  it('returns undefined for an absent rule', () => {
    service.getDetail('999.99').subscribe((detail) => expect(detail).toBeUndefined());
    http.expectOne('assets/rules/rules-index.json').flush(database);
  });
});
