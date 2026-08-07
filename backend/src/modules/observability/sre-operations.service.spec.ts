import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SREOperationsService } from './sre-operations.service';

describe('SREOperationsService Observability Spec', () => {
  let service: SREOperationsService;

  const mockConfigService = { get: jest.fn().mockReturnValue('production') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SREOperationsService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SREOperationsService>(SREOperationsService);
  });

  it('should return component health registry with latency metrics', async () => {
    const health = await service.getHealthRegistry();
    expect(health).toBeDefined();
    expect(health.length).toBeGreaterThanOrEqual(5);

    const postgres = health.find((h) => h.component.includes('PostgreSQL'));
    expect(postgres).toBeDefined();
    expect(postgres?.status).toBe('UP');
  });

  it('should return compliant SLO metrics', async () => {
    const slo = await service.getSLOMetrics();
    expect(slo).toBeDefined();
    expect(slo.sloStatus).toBe('COMPLIANT');
    expect(slo.currentP99LatencyMs).toBeLessThanOrEqual(slo.targetP99LatencyMs);
  });

  it('should calculate 30-day capacity forecast metrics', async () => {
    const capacity = await service.getCapacityForecast();
    expect(capacity).toBeDefined();
    expect(capacity.databaseStorageUtilizationPercent).toBeLessThan(80);
    expect(capacity.recommendedPodReplicas).toBeGreaterThan(0);
  });

  it('should return FinOps cost tracking per AI provider', async () => {
    const costs = await service.getCostObservability();
    expect(costs).toBeDefined();
    expect(costs.providerCosts.openAiUsd).toBeGreaterThan(0);
    expect(costs.providerCosts.anthropicClaudeUsd).toBeGreaterThan(0);
  });
});
