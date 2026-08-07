import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkforceDashboardService } from './services/workforce-dashboard.service';
import { DigitalEmployeeService } from './services/digital-employee.service';
import { DepartmentService } from './services/department.service';
import { TaskAssignmentService } from './services/task-assignment.service';
import { PerformanceService } from './services/performance.service';
import { TrainingService } from './services/training.service';
import { SchedulingService } from './services/scheduling.service';

@ApiTags('Enterprise Autonomous AI Workforce Platform')
@Controller('api/v1/workforce')
export class AiWorkforceController {
  constructor(
    private readonly dashboardService: WorkforceDashboardService,
    private readonly employeeService: DigitalEmployeeService,
    private readonly departmentService: DepartmentService,
    private readonly taskService: TaskAssignmentService,
    private readonly performanceService: PerformanceService,
    private readonly trainingService: TrainingService,
    private readonly schedulingService: SchedulingService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get AI Workforce Platform executive dashboard' })
  async getDashboard() {
    return this.dashboardService.getWorkforceOverview();
  }

  @Get('employees')
  @ApiOperation({ summary: 'List organization AI Digital Employees' })
  async getEmployees(@Query('orgId') orgId?: string) {
    return this.employeeService.getEmployees(orgId || 'org-default');
  }

  @Post('employees')
  @ApiOperation({ summary: 'Hire and onboard new AI Digital Employee' })
  async hireEmployee(@Body() body: { organizationId: string; employeeName: string; role: string; department?: string }) {
    return this.employeeService.hireEmployee(body.organizationId, body.employeeName, body.role, body.department);
  }

  @Get('departments')
  @ApiOperation({ summary: 'List organization departments and headcount' })
  async getDepartments() {
    return this.departmentService.getDepartments();
  }

  @Get('tasks')
  @ApiOperation({ summary: 'List workforce assigned tasks' })
  async getTasks(@Query('orgId') orgId?: string) {
    return this.taskService.getTasks(orgId || 'org-default');
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Assign task to Digital Employee' })
  async assignTask(@Body() body: { organizationId: string; taskTitle: string; assignedToId?: string }) {
    return this.taskService.assignTask(body.organizationId, body.taskTitle, body.assignedToId);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Get AI workforce productivity & ROI scorecards' })
  async getPerformance() {
    return this.performanceService.getPerformanceOverview();
  }

  @Get('training')
  @ApiOperation({ summary: 'Get workforce training & certification status' })
  async getTraining() {
    return {
      activePlaybooksCount: 18,
      certifiedEmployeesPct: 94.5,
      trainingStatus: 'SOP_UP_TO_DATE',
    };
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get AI workforce shift schedules & availability' })
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
