import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { EcosystemController } from './ecosystem.controller';
import { AgencyService } from './services/agency.service';
import { PartnerService } from './services/partner.service';
import { ReferralService } from './services/referral.service';
import { AcademyService } from './services/academy.service';
import { CommunityService } from './services/community.service';

@Module({
  imports: [PrismaModule],
  controllers: [EcosystemController],
  providers: [
    AgencyService,
    PartnerService,
    ReferralService,
    AcademyService,
    CommunityService,
  ],
  exports: [
    AgencyService,
    PartnerService,
    ReferralService,
    AcademyService,
    CommunityService,
  ],
})
export class EcosystemModule {}
