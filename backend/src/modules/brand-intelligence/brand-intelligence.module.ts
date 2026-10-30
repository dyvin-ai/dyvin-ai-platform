import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { BrandIntelligenceController } from './brand-intelligence.controller';
import { BrandIntelligenceService } from './brand-intelligence.service';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [BrandIntelligenceController],
  providers: [BrandIntelligenceService],
  exports: [BrandIntelligenceService],
})
export class BrandIntelligenceModule {}
