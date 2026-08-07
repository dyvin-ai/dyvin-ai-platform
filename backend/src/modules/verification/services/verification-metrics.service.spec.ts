import { VerificationMetricsService } from './verification-metrics.service';

describe('VerificationMetricsService', () => {
  let service: VerificationMetricsService;

  beforeEach(() => {
    service = new VerificationMetricsService();
  });

  it('should evaluate metric deltas and confidence', () => {
    const metric = service.evaluateMetric('OVERALL_SCORE', '60', '75');
    expect(metric.delta).toBe(15);
    expect(metric.confidence).toBe(100);
  });
});
