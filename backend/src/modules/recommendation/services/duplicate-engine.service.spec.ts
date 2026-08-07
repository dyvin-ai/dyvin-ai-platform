import { DuplicateEngineService } from './duplicate-engine.service';
import { RecommendationType } from '@prisma/client';

describe('DuplicateEngineService', () => {
  let service: DuplicateEngineService;

  beforeEach(() => {
    service = new DuplicateEngineService();
  });

  it('should deduplicate identical draft recommendations', () => {
    const drafts = [
      { category: RecommendationType.SCHEMA, title: 'Add Schema', summary: '', problem: '', whyItMatters: '', impactScore: 80 },
      { category: RecommendationType.SCHEMA, title: '  Add Schema  ', summary: '', problem: '', whyItMatters: '', impactScore: 80 },
    ];

    const result = service.deduplicate(drafts);
    expect(result).toHaveLength(1);
  });
});
