import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { KeywordImportService } from './services/keyword-import.service';
import { KeywordClusterService } from './services/keyword-cluster.service';
import { KeywordOpportunityService } from './services/keyword-opportunity.service';
import { PromptGeneratorService } from './services/prompt-generator.service';
import { KeywordCampaignService } from './services/keyword-campaign.service';
import { KeywordQueue } from './queues/keyword.queue';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Keyword Intelligence & AI Campaigns')
@Controller('api/v1')
export class KeywordIntelligenceController {
  constructor(
    private readonly importService: KeywordImportService,
    private readonly clusterService: KeywordClusterService,
    private readonly opportunityService: KeywordOpportunityService,
    private readonly promptService: PromptGeneratorService,
    private readonly campaignService: KeywordCampaignService,
    private readonly keywordQueue: KeywordQueue,
    private readonly prisma: PrismaService,
  ) {}

  @Post('keywords/import')
  @ApiOperation({ summary: 'Import keywords from CSV/TSV content' })
  async importKeywords(@Body() body: { organizationId: string; filename: string; csvContent: string }) {
    await this.keywordQueue.addImportJob(body);
    return this.importService.importKeywords(body);
  }

  @Get('keywords')
  @ApiOperation({ summary: 'List keywords' })
  async getKeywords(@Query('organizationId') organizationId?: string) {
    return this.prisma.keyword.findMany({
      where: organizationId ? { organizationId } : undefined,
      take: 50,
    });
  }

  @Get('keywords/clusters')
  @ApiOperation({ summary: 'Get keyword clusters' })
  async getClusters() {
    return this.clusterService.getClusters();
  }

  @Get('keywords/opportunities')
  @ApiOperation({ summary: 'Get keyword opportunities' })
  async getOpportunities(@Query('organizationId') organizationId?: string) {
    return this.opportunityService.getOpportunities(organizationId);
  }

  @Get('keywords/trends')
  @ApiOperation({ summary: 'Get keyword trends' })
  async getTrends() {
    return this.opportunityService.getTrends();
  }

  @Get('keywords/search-volume')
  @ApiOperation({ summary: 'Get keyword search volume' })
  async getSearchVolume(@Query('keyword') keyword?: string) {
    return this.opportunityService.getSearchVolume(keyword);
  }

  @Get('keywords/:id')
  @ApiOperation({ summary: 'Get keyword by ID' })
  async getKeywordById(@Param('id') id: string) {
    return this.prisma.keyword.findUnique({ where: { id } });
  }

  @Patch('keywords/:id')
  @ApiOperation({ summary: 'Update keyword status or intent' })
  async updateKeyword(@Param('id') id: string, @Body() body: any) {
    return this.prisma.keyword.update({
      where: { id },
      data: body,
    });
  }

  @Delete('keywords/:id')
  @ApiOperation({ summary: 'Delete keyword' })
  async deleteKeyword(@Param('id') id: string) {
    return this.prisma.keyword.delete({ where: { id } });
  }

  @Post('campaigns')
  @ApiOperation({ summary: 'Create keyword campaign' })
  async createCampaign(@Body() body: any) {
    return this.campaignService.createCampaign(body);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'List campaigns' })
  async getCampaigns(@Query('organizationId') organizationId?: string) {
    return this.campaignService.getCampaigns(organizationId);
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  async getCampaignById(@Param('id') id: string) {
    return this.campaignService.getCampaignById(id);
  }

  @Post('campaigns/:id/run')
  @ApiOperation({ summary: 'Run campaign manually' })
  async runCampaign(@Param('id') id: string) {
    await this.keywordQueue.addCampaignJob({ campaignId: id });
    return this.campaignService.runCampaign(id);
  }

  @Get('campaigns/:id/results')
  @ApiOperation({ summary: 'Get campaign results' })
  async getCampaignResults(@Param('id') id: string) {
    return this.campaignService.getCampaignResults(id);
  }

  @Get('prompt-library')
  @ApiOperation({ summary: 'Get prompt library' })
  async getPromptLibrary() {
    return this.promptService.getPromptLibrary();
  }

  @Post('prompt-library/generate')
  @ApiOperation({ summary: 'Generate prompt for keyword' })
  async generatePrompt(@Body() body: any) {
    return this.promptService.generatePrompts(body);
  }

  @Get('prompt-library/templates')
  @ApiOperation({ summary: 'Get prompt templates' })
  async getTemplates() {
    return this.promptService.getTemplates();
  }
}
