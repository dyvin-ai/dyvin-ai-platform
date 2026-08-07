import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { GlobalIntelligenceController } from './global-intelligence.controller';
import { UnifiedWarehouseService } from './services/unified-warehouse.service';
import { GlobalCitationService } from './services/global-citation.service';
import { GlobalDomainService } from './services/global-domain.service';
import { CrossModelService } from './services/cross-model.service';

@Module({
  imports: [PrismaModule],
  controllers: [GlobalIntelligenceController],
  providers: [
    UnifiedWarehouseService,
    GlobalCitationService,
    GlobalDomainService,
    CrossModelService,
  ],
  exports: [
    UnifiedWarehouseService,
    GlobalCitationService,
    GlobalDomainService,
    CrossModelService,
  ],
})
export class GlobalIntelligenceModule {}
