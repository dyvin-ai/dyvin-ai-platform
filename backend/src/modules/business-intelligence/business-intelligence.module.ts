import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { BusinessIntelligenceController } from './business-intelligence.controller';
import { ExecutiveDashboardService } from './services/executive-dashboard.service';
import { RevenueIntelligenceService } from './services/revenue-intelligence.service';
import { AIEconomicsService } from './services/ai-economics.service';
import { KPIEngineService } from './services/kpi-engine.service';
import { ForecastEngineService } from './services/forecast-engine.service';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessIntelligenceController],
  providers: [
    ExecutiveDashboardService,
    RevenueIntelligenceService,
    AIEconomicsService,
    KPIEngineService,
    ForecastEngineService,
  ],
  exports: [
    ExecutiveDashboardService,
    RevenueIntelligenceService,
    AIEconomicsService,
    KPIEngineService,
    ForecastEngineService,
  ],
})
export class BusinessIntelligenceModule {}
