import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { IndustryCloudController } from './industry-cloud.controller';
import { IndustryIntelligenceService } from './services/industry-intelligence.service';
import { IndustryBenchmarkService } from './services/industry-benchmark.service';
import { GlobalLeaderboardService } from './services/global-leaderboard.service';
import { ResearchPublicationService } from './services/research-publication.service';
import { GlobalAuthorityService } from './services/global-authority.service';

@Module({
  imports: [PrismaModule],
  controllers: [IndustryCloudController],
  providers: [
    IndustryIntelligenceService,
    IndustryBenchmarkService,
    GlobalLeaderboardService,
    ResearchPublicationService,
    GlobalAuthorityService,
  ],
  exports: [
    IndustryIntelligenceService,
    IndustryBenchmarkService,
    GlobalLeaderboardService,
    ResearchPublicationService,
    GlobalAuthorityService,
  ],
})
export class IndustryCloudModule {}
