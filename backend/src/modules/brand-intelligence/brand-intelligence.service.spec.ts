import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { BrandIntelligenceService } from './brand-intelligence.service';

describe('BrandIntelligenceService', () => {
  let service: BrandIntelligenceService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      organization: {
        findUnique: jest.fn().mockResolvedValue({ id: 'org-test', name: 'Test Org' }),
        findFirst: jest.fn().mockResolvedValue({ id: 'org-test', name: 'Test Org' }),
      },
      organizationMember: {
        findFirst: jest.fn().mockResolvedValue({ organizationId: 'org-test' }),
      },
      project: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'proj-1',
          name: 'Stripe Inc.',
          primaryDomain: 'stripe.com',
          description: 'Global financial infrastructure provider',
          industry: 'Financial Technology',
          businessSize: 'ENTERPRISE',
          status: 'ACTIVE',
          websites: [{ domain: 'stripe.com', url: 'https://stripe.com' }],
          knowledgeGraphs: [
            {
              id: 'graph-1',
              products: [{ id: 'prod-1', name: 'Payments', description: 'Payment processing', price: '2.9%' }],
              services: [{ id: 'serv-1', name: 'Billing', description: 'Subscription billing' }],
              entities: [{ id: 'ent-1', name: 'Stripe Inc.', type: 'COMPANY', confidenceScore: 100, verificationState: 'VERIFIED' }],
              facts: [],
            },
          ],
        }),
      },
      aISearchProject: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'ai-proj-1',
          prompts: [
            {
              id: 'prompt-1',
              promptText: 'What is Stripe and how does it work?',
              tags: { category: 'Commercial', priority: 'P0' },
              executions: [
                {
                  id: 'exec-1',
                  providerCode: 'OPENAI',
                  modelCode: 'gpt-4o',
                  createdAt: new Date('2026-08-20T10:00:00Z'),
                  responses: [
                    {
                      structuredJson: {
                        brandMentioned: true,
                        mentionCount: 2,
                        position: 1,
                        sentiment: 'positive',
                        confidence: 0.95,
                        provenance: 'LIVE',
                        isLive: true,
                        citedDomains: ['stripe.com', 'techcrunch.com'],
                      },
                    },
                  ],
                  results: [
                    {
                      answerText: 'Stripe is an enterprise payment processing platform enabling businesses to accept online transactions.',
                      visibilityScore: 95,
                      citations: ['stripe.com'],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      },
      aIVisibilityProfile: {
        findFirst: jest.fn().mockResolvedValue({
          overallScore: 82.5,
          snapshots: [{ createdAt: new Date('2026-08-20T10:00:00Z') }],
        }),
      },
      competitor: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'comp-1',
            name: 'Adyen',
            domain: 'adyen.com',
            visibilities: [{ visibilityScore: 78.0 }],
          },
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandIntelligenceService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<BrandIntelligenceService>(BrandIntelligenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should assemble comprehensive brand intelligence with real profile, understanding, and gaps', async () => {
    const result = await service.getBrandIntelligence('org-test', 'user-1', 'proj-1');

    expect(result).toBeDefined();
    // Profile assertions
    expect(result.profile.brandName).toBe('Stripe Inc.');
    expect(result.profile.domain).toBe('stripe.com');
    expect(result.profile.industry).toBe('Financial Technology');
    expect(result.profile.products).toHaveLength(1);
    expect(result.profile.products[0].name).toBe('Payments');
    expect(result.profile.services).toHaveLength(1);
    expect(result.profile.entities).toHaveLength(1);

    // Understanding assertions
    expect(result.understanding.totalAnswersAnalyzed).toBe(1);
    expect(result.understanding.totalMentions).toBe(2);
    expect(result.understanding.mentionRate).toBe(100);
    expect(result.understanding.answerExcerpts).toHaveLength(1);
    expect(result.understanding.answerExcerpts[0].brandMentioned).toBe(true);
    expect(result.understanding.answerExcerpts[0].sentiment).toBe('positive');

    // Accuracy assertions
    expect(result.accuracy.accuracyScore).toBeGreaterThan(0);
    expect(result.accuracy.totalAuditedPrompts).toBe(1);

    // Presence assertions
    expect(result.presence.visibilityScore).toBe(82.5);
    expect(result.presence.providerBreakdown).toHaveLength(4);

    // Competitive gaps assertions
    expect(result.competitiveGaps).toBeDefined();
    expect(result.competitiveGaps[0].competitorName).toBe('Adyen');
  });

  it('should handle empty projects gracefully without fabricated data', async () => {
    prismaMock.project.findFirst.mockResolvedValueOnce({
      id: 'proj-empty',
      name: 'Empty Brand',
      primaryDomain: 'empty.com',
      description: null,
      industry: 'Unknown',
      businessSize: null,
      status: 'ACTIVE',
      websites: [],
      knowledgeGraphs: [],
    });
    prismaMock.aISearchProject.findFirst.mockResolvedValueOnce(null);
    prismaMock.aIVisibilityProfile.findFirst.mockResolvedValueOnce(null);
    prismaMock.competitor.findMany.mockResolvedValueOnce([]);

    const result = await service.getBrandIntelligence('org-test', 'user-1', 'proj-empty');

    expect(result.profile.brandName).toBe('Empty Brand');
    expect(result.profile.products).toEqual([]);
    expect(result.profile.services).toEqual([]);
    expect(result.understanding.totalAnswersAnalyzed).toBe(0);
    expect(result.understanding.totalMentions).toBe(0);
    expect(result.understanding.answerExcerpts).toEqual([]);
    expect(result.competitiveGaps).toEqual([]);
  });
});
