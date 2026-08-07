import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './database/prisma.module';
import { ApiGatewayModule } from './gateway/api-gateway.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logging/logger.module';
import { AIModule } from './modules/ai/ai.module';
import { AISearchModule } from './modules/ai-search/ai-search.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { CitationModule } from './modules/citation/citation.module';
import { CompetitorModule } from './modules/competitor/competitor.module';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { FeatureFlagModule } from './modules/feature-flag/feature-flag.module';
import { GenerationModule } from './modules/generation/generation.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ObservabilityModule } from './modules/observability/observability.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ProjectModule } from './modules/project/project.module';
import { ReasoningModule } from './modules/reasoning/reasoning.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { ReportModule } from './modules/report/report.module';
import { RetrievalIntelligenceModule } from './modules/retrieval-intelligence/retrieval-intelligence.module';
import { ScanModule } from './modules/scan/scan.module';
import { SearchModule } from './modules/search/search.module';
import { UserModule } from './modules/user/user.module';
import { VerificationModule } from './modules/verification/verification.module';
import { VisibilityAnalyticsModule } from './modules/visibility-analytics/visibility-analytics.module';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from './redis/redis.module';

import { KeywordIntelligenceModule } from './modules/keyword-intelligence/keyword-intelligence.module';
import { StrategyIntelligenceModule } from './modules/strategy-intelligence/strategy-intelligence.module';
import { ActionEngineModule } from './modules/action-engine/action-engine.module';
import { ResearchIntelligenceModule } from './modules/research-intelligence/research-intelligence.module';
import { IntegrationHubModule } from './modules/integration-hub/integration-hub.module';
import { DeveloperPlatformModule } from './modules/developer-platform/developer-platform.module';
import { WorkflowStudioModule } from './modules/workflow-studio/workflow-studio.module';
import { AdminPlatformModule } from './modules/admin-platform/admin-platform.module';
import { PlatformSecurityModule } from './modules/platform-security/platform-security.module';
import { AgentMarketplaceModule } from './modules/agent-marketplace/agent-marketplace.module';
import { DomainEventsModule } from './core/events/events.module';
import { IntelligenceModule } from './modules/intelligence/intelligence.module';
import { VectorIntelligenceModule } from './modules/vector-intelligence/vector-intelligence.module';
import { BusinessIntelligenceModule } from './modules/business-intelligence/business-intelligence.module';
import { CustomerSuccessModule } from './modules/customer-success/customer-success.module';
import { GlobalIntelligenceModule } from './modules/global-intelligence/global-intelligence.module';
import { IndustryCloudModule } from './modules/industry-cloud/industry-cloud.module';
import { EcosystemModule } from './modules/ecosystem/ecosystem.module';
import { AIOperatingSystemModule } from './modules/ai-operating-system/ai-operating-system.module';
import { CustomerIntelligenceModule } from './modules/customer-intelligence/customer-intelligence.module';
import { GlobalIntelligenceLayerModule } from './modules/global-intelligence-layer/global-intelligence-layer.module';
import { AIEvolutionModule } from './modules/ai-evolution/ai-evolution.module';
import { InnovationLabModule } from './modules/innovation-lab/innovation-lab.module';
import { AiWorkforceModule } from './modules/ai-workforce/ai-workforce.module';
import { AiSearchIntelligenceModule } from './modules/ai-search-intelligence/ai-search-intelligence.module';
import { BusinessExecutionModule } from './modules/business-execution/business-execution.module';
import { AiGovernanceModule } from './modules/ai-governance/ai-governance.module';
import { AppPlatformModule } from './modules/app-platform/app-platform.module';
import { PlatformValidationModule } from './modules/platform-validation/platform-validation.module';
import { RuntimeSecurityModule } from './modules/runtime-security/runtime-security.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    PrismaModule,
    RedisModule,
    QueueModule,
    HealthModule,
    ApiGatewayModule,
    AuditModule,
    AuthModule,
    UserModule,
    OrganizationModule,
    ProjectModule,
    CrawlerModule,
    ScanModule,
    KnowledgeModule,
    AIModule,
    ReasoningModule,
    RecommendationModule,
    VerificationModule,
    MonitoringModule,
    GenerationModule,
    BillingModule,
    ReportModule,
    NotificationModule,
    FeatureFlagModule,
    SearchModule,
    ObservabilityModule,
    AISearchModule,
    CitationModule,
    CompetitorModule,
    VisibilityAnalyticsModule,
    RetrievalIntelligenceModule,
    KeywordIntelligenceModule,
    StrategyIntelligenceModule,
    ActionEngineModule,
    ResearchIntelligenceModule,
    IntegrationHubModule,
    DeveloperPlatformModule,
    WorkflowStudioModule,
    AdminPlatformModule,
    PlatformSecurityModule,
    AgentMarketplaceModule,
    DomainEventsModule,
    IntelligenceModule,
    VectorIntelligenceModule,
    BusinessIntelligenceModule,
    CustomerSuccessModule,
    GlobalIntelligenceModule,
    IndustryCloudModule,
    EcosystemModule,
    AIOperatingSystemModule,
    CustomerIntelligenceModule,
    GlobalIntelligenceLayerModule,
    AIEvolutionModule,
    InnovationLabModule,
    AiWorkforceModule,
    AiSearchIntelligenceModule,
    BusinessExecutionModule,
    AiGovernanceModule,
    AppPlatformModule,
    PlatformValidationModule,
    RuntimeSecurityModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
