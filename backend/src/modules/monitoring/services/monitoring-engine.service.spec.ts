import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { AutomationEngineService } from './automation-engine.service';
import { ChangeDetectorService } from './change-detector.service';
import { MonitoringEngineService } from './monitoring-engine.service';
import { MonitoringSchedulerService } from './monitoring-scheduler.service';
import { SnapshotEngineService } from './snapshot-engine.service';
import { MONITORING_QUEUES } from '../monitoring.constants';

describe('MonitoringEngineService', () => {
  let service: MonitoringEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoringEngineService,
        SnapshotEngineService,
        ChangeDetectorService,
        {
          provide: MonitoringSchedulerService,
          useValue: { createOrUpdateSchedule: jest.fn(), stopSchedule: jest.fn() },
        },
        {
          provide: AutomationEngineService,
          useValue: { triggerAutomatedPipeline: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: PrismaService,
          useValue: {
            project: { findUnique: jest.fn() },
            monitoringJob: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
            monitoringRun: { create: jest.fn(), update: jest.fn(), findMany: jest.fn() },
            scan: { findFirst: jest.fn() },
            websiteChange: { create: jest.fn(), findMany: jest.fn() },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: getQueueToken(MONITORING_QUEUES.ENGINE),
          useValue: { add: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<MonitoringEngineService>(MonitoringEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
