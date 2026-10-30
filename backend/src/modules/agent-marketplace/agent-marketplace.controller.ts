import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentMarketplaceService, PublishListingInput, InstallListingInput } from './services/agent-marketplace.service';
import { AgentSkillToolService, CreateSkillInput, CreateToolInput } from './services/agent-skill-tool.service';
import { AgentMemoryService, SetMemoryInput } from './services/agent-memory.service';
import { AgentPackageExportService, ExportAgentInput } from './services/agent-package-export.service';
import { AgentMarketplaceQueue } from './queues/agent-marketplace.queue';

@ApiTags('AI Agent Ecosystem, Skills & Marketplace')
@Controller()
export class AgentMarketplaceController {
  constructor(
    private readonly marketplaceService: AgentMarketplaceService,
    private readonly skillToolService: AgentSkillToolService,
    private readonly memoryService: AgentMemoryService,
    private readonly packageService: AgentPackageExportService,
    private readonly marketplaceQueue: AgentMarketplaceQueue,
  ) {}

  // ================= MARKETPLACE =================

  @Get('marketplace')
  @ApiOperation({ summary: 'List marketplace listings' })
  async getMarketplaceListings(@Query('search') search?: string, @Query('category') category?: string) {
    return this.marketplaceService.getListings(search, category);
  }

  @Get('marketplace/categories')
  @ApiOperation({ summary: 'List marketplace categories' })
  async getCategories() {
    return this.marketplaceService.getCategories();
  }

  @Get('marketplace/featured')
  @ApiOperation({ summary: 'List featured AI agents & skills' })
  async getFeatured() {
    return this.marketplaceService.getFeatured();
  }

  @Get('marketplace/trending')
  @ApiOperation({ summary: 'List trending marketplace agents' })
  async getTrending() {
    return this.marketplaceService.getTrending();
  }

  @Get('marketplace/reviews')
  @ApiOperation({ summary: 'Get marketplace reviews' })
  async getReviews(@Query('listingId') listingId?: string) {
    return this.marketplaceService.getReviews(listingId);
  }

  @Get('marketplace/:id')
  @ApiOperation({ summary: 'Get marketplace listing detail by ID' })
  async getListingById(@Param('id') id: string) {
    return this.marketplaceService.getListingById(id);
  }

  @Post('marketplace/publish')
  @ApiOperation({ summary: 'Publish AI Agent/Skill to Dyvin Marketplace' })
  async publishListing(@Body() body: PublishListingInput) {
    await this.marketplaceQueue.addPublishJob(body);
    return this.marketplaceService.publishListing(body);
  }

  @Post('marketplace/install')
  @ApiOperation({ summary: 'Install AI Agent into organization' })
  async installListing(@Body() body: InstallListingInput) {
    await this.marketplaceQueue.addInstallJob(body);
    return this.marketplaceService.installListing(body);
  }

  @Post('marketplace/uninstall')
  @ApiOperation({ summary: 'Uninstall AI Agent' })
  async uninstallListing(@Body('listingId') listingId: string, @Body('organizationId') organizationId: string) {
    return this.marketplaceService.uninstallListing(listingId, organizationId);
  }

  // ================= AGENTS =================

  @Post('agents/export')
  @ApiOperation({ summary: 'Export AI agent configuration package' })
  async exportAgent(@Body() body: ExportAgentInput) {
    await this.marketplaceQueue.addPackageJob(body);
    return this.packageService.exportAgentPackage(body);
  }

  @Post('agents/import')
  @ApiOperation({ summary: 'Import AI agent package' })
  async importAgent(@Body('organizationId') organizationId: string, @Body('packageJson') packageJson: Record<string, any>) {
    return this.packageService.importAgentPackage(organizationId, packageJson);
  }

  @Post('agents/version')
  @ApiOperation({ summary: 'Tag new version release for AI agent' })
  async versionAgent(@Body('agentId') agentId: string, @Body('version') version: string) {
    return this.packageService.versionAgent(agentId, version);
  }

  @Post('agents/rollback')
  @ApiOperation({ summary: 'Rollback AI agent to prior version' })
  async rollbackAgent(@Body('agentId') agentId: string, @Body('targetVersion') targetVersion: string) {
    return this.packageService.rollbackAgent(agentId, targetVersion);
  }

  // ================= SKILLS =================

  @Get('skills')
  @ApiOperation({ summary: 'List reusable AI skills' })
  async getSkills(@Query('organizationId') organizationId?: string) {
    return this.skillToolService.getSkills(organizationId);
  }

  @Post('skills')
  @ApiOperation({ summary: 'Create reusable AI skill' })
  async createSkill(@Body() body: CreateSkillInput) {
    return this.skillToolService.createSkill(body);
  }

  @Patch('skills/:id')
  @ApiOperation({ summary: 'Update AI skill description' })
  async updateSkill(@Param('id') id: string, @Body('description') description: string) {
    return this.skillToolService.updateSkill(id, description);
  }

  @Delete('skills/:id')
  @ApiOperation({ summary: 'Delete AI skill' })
  async deleteSkill(@Param('id') id: string) {
    return this.skillToolService.deleteSkill(id);
  }

  // ================= TOOLS =================

  @Get('tools')
  @ApiOperation({ summary: 'List sandboxed agent tools' })
  async getTools(@Query('organizationId') organizationId?: string) {
    return this.skillToolService.getTools(organizationId);
  }

  @Post('tools')
  @ApiOperation({ summary: 'Register sandboxed REST/GraphQL/Webhook tool' })
  async createTool(@Body() body: CreateToolInput) {
    return this.skillToolService.createTool(body);
  }

  // ================= MEMORY =================

  @Get('memory')
  @ApiOperation({ summary: 'Query agent memory namespace' })
  async getMemory(@Query('namespace') namespace?: string, @Query('organizationId') organizationId?: string) {
    return this.memoryService.getMemory(namespace, organizationId);
  }

  @Post('memory')
  @ApiOperation({ summary: 'Store value in agent memory scope' })
  async setMemory(@Body() body: SetMemoryInput) {
    await this.marketplaceQueue.addMemoryJob(body);
    return this.memoryService.setMemory(body);
  }

  @Get('memory/history')
  @ApiOperation({ summary: 'Get memory change audit history' })
  async getMemoryHistory() {
    return this.memoryService.getMemoryHistory();
  }
}
