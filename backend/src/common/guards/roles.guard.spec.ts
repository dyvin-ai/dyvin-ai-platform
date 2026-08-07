import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            organizationMember: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should allow access when no roles are required', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should allow access when user role meets or exceeds required role', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    jest.spyOn(prismaService.organizationMember, 'findUnique').mockResolvedValue({
      id: 'mem-1',
      organizationId: 'org-1',
      userId: 'user-1',
      role: Role.OWNER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockRequest = {
      user: { id: 'user-1' },
      headers: { 'x-organization-id': 'org-1' },
      query: {},
      params: {},
    };

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when user role is insufficient', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    jest.spyOn(prismaService.organizationMember, 'findUnique').mockResolvedValue({
      id: 'mem-1',
      organizationId: 'org-1',
      userId: 'user-1',
      role: Role.MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockRequest = {
      user: { id: 'user-1' },
      headers: { 'x-organization-id': 'org-1' },
      query: {},
      params: {},
    };

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
