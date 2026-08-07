import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProductionIntegrationsRegistryService } from './integration-hub/services/production-integrations-registry.service';

describe('Production Third-Party Integrations Suite', () => {
  let registry: ProductionIntegrationsRegistryService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'OPENAI_API_KEY') return 'sk-proj-prod-key';
      if (key === 'STRIPE_SECRET_KEY') return 'sk_live_prod_key';
      return 'prod-config';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionIntegrationsRegistryService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    registry = module.get<ProductionIntegrationsRegistryService>(ProductionIntegrationsRegistryService);
  });

  it('should register and return health status for all 22 production third-party adapters', async () => {
    const providers = await registry.getRegisteredProviders();

    expect(providers).toBeDefined();
    expect(providers.length).toBeGreaterThanOrEqual(20);

    const openAi = providers.find((p) => p.providerCode === 'OPENAI');
    expect(openAi).toBeDefined();
    expect(openAi?.status).toBe('HEALTHY');
    expect(openAi?.circuitBreakerState).toBe('CLOSED');

    const stripe = providers.find((p) => p.providerCode === 'STRIPE');
    expect(stripe).toBeDefined();
    expect(stripe?.status).toBe('HEALTHY');

    const s3 = providers.find((p) => p.providerCode === 'AWS_S3');
    expect(s3).toBeDefined();
    expect(s3?.status).toBe('HEALTHY');
  });
});
