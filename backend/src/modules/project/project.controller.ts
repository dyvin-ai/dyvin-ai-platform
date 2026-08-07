import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateProjectSettingsDto } from './dto/update-project-settings.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectSettingsService } from './project-settings.service';
import { ProjectService } from './project.service';
import { WebsiteService } from './website.service';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly websiteService: WebsiteService,
    private readonly projectSettingsService: ProjectSettingsService,
  ) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Create Project',
    description:
      'Creates a new business project, primary website domain, and default settings.',
  })
  @ApiResponse({ status: 201, description: 'Project created.' })
  async createProject(
    @CurrentOrganization() orgId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProjectDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.projectService.createProject(orgId, userId, dto, ipAddress, userAgent);
  }

  @Get()
  @ApiOperation({
    summary: 'List Projects',
    description: 'Lists all active non-deleted projects for current organization.',
  })
  @ApiResponse({ status: 200, description: 'List of organization projects.' })
  async getProjects(@CurrentOrganization() orgId: string) {
    return this.projectService.getOrganizationProjects(orgId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Project Details',
    description: 'Retrieves project details, websites, members, settings, and tags.',
  })
  @ApiResponse({ status: 200, description: 'Project details.' })
  async getProject(
    @Param('id') projectId: string,
    @CurrentOrganization() orgId: string,
  ) {
    return this.projectService.getProjectById(projectId, orgId);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Update Project',
    description: 'Updates project attributes.',
  })
  @ApiResponse({ status: 200, description: 'Project updated.' })
  async updateProject(
    @Param('id') projectId: string,
    @CurrentOrganization() orgId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.projectService.updateProject(
      projectId,
      orgId,
      userId,
      dto,
      ipAddress,
      userAgent,
    );
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Delete Project',
    description: 'Soft-deletes project and associated resources.',
  })
  @ApiResponse({ status: 200, description: 'Project deleted.' })
  async deleteProject(
    @Param('id') projectId: string,
    @CurrentOrganization() orgId: string,
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.projectService.deleteProject(
      projectId,
      orgId,
      userId,
      ipAddress,
      userAgent,
    );
  }

  @Post(':id/websites')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Add Website to Project',
    description: 'Attaches a new website URL/subdomain to project.',
  })
  @ApiResponse({ status: 201, description: 'Website added.' })
  async addWebsite(
    @Param('id') projectId: string,
    @CurrentOrganization() orgId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateWebsiteDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.websiteService.addWebsite(
      projectId,
      dto,
      userId,
      orgId,
      ipAddress,
      userAgent,
    );
  }

  @Get(':id/websites')
  @ApiOperation({
    summary: 'List Project Websites',
    description: 'Lists all websites attached to specified project.',
  })
  @ApiResponse({ status: 200, description: 'List of project websites.' })
  async getWebsites(@Param('id') projectId: string) {
    return this.websiteService.getProjectWebsites(projectId);
  }

  @Get(':id/settings')
  @ApiOperation({
    summary: 'Get Project Settings',
    description: 'Retrieves scan frequency, AI providers, and report preferences.',
  })
  @ApiResponse({ status: 200, description: 'Project settings.' })
  async getSettings(@Param('id') projectId: string) {
    return this.projectSettingsService.getSettings(projectId);
  }

  @Patch(':id/settings')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Update Project Settings',
    description: 'Updates scan frequency, notification settings, and AI provider options.',
  })
  @ApiResponse({ status: 200, description: 'Project settings updated.' })
  async updateSettings(
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectSettingsDto,
  ) {
    return this.projectSettingsService.updateSettings(projectId, dto);
  }
}
