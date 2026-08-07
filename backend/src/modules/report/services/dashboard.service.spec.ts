import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'p-1',
                name: 'Dyvin AI Verified Business',
                analyses: [{ overallScore: 78, scores: [] }],
                verifications: [],
                generatedContents: [],
              }),
            },
            dashboardWidget: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should return executive dashboard score cards', async () => {
    const dashboard = await service.getExecutiveDashboard('p-1', 'u-1');
    expect(dashboard.overallScore).toBe(78);
    expect(dashboard.scoreCards.length).toBe(5);
  });

  it('should return default chart widgets when no custom widgets exist', async () => {
    const widgets = await service.getDashboardWidgets('p-1');
    expect(widgets.length).toBe(3);
  });
});
