import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { VerificationEngineService } from './services/verification-engine.service';

@ApiTags('AI Verification & Validation Engine')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class VerificationController {
  constructor(private readonly verificationService: VerificationEngineService) {}

  @Post('recommendations/:id/verify')
  @Roles(Role.OWNER, Role.ADMIN, Role.MANAGER)
  @ApiOperation({
    summary: 'Verify Recommendation Execution',
    description: 'Triggers a verification run comparing previous and current website intelligence.',
  })
  @ApiResponse({ status: 201, description: 'Verification run queued.' })
  async verifyRecommendation(
    @Param('id') recommendationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.verificationService.initiateRecommendationVerification(recommendationId, userId);
  }

  @Get('verifications')
  @ApiOperation({
    summary: 'List Verification Runs',
    description: 'Lists all verification runs for project or recommendation.',
  })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by Project ID' })
  @ApiResponse({ status: 200, description: 'List of verifications.' })
  async getVerifications(@Query('projectId') projectId?: string) {
    return this.verificationService.getVerifications(projectId);
  }

  @Get('verifications/:id')
  @ApiOperation({
    summary: 'Get Verification Run Overview',
    description: 'Retrieves verification outcome, score delta, and status summary.',
  })
  @ApiResponse({ status: 200, description: 'Verification details.' })
  async getVerificationDetails(@Param('id') id: string) {
    return this.verificationService.getVerificationDetails(id);
  }

  @Get('verifications/:id/metrics')
  @ApiOperation({
    summary: 'Get Verification Metrics',
    description: 'Retrieves category metric deltas and score changes for specified verification run.',
  })
  @ApiResponse({ status: 200, description: 'Verification metrics.' })
  async getMetrics(@Param('id') id: string) {
    return this.verificationService.getVerificationMetrics(id);
  }

  @Get('verifications/:id/evidence')
  @ApiOperation({
    summary: 'Get Verification Evidence',
    description: 'Retrieves evidence provenance backing the verification run outcome.',
  })
  @ApiResponse({ status: 200, description: 'Verification evidence.' })
  async getEvidence(@Param('id') id: string) {
    return this.verificationService.getVerificationEvidence(id);
  }
}
