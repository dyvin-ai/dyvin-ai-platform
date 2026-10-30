import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module";
import { AuditModule } from "../audit/audit.module";
import { NotificationModule } from "../notification/notification.module";
import { VisibilityAnalyticsModule } from "../visibility-analytics/visibility-analytics.module";
import { CompetitorModule } from "../competitor/competitor.module";
import { CitationModule } from "../citation/citation.module";
import { AISearchModule } from "../ai-search/ai-search.module";
import { StrategyIntelligenceModule } from "../strategy-intelligence/strategy-intelligence.module";
import { AgentsController } from "./agents.controller";
import { AgentRunnerService } from "./services/agent-runner.service";

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    NotificationModule,
    VisibilityAnalyticsModule,
    CompetitorModule,
    CitationModule,
    AISearchModule,
    StrategyIntelligenceModule,
  ],
  controllers: [AgentsController],
  providers: [AgentRunnerService],
  exports: [AgentRunnerService],
})
export class AgentIntelligenceModule {}
