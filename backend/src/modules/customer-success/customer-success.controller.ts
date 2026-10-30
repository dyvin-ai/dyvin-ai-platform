import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerHealthService } from './services/customer-health.service';
import { CustomerJourneyService } from './services/customer-journey.service';
import { ProductAdoptionService } from './services/product-adoption.service';
import { ChurnPredictionService } from './services/churn-prediction.service';
import { CustomerSuccessAssistantService } from './services/customer-success-assistant.service';

@ApiTags('Enterprise Customer Success Platform')
@Controller('customer-success')
export class CustomerSuccessController {
  constructor(
    private readonly healthService: CustomerHealthService,
    private readonly journeyService: CustomerJourneyService,
    private readonly adoptionService: ProductAdoptionService,
    private readonly churnService: ChurnPredictionService,
    private readonly assistantService: CustomerSuccessAssistantService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Customer Success operational dashboard' })
  async getDashboard(@Query('organizationId') orgId?: string) {
    const health = await this.healthService.calculateHealthScore(orgId || 'org-100');
    return {
      organizationId: orgId || 'org-100',
      health,
      stage: 'EXPANSION',
      accountManager: 'Customer Success Team Lead',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Get calculated 0-100 customer health score' })
  async getHealth(@Query('organizationId') orgId?: string) {
    return this.healthService.calculateHealthScore(orgId || 'org-100');
  }

  @Get('journey')
  @ApiOperation({ summary: 'Get customer milestone journey timeline' })
  async getJourney(@Query('organizationId') orgId?: string) {
    return this.journeyService.getJourneyMilestones(orgId);
  }

  @Get('adoption')
  @ApiOperation({ summary: 'Get product feature adoption metrics' })
  async getAdoption(@Query('organizationId') orgId?: string) {
    return this.adoptionService.getAdoptionMetrics(orgId);
  }

  @Get('churn')
  @ApiOperation({ summary: 'Get churn probability & risk prediction' })
  async getChurn(@Query('organizationId') orgId?: string) {
    return this.churnService.predictChurnRisk(orgId || 'org-100');
  }

  @Get('renewal')
  @ApiOperation({ summary: 'Get upcoming renewal likelihood & timeline' })
  async getRenewal(@Query('organizationId') orgId?: string) {
    return {
      organizationId: orgId || 'org-100',
      renewalLikelihoodPercent: 96.0,
      daysToRenewal: 145,
    };
  }

  @Get('expansion')
  @ApiOperation({ summary: 'Get upsell and expansion opportunities' })
  async getExpansion(@Query('organizationId') orgId?: string) {
    return {
      organizationId: orgId || 'org-100',
      expansionOpportunity: 'ENTERPRISE_SDK_UPGRADE',
      estimatedArrGrowthUsd: 12000,
    };
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get AI Assistant customer success recommendations' })
  async getRecommendations(@Query('organizationId') orgId?: string) {
    return this.assistantService.generateSuccessPlan(orgId || 'org-100', 30);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get automated QBR and customer health reports' })
  async getReports() {
    return {
      latestQBRReport: { title: 'Q3 Executive Customer Success Summary', status: 'AVAILABLE' },
    };
  }

  @Get('academy')
  @ApiOperation({ summary: 'Get Dyvin Academy learning & certification progress' })
  async getAcademy() {
    return {
      coursesCompleted: 4,
      certificationsEarned: ['Dyvin AI Certified Administrator'],
    };
  }

  @Get('referrals')
  @ApiOperation({ summary: 'Get customer advocacy and referral status' })
  async getReferrals() {
    return {
      advocacyTier: 'GOLD_CHAMPION',
      activeReferralsCount: 2,
    };
  }
}
