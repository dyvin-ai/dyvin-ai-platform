import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationService } from './organization.service';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Organization',
    description: 'Creates a new organization workspace and assigns creator as OWNER.',
  })
  @ApiResponse({ status: 201, description: 'Organization created successfully.' })
  async createOrganization(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOrganizationDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.organizationService.createOrganization(userId, dto, ipAddress, userAgent);
  }

  @Get()
  @ApiOperation({
    summary: 'List User Organizations',
    description: 'Lists all active organizations the authenticated user belongs to.',
  })
  @ApiResponse({ status: 200, description: 'List of user organizations.' })
  async getUserOrganizations(@CurrentUser('id') userId: string) {
    return this.organizationService.getUserOrganizations(userId);
  }

  @Post('invitations/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Accept Invitation',
    description: 'Accepts an organization member invitation using a token.',
  })
  @ApiResponse({ status: 200, description: 'Invitation accepted.' })
  async acceptInvitation(
    @CurrentUser('id') userId: string,
    @Body() dto: AcceptInvitationDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.organizationService.acceptInvitation(userId, dto, ipAddress, userAgent);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Organization Details',
    description: 'Retrieves organization profile and full member roster.',
  })
  @ApiResponse({ status: 200, description: 'Organization details.' })
  async getOrganizationDetails(
    @Param('id') orgId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.organizationService.getOrganizationDetails(orgId, userId);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  @ApiOperation({
    summary: 'Update Organization Settings',
    description: 'Updates organization profile settings. Requires OWNER or ADMIN role.',
  })
  @ApiResponse({ status: 200, description: 'Organization updated.' })
  async updateOrganization(
    @Param('id') orgId: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateOrganization(orgId, dto);
  }

  @Post(':id/invitations')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Send Member Invitation',
    description: 'Dispatches an invitation to join organization with a specified Role.',
  })
  @ApiResponse({ status: 201, description: 'Invitation created.' })
  async createInvitation(
    @Param('id') orgId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.organizationService.createInvitation(orgId, userId, dto);
  }
}
