import { Injectable, Logger } from '@nestjs/common';
import { AuthorityLevel, CitationSourceType } from '@prisma/client';

@Injectable()
export class CitationAuthorityService {
  private readonly logger = new Logger(CitationAuthorityService.name);

  calculateAuthority(domain: string, sourceType: CitationSourceType): { authorityScore: number; trustScore: number; authorityLevel: AuthorityLevel } {
    let baseScore = 50;

    switch (sourceType) {
      case CitationSourceType.GOVERNMENT:
      case CitationSourceType.ACADEMIC:
        baseScore = 95;
        break;
      case CitationSourceType.NEWS:
      case CitationSourceType.DOCUMENTATION:
        baseScore = 85;
        break;
      case CitationSourceType.OWNED:
        baseScore = 80;
        break;
      case CitationSourceType.THIRD_PARTY:
      case CitationSourceType.EARNED:
        baseScore = 70;
        break;
      case CitationSourceType.SOCIAL:
      case CitationSourceType.FORUM:
        baseScore = 45;
        break;
      default:
        baseScore = 50;
    }

    const authorityScore = Math.min(100, Math.max(10, baseScore));
    const trustScore = Math.min(100, Math.max(10, baseScore - 5));

    let authorityLevel: AuthorityLevel = AuthorityLevel.MEDIUM;
    if (authorityScore >= 85) authorityLevel = AuthorityLevel.AUTHORITATIVE;
    else if (authorityScore >= 70) authorityLevel = AuthorityLevel.HIGH;
    else if (authorityScore >= 50) authorityLevel = AuthorityLevel.MEDIUM;
    else authorityLevel = AuthorityLevel.LOW;

    return { authorityScore, trustScore, authorityLevel };
  }
}
