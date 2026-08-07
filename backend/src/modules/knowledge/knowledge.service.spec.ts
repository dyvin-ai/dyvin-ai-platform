import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { KnowledgeService } from './knowledge.service';

describe('KnowledgeService', () => {
  let service: KnowledgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnowledgeService,
        {
          provide: PrismaService,
          useValue: {
            knowledgeGraph: {
              findFirst: jest.fn(),
            },
            entity: {
              findMany: jest.fn(),
            },
            relationship: {
              findMany: jest.fn(),
            },
            fact: {
              findMany: jest.fn(),
            },
            product: {
              findMany: jest.fn(),
            },
            service: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<KnowledgeService>(KnowledgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
