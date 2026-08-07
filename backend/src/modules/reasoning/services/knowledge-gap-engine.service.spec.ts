import { KnowledgeGapEngineService } from './knowledge-gap-engine.service';
import { GapType } from '@prisma/client';

describe('KnowledgeGapEngineService', () => {
  let service: KnowledgeGapEngineService;

  beforeEach(() => {
    service = new KnowledgeGapEngineService();
  });

  it('should detect missing schema and FAQs gaps', () => {
    const gaps = service.detectGaps({
      scanPagesCount: 1,
      hasSchema: false,
      hasHttps: true,
      securityScore: 90,
      entityCount: 1,
      factCount: 2,
      hasProducts: true,
      hasServices: true,
      hasFaqs: false,
    });

    const gapTypes = gaps.map((g) => g.gapType);
    expect(gapTypes).toContain(GapType.MISSING_SCHEMA);
    expect(gapTypes).toContain(GapType.MISSING_FAQS);
  });
});
