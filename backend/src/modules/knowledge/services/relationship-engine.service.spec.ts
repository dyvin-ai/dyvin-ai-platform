import { Test, TestingModule } from '@nestjs/testing';
import { RelationType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { RelationshipEngineService } from './relationship-engine.service';

describe('RelationshipEngineService', () => {
  let service: RelationshipEngineService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipEngineService,
        {
          provide: PrismaService,
          useValue: {
            relationship: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RelationshipEngineService>(RelationshipEngineService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should build relationship between two entities', async () => {
    jest.spyOn(prisma.relationship, 'create').mockResolvedValue({
      id: 'rel-1',
      graphId: 'graph-1',
      sourceEntityId: 'ent-1',
      targetEntityId: 'ent-2',
      relationType: RelationType.PRODUCES,
    } as any);

    const rel = await service.buildRelationship({
      graphId: 'graph-1',
      sourceEntityId: 'ent-1',
      targetEntityId: 'ent-2',
      relationType: RelationType.PRODUCES,
    });

    expect(rel.id).toBe('rel-1');
  });
});
