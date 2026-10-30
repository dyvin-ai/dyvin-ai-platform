import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantAdminService, QuotaOverrideInput, StartImpersonationInput } from './services/tenant-admin.service';
import { SupportTicketService, CreateSupportTicketInput } from './services/support-ticket.service';
import { CustomerSuccessHealthService } from './services/customer-success-health.service';
import { AdminPlatformQueue } from './queues/admin-platform.queue';

@ApiTags('Enterprise Administration & Operations Center')
@Controller('admin')
export class AdminPlatformController {
  constructor(
    private readonly tenantService: TenantAdminService,
    private readonly supportService: SupportTicketService,
    private readonly customerSuccessService: CustomerSuccessHealthService,
    private readonly adminQueue: AdminPlatformQueue,
  ) {}

  @Get('tenants')
  @ApiOperation({ summary: 'List all enterprise tenants' })
  async getTenants() {
    return this.tenantService.getTenants();
  }

  @Post('tenants/override')
  @ApiOperation({ summary: 'Override tenant quota or resource limit' })
  async overrideQuota(@Body() body: QuotaOverrideInput) {
    await this.adminQueue.addAdminJob(body);
    return this.tenantService.overrideQuota(body);
  }

  @Get('support')
  @ApiOperation({ summary: 'List support tickets' })
  async getSupportTickets(@Query('tenantId') tenantId?: string) {
    return this.supportService.getTickets(tenantId);
  }

  @Post('support')
  @ApiOperation({ summary: 'Create support ticket' })
  async createSupportTicket(@Body() body: CreateSupportTicketInput) {
    await this.adminQueue.addSupportJob(body);
    return this.supportService.createTicket(body);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer success scores & health levels' })
  async getCustomerHealth(@Query('organizationId') organizationId?: string) {
    return this.customerSuccessService.getCustomerHealth(organizationId);
  }

  @Get('licenses')
  @ApiOperation({ summary: 'List license assignments' })
  async getLicenses(@Query('tenantId') tenantId?: string) {
    return this.customerSuccessService.getLicenses(tenantId);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get tenant health overview' })
  async getHealth() {
    return this.tenantService.getHealth();
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get overall tenant API and token usage metrics' })
  async getUsage() {
    return this.tenantService.getUsage();
  }

  @Get('audit')
  @ApiOperation({ summary: 'Get admin control plane audit logs' })
  async getAuditLogs() {
    return this.tenantService.getAuditLogs();
  }

  @Post('impersonation')
  @ApiOperation({ summary: 'Start secure admin impersonation session' })
  async startImpersonation(@Body() body: StartImpersonationInput) {
    await this.adminQueue.addAdminJob(body);
    return this.tenantService.startImpersonation(body);
  }
}
