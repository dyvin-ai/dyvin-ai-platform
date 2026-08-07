import { ChangeDetectorService } from './change-detector.service';
import { ChangeImpact } from '@prisma/client';

describe('ChangeDetectorService', () => {
  let service: ChangeDetectorService;

  beforeEach(() => {
    service = new ChangeDetectorService();
  });

  it('should detect structured data changes with MAJOR impact', () => {
    const before = { structuredData: [{ type: 'Organization' }] };
    const after = { structuredData: [{ type: 'Organization' }, { type: 'Product' }] };

    const changes = service.detectChanges(before, after);
    expect(changes).toHaveLength(1);
    expect(changes[0].changeType).toBe('STRUCTURED_DATA_CHANGE');
    expect(changes[0].impact).toBe(ChangeImpact.MAJOR);
  });
});
