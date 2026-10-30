import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgencyService } from './services/agency.service';
import { PartnerService } from './services/partner.service';
import { ReferralService } from './services/referral.service';
import { AcademyService } from './services/academy.service';
import { CommunityService } from './services/community.service';

@ApiTags('Enterprise Partner Ecosystem & Academy')
@Controller()
export class EcosystemController {
  constructor(
    private readonly agencyService: AgencyService,
    private readonly partnerService: PartnerService,
    private readonly referralService: ReferralService,
    private readonly academyService: AcademyService,
    private readonly communityService: CommunityService,
  ) {}

  @Get('agencies')
  @ApiOperation({ summary: 'List certified agencies' })
  async getAgencies() {
    return this.agencyService.getAgencies();
  }

  @Post('agencies')
  @ApiOperation({ summary: 'Register certified agency profile' })
  async registerAgency(@Body() body: { agencyName: string; tier?: string }) {
    return this.agencyService.registerAgency(body.agencyName, body.tier);
  }

  @Get('partners')
  @ApiOperation({ summary: 'List technology & consulting partners' })
  async getPartners() {
    return this.partnerService.getPartners();
  }

  @Post('partners')
  @ApiOperation({ summary: 'Register partner program profile' })
  async registerPartner(@Body() body: { companyName: string; partnerType?: string }) {
    return this.partnerService.registerPartner(body.companyName, body.partnerType);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'List referral rewards and commissions' })
  async getReferrals() {
    return this.referralService.getReferrals();
  }

  @Post('referrals')
  @ApiOperation({ summary: 'Create new referral code link' })
  async createReferral(@Body() body: { referrerId: string; refCode: string }) {
    return this.referralService.createReferral(body.referrerId, body.refCode);
  }

  @Get('academy')
  @ApiOperation({ summary: 'Get Dyvin Learning Academy courses' })
  async getAcademy() {
    return this.academyService.getCourses();
  }

  @Get('certifications')
  @ApiOperation({ summary: 'Get professional certifications and exams' })
  async getCertifications() {
    return [
      { name: 'Certified Dyvin AI GEO Specialist (CDGS)', examStatus: 'AVAILABLE' },
      { name: 'Certified Dyvin AI Platform Architect (CDPA)', examStatus: 'AVAILABLE' },
    ];
  }

  @Get('community')
  @ApiOperation({ summary: 'Get community forum discussions' })
  async getCommunity() {
    return this.communityService.getPosts();
  }

  @Get('events')
  @ApiOperation({ summary: 'Get upcoming virtual webinars and workshops' })
  async getEvents() {
    return this.communityService.getEvents();
  }

  @Get('partner-marketplace')
  @ApiOperation({ summary: 'Browse partner marketplace listings' })
  async getMarketplace() {
    return [
      { title: 'Enterprise GEO Implementation Package', agency: 'Acme Digital Agency', rating: 5.0 },
    ];
  }

  @Get('ecosystem/dashboard')
  @ApiOperation({ summary: 'Get partner ecosystem executive dashboard' })
  async getDashboard() {
    return {
      activeAgencies: 120,
      activePartners: 45,
      totalReferralPayoutsUsd: 145000,
      certifiedSpecialists: 850,
      ecosystemStatus: 'FULLY_OPERATIONAL',
    };
  }
}
