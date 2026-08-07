import { Injectable } from '@nestjs/common';
import { EntityType } from '@prisma/client';

export interface CalculatedEntityCoverage {
  entityType: EntityType;
  totalExpected: number;
  totalFound: number;
  coveragePercentage: number;
}

@Injectable()
export class EntityCoverageService {
  calculateCoverage(
    foundEntities: Array<{ type: EntityType }>,
  ): CalculatedEntityCoverage[] {
    const counts: Record<EntityType, number> = {
      COMPANY: 0,
      PRODUCT: 0,
      SERVICE: 0,
      PERSON: 0,
      LOCATION: 0,
      CATEGORY: 0,
    };

    foundEntities.forEach((e) => {
      if (counts[e.type] !== undefined) {
        counts[e.type]++;
      }
    });

    const expected: Record<EntityType, number> = {
      COMPANY: 1,
      PRODUCT: 3,
      SERVICE: 3,
      PERSON: 2,
      LOCATION: 1,
      CATEGORY: 2,
    };

    return Object.keys(counts).map((typeKey) => {
      const type = typeKey as EntityType;
      const found = counts[type];
      const exp = expected[type];
      const percentage = Math.min(100, Math.round((found / exp) * 100));

      return {
        entityType: type,
        totalExpected: exp,
        totalFound: found,
        coveragePercentage: percentage,
      };
    });
  }
}
