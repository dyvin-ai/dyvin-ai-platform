import { Injectable } from '@nestjs/common';

export interface BrandConsistencyResult {
  consistencyScore: number;
  isNameConsistent: boolean;
  isDomainConsistent: boolean;
}

@Injectable()
export class BrandConsistencyService {
  evaluateConsistency(
    projectName: string,
    primaryDomain: string,
    extractedNames: string[],
  ): BrandConsistencyResult {
    let matches = 0;
    const normProject = projectName.toLowerCase().trim();

    extractedNames.forEach((name) => {
      if (name.toLowerCase().includes(normProject) || normProject.includes(name.toLowerCase())) {
        matches++;
      }
    });

    const isNameConsistent = extractedNames.length > 0 ? matches / extractedNames.length >= 0.5 : true;
    const isDomainConsistent = primaryDomain.length > 0;
    const consistencyScore = Math.round((isNameConsistent ? 60 : 20) + (isDomainConsistent ? 40 : 0));

    return {
      consistencyScore,
      isNameConsistent,
      isDomainConsistent,
    };
  }
}
