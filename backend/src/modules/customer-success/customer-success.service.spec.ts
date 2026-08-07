import { Test, TestingModule } from '@nestjs/testing';
import { CustomerHealthService } from './services/customer-health.service';
import { CustomerJourneyService } from './services/customer-journey.service';
import { ProductAdoptionService } from './services/product-adoption.service';
import { ChurnPredictionService } from './services/churn-prediction.service';
import { CustomerSuccessAssistantService } from './services/customer-success-assistant.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase L: Enterprise Customer Success Platform Spec', () => {
  let healthService: CustomerHealthService;
  let journeyService: CustomerJourneyService;
  let adoptionService: ProductAdoptionService;
  let churnService: ChurnPredictionService;
  let assistantService: CustomerSuccessAssistantService;

  const mockPrismaService = {
    customerSuccessHealthRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'hlth-1', ...data })),
    },
    customerSuccessJourneyMilestone: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'm-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'm-1', milestone: 'SIGNUP' }]),
    },
    customerChurnPrediction: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'churn-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerHealthService,
        CustomerJourneyService,
        ProductAdoptionService,
        ChurnPredictionService,
        CustomerSuccessAssistantService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    healthService = module.get<CustomerHealthService>(CustomerHealthService);
    journeyService = module.get<CustomerJourneyService>(CustomerJourneyService);
    adoptionService = module.get<ProductAdoptionService>(ProductAdoptionService);
    churnService = module.get<ChurnPredictionService>(ChurnPredictionService);
    assistantService = module.get<CustomerSuccessAssistantService>(CustomerSuccessAssistantService);
  });

  it('should calculate 0-100 overall customer health score', async () => {
    const health = await healthService.calculateHealthScore('org-100');
    expect(health.overallHealthScore).toBeGreaterThan(0);
    expect(health.overallHealthScore).toBeLessThanOrEqual(100);
    expect(health.category).toBe('HEALTHY');
  });

  it('should track customer journey milestones', async () => {
    const milestone = await journeyService.trackMilestone('org-100', 'FIRST_CRAWL');
    expect(milestone).toBeDefined();
    expect(milestone.id).toBe('m-1');
  });

  it('should compute product adoption depth and sticky ratio', async () => {
    const adoption = await adoptionService.getAdoptionMetrics('org-100');
    expect(adoption.overallAdoptionScore).toBeGreaterThan(50);
    expect(adoption.activeModules.length).toBeGreaterThan(0);
  });

  it('should predict churn probability with low risk category', async () => {
    const churn = await churnService.predictChurnRisk('org-100');
    expect(churn.churnRisk).toBe('LOW');
    expect(churn.churnProbability).toBeLessThan(0.10);
    expect(churn.renewalProbability).toBeGreaterThan(0.90);
  });

  it('should generate automated 30-day success plan tasks via AI Assistant', async () => {
    const plan = await assistantService.generateSuccessPlan('org-100', 30);
    expect(plan.milestoneTasks.length).toBeGreaterThan(0);
    expect(plan.timeframeDays).toBe(30);
  });
});
