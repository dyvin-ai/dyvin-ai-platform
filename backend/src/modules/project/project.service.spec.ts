import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            website: {
              create: jest.fn(),
            },
            projectSettings: {
              create: jest.fn(),
            },
            projectMember: {
              create: jest.fn(),
            },
            $transaction: jest.fn((cb) => cb(prisma)),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException if primary domain already registered', async () => {
    jest.spyOn(prisma.project, 'findUnique').mockResolvedValue({
      id: 'existing-proj',
      primaryDomain: 'dyvin.ai',
    } as any);

    await expect(
      service.createProject('org-1', 'usr-1', {
        name: 'Dyvin AI',
        primaryUrl: 'https://dyvin.ai',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
