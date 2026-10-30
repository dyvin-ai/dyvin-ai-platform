import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ThreatSecurityService, LogSecurityEventInput } from './services/threat-security.service';
import { ComplianceAuditService } from './services/compliance-audit.service';
import { BackupDisasterRecoveryService } from './services/backup-disaster-recovery.service';
import { ChaosInfrastructureService } from './services/chaos-infrastructure.service';
import { PlatformSecurityQueue } from './queues/platform-security.queue';

@ApiTags('Platform Security, Compliance & Disaster Recovery')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PlatformSecurityController {
  constructor(
    private readonly securityService: ThreatSecurityService,
    private readonly complianceService: ComplianceAuditService,
    private readonly backupService: BackupDisasterRecoveryService,
    private readonly chaosService: ChaosInfrastructureService,
    private readonly securityQueue: PlatformSecurityQueue,
  ) {}

  @Get('security')
  @ApiOperation({ summary: 'Get security hardening overview & threat metrics' })
  async getSecurityOverview() {
    return this.securityService.getSecurityOverview();
  }

  @Get('security/events')
  @ApiOperation({ summary: 'List security events' })
  async getSecurityEvents() {
    return this.securityService.getEvents();
  }

  @Get('security/incidents')
  @ApiOperation({ summary: 'List security incidents' })
  async getSecurityIncidents() {
    return this.securityService.getIncidents();
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Get SOC2, GDPR, ISO27001 compliance framework status' })
  async getComplianceStatus() {
    return this.complianceService.getComplianceStatus();
  }

  @Get('compliance/reports')
  @ApiOperation({ summary: 'Get compliance audit reports' })
  async getComplianceReports() {
    return this.complianceService.getReports();
  }

  @Get('backups')
  @ApiOperation({ summary: 'List backup snapshots & verifications' })
  async getBackups() {
    return this.backupService.getBackups();
  }

  @Post('backups/run')
  @ApiOperation({ summary: 'Trigger automated full/incremental backup snapshot' })
  async runBackup(@Body('backupName') backupName?: string) {
    await this.securityQueue.addBackupJob({ backupName });
    return this.backupService.runBackup(backupName);
  }

  @Post('restores/run')
  @ApiOperation({ summary: 'Trigger point-in-time restore test' })
  async runRestore(@Body('backupId') backupId: string) {
    await this.securityQueue.addRestoreJob({ backupId });
    return this.backupService.runRestore(backupId);
  }

  @Get('disaster-recovery')
  @ApiOperation({ summary: 'Get multi-region disaster recovery plans & RPO/RTO metrics' })
  async getDisasterRecoveryPlans() {
    return this.backupService.getDisasterRecoveryPlans();
  }

  @Post('chaos/run')
  @ApiOperation({ summary: 'Run chaos engineering experiment simulation' })
  async runChaosExperiment(@Body('name') name: string, @Body('targetType') targetType?: string) {
    await this.securityQueue.addChaosJob({ name, targetType });
    return this.chaosService.runChaosExperiment(name, targetType);
  }

  @Get('infrastructure')
  @ApiOperation({ summary: 'Get infrastructure health & component latency metrics' })
  async getInfrastructureHealth() {
    return this.chaosService.getInfrastructureHealth();
  }
}
