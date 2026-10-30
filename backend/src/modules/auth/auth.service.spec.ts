import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            organization: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            organizationMember: {
              create: jest.fn(),
            },
            emailVerificationToken: {
              create: jest.fn(),
            },
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
            subscriptionPlan: {
              findUnique: jest.fn().mockResolvedValue({ id: 'p-free' }),
            },
            organizationSubscription: {
              create: jest.fn().mockResolvedValue({ id: 'sub-free' }),
            },
            usageQuota: {
              upsert: jest.fn().mockResolvedValue({ id: 'quota-1' }),
            },
            $transaction: jest.fn((cb) => cb(prisma)),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('jwt-access-token'),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
            sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException if registering existing email', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'usr-1',
      email: 'alex@company.com',
    } as any);

    await expect(
      service.register({
        email: 'alex@company.com',
        password: 'Password123!',
        firstName: 'Alex',
        lastName: 'Morgan',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw UnauthorizedException on invalid login credentials', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(
      service.login({
        email: 'alex@company.com',
        password: 'WrongPassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
