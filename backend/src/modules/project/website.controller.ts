import {
  Body,
  Controller,
  Delete,
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
import { InitiateVerificationDto } from './dto/initiate-verification.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';
import { VerificationService } from './verification.service';
import { WebsiteService } from './website.service';

@ApiTags('Websites')
@Controller('websites')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class WebsiteController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly verificationService: VerificationService,
  ) {}

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Update Website',
    description: 'Updates website URL or primary status.',
  })
  @ApiResponse({ status: 200, description: 'Website updated.' })
  async updateWebsite(
    @Param('id') websiteId: string,
    @CurrentUser('id') userId: string,
    @CurrentOrganization() orgId: string,
    @Body() dto: UpdateWebsiteDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.websiteService.updateWebsite(
      websiteId,
      dto,
      userId,
      orgId,
      ipAddress,
      userAgent,
    );
  }

  @Delete(':id')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Delete Website',
    description: 'Soft-deletes website record.',
  })
  @ApiResponse({ status: 200, description: 'Website deleted.' })
  async deleteWebsite(
    @Param('id') websiteId: string,
    @CurrentUser('id') userId: string,
    @CurrentOrganization() orgId: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.websiteService.deleteWebsite(
      websiteId,
      userId,
      orgId,
      ipAddress,
      userAgent,
    );
  }

  @Post(':id/verify')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Initiate Website Verification',
    description:
      'Generates verification token and instructions for DNS_TXT, META_TAG, or HTML_FILE verification.',
  })
  @ApiResponse({ status: 200, description: 'Verification instructions issued.' })
  async initiateVerification(
    @Param('id') websiteId: string,
    @CurrentUser('id') userId: string,
    @CurrentOrganization() orgId: string,
    @Body() dto: InitiateVerificationDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    return this.verificationService.initiateVerification(
      websiteId,
      dto,
      userId,
      orgId,
      ipAddress,
      userAgent,
    );
  }
}
