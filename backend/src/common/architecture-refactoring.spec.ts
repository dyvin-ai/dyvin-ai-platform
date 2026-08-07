import { Test, TestingModule } from '@nestjs/testing';
import { BaseRepository } from './repositories/base.repository';
import { PrismaService } from '../database/prisma.service';

class MockTestRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'organization');
  }
}

describe('Enterprise Architecture Refactoring Spec', () => {
  let repository: MockTestRepository;

  const mockPrismaService = {
    organization: {
      findUnique: jest.fn().mockResolvedValue({ id: 'org-1', name: 'Dyvin Corp' }),
      findMany: jest.fn().mockResolvedValue([{ id: 'org-1', name: 'Dyvin Corp' }]),
      count: jest.fn().mockResolvedValue(1),
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'org-2', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      delete: jest.fn().mockResolvedValue({ id: 'org-1' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: mockPrismaService },
        {
          provide: MockTestRepository,
          useFactory: (prisma: PrismaService) => new MockTestRepository(prisma),
          inject: [PrismaService],
        },
      ],
    }).compile();

    repository = module.get<MockTestRepository>(MockTestRepository);
  });

  it('BaseRepository abstraction handles findById correctly', async () => {
    const org = await repository.findById('org-1');
    expect(org).toBeDefined();
    expect(org.id).toBe('org-1');
  });

  it('BaseRepository abstraction handles paginated queries cleanly', async () => {
    const paginated = await repository.findPaginated({}, 1, 10);
    expect(paginated.data.length).toBe(1);
    expect(paginated.total).toBe(1);
    expect(paginated.page).toBe(1);
  });

  it('BaseRepository abstraction handles create mutations cleanly', async () => {
    const created = await repository.create({ name: 'New Tenant' });
    expect(created).toBeDefined();
    expect(created.name).toBe('New Tenant');
  });
});
