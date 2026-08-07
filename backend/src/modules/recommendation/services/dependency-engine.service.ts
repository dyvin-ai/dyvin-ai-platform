import { Injectable } from '@nestjs/common';
import { RecommendationType } from '@prisma/client';

export interface RecommendationNode {
  id: string;
  category: RecommendationType;
  title: string;
}

@Injectable()
export class DependencyEngineService {
  buildDependencies(nodes: RecommendationNode[]): Array<{ recommendationId: string; dependsOnId: string }> {
    const dependencies: Array<{ recommendationId: string; dependsOnId: string }> = [];

    const orgSchemaNode = nodes.find(
      (n) => n.category === RecommendationType.SCHEMA && n.title.toLowerCase().includes('organization'),
    );

    if (orgSchemaNode) {
      nodes.forEach((n) => {
        if (n.id !== orgSchemaNode.id && n.category === RecommendationType.SCHEMA) {
          dependencies.push({
            recommendationId: n.id,
            dependsOnId: orgSchemaNode.id,
          });
        }
      });
    }

    return dependencies;
  }
}
