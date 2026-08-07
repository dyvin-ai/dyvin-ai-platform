import { DependencyEngineService } from './dependency-engine.service';
import { RecommendationType } from '@prisma/client';

describe('DependencyEngineService', () => {
  let service: DependencyEngineService;

  beforeEach(() => {
    service = new DependencyEngineService();
  });

  it('should build dependency tree connecting sub-schema nodes to Organization schema', () => {
    const nodes = [
      { id: '1', category: RecommendationType.SCHEMA, title: 'Add Organization Schema' },
      { id: '2', category: RecommendationType.SCHEMA, title: 'Add Product Schema' },
    ];

    const dependencies = service.buildDependencies(nodes);
    expect(dependencies).toHaveLength(1);
    expect(dependencies[0].recommendationId).toBe('2');
    expect(dependencies[0].dependsOnId).toBe('1');
  });
});
