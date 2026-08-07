import { Test, TestingModule } from '@nestjs/testing';
import { VerificationMethod } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { VerificationService } from './verification.service';

describe('VerificationService', () => {
  let service: VerificationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        {
          provide: PrismaService,
          useValue: {
            website: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            websiteVerification: {
              create: jest.fn(),
            },
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

    service = module.get<VerificationService>(VerificationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should generate DNS_TXT verification instructions correctly', async () => {
    jest.spyOn(prisma.website, 'findFirst').mockResolvedValue({
      id: 'web-1',
      url: 'https://dyvin.ai',
    } as any);

    jest.spyOn(prisma.websiteVerification, 'create').mockResolvedValue({
      id: 'ver-1',
    } as any);

    const result = await service.initiateVerification(
      'web-1',
      { method: VerificationMethod.DNS_TXT },
      'usr-1',
      'org-1',
    );

    expect(result.method).toBe(VerificationMethod.DNS_TXT);
    expect(result.verificationToken).toContain('dyvin-verify-');
    expect(result.instructions.dnsRecord?.type).toBe('TXT');
    expect(result.instructions.dnsRecord?.value).toContain('dyvin-verification=');
  });
});
