import { Body, Controller, Get, Post, Query, UseGuards, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PrismaService } from '../../database/prisma.service';
import { WorkforceDashboardService } from './services/workforce-dashboard.service';
import { DigitalEmployeeService } from './services/digital-employee.service';
import { DepartmentService } from './services/department.service';
import { TaskAssignmentService } from './services/task-assignment.service';
import { PerformanceService } from './services/performance.service';
import { TrainingService } from './services/training.service';
import { SchedulingService } from './services/scheduling.service';

@ApiTags('Enterprise Autonomous AI Workforce Platform')
@Controller('workforce')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AiWorkforceController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardService: WorkforceDashboardService,
    private readonly employeeService: DigitalEmployeeService,
    private readonly departmentService: DepartmentService,
    private readonly taskService: TaskAssignmentService,
    private readonly performanceService: PerformanceService,
    private readonly trainingService: TrainingService,
    private readonly schedulingService: SchedulingService,
  ) {}

  private async verifyOrganizationMember(userId: string, organizationId: string) {
    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
    if (!membership) {
      throw new ForbiddenException('Access denied: You are not a member of this organization.');
    }
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get AI Workforce Platform executive dashboard' })
  async getDashboard() {
    return this.dashboardService.getWorkforceOverview();
  }

  @Get('employees')
  @ApiOperation({ summary: 'List organization AI Digital Employees' })
  async getEmployees(
    @CurrentUser('id') userId: string,
    @Query('orgId') orgId?: string,
  ) {
    if (orgId && orgId !== 'org-default') {
      await this.verifyOrganizationMember(userId, orgId);
      return this.employeeService.getEmployees(orgId);
    }
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    const userOrgIds = memberships.map((m) => m.organizationId);
    return this.prisma.digitalEmployee.findMany({
      where: { organizationId: { in: userOrgIds } },
    });
  }

  @Post('employees')
  @ApiOperation({ summary: 'Hire and onboard new AI Digital Employee' })
  async hireEmployee(
    @CurrentUser('id') userId: string,
    @Body() body: { organizationId: string; employeeName: string; role: string; department?: string },
  ) {
    await this.verifyOrganizationMember(userId, body.organizationId);
    return this.employeeService.hireEmployee(body.organizationId, body.employeeName, body.role, body.department);
  }

  @Get('departments')
  @ApiOperation({ summary: 'List organization departments and headcount' })
  async getDepartments() {
    return this.departmentService.getDepartments();
  }

  @Get('tasks')
  @ApiOperation({ summary: 'List workforce assigned tasks' })
  async getTasks(
    @CurrentUser('id') userId: string,
    @Query('orgId') orgId?: string,
  ) {
    if (orgId && orgId !== 'org-default') {
      await this.verifyOrganizationMember(userId, orgId);
      return this.taskService.getTasks(orgId);
    }
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    const userOrgIds = memberships.map((m) => m.organizationId);
    return this.prisma.workforceTask.findMany({
      where: { organizationId: { in: userOrgIds } },
    });
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Assign task to Digital Employee' })
  async assignTask(
    @CurrentUser('id') userId: string,
    @Body() body: { organizationId: string; taskTitle: string; assignedToId?: string },
  ) {
    await this.verifyOrganizationMember(userId, body.organizationId);
    return this.taskService.assignTask(body.organizationId, body.taskTitle, body.assignedToId);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get workforce performance analytics' })
  async getPerformance() {
    return this.performanceService.getPerformanceOverview();
  }

  @Get('training')
  @ApiOperation({ summary: 'Get employee skill training courses' })
  async getTraining() {
    return {
      activePlaybooksCount: 18,
      certifiedEmployeesPct: 94.5,
      trainingStatus: 'SOP_UP_TO_DATE',
    };
  }

  @Get('scheduling')
  @ApiOperation({ summary: 'Get 24/7 autonomous shift schedules' })
  async getSchedules() {
    return this.schedulingService.getWorkforceSchedules();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get overall AI Workforce Platform statistics' })
  async getStatistics() {
    return {
      activeDigitalEmployees: 42,
      departmentsCovered: 11,
      workforceStatus: 'FULLY_OPERATIONAL_AUTONOMOUS',
    };
  }
}
