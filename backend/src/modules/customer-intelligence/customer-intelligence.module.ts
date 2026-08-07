import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { CustomerIntelligenceController } from './customer-intelligence.controller';
import { CustomerWarehouseService } from './services/customer-warehouse.service';
import { CustomerTimelineService } from './services/customer-timeline.service';
import { CustomerMemoryService } from './services/customer-memory.service';
import { CustomerKnowledgeGraphService } from './services/customer-knowledge-graph.service';
import { PrivacyIsolationService } from './services/privacy-isolation.service';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerIntelligenceController],
  providers: [
    CustomerWarehouseService,
    CustomerTimelineService,
    CustomerMemoryService,
    CustomerKnowledgeGraphService,
    PrivacyIsolationService,
  ],
  exports: [
    CustomerWarehouseService,
    CustomerTimelineService,
    CustomerMemoryService,
    CustomerKnowledgeGraphService,
    PrivacyIsolationService,
  ],
})
export class CustomerIntelligenceModule {}
