import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AiWorkforceController } from './ai-workforce.controller';
import { WorkforceDashboardService } from './services/workforce-dashboard.service';
import { DigitalEmployeeService } from './services/digital-employee.service';
import { DepartmentService } from './services/department.service';
import { TaskAssignmentService } from './services/task-assignment.service';
import { CollaborationService } from './services/collaboration.service';
import { PerformanceService } from './services/performance.service';
import { TrainingService } from './services/training.service';
import { SchedulingService } from './services/scheduling.service';

@Module({
  imports: [PrismaModule],
  controllers: [AiWorkforceController],
  providers: [
    WorkforceDashboardService,
    DigitalEmployeeService,
    DepartmentService,
    TaskAssignmentService,
    CollaborationService,
    PerformanceService,
    TrainingService,
    SchedulingService,
  ],
  exports: [
    WorkforceDashboardService,
    DigitalEmployeeService,
    DepartmentService,
    TaskAssignmentService,
    CollaborationService,
    PerformanceService,
    TrainingService,
    SchedulingService,
  ],
})
export class AiWorkforceModule {}
