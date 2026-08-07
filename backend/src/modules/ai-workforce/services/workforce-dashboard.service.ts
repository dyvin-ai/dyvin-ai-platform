import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WorkforceDashboardService {
  private readonly logger = new Logger(WorkforceDashboardService.name);

  async getWorkforceOverview() {
    return {
      activeDigitalEmployeesCount: 42,
      departmentsCount: 11,
      tasksInQueueCount: 14,
      overallProductivityScore: 98.6,
      monthlyHoursSaved: 14200.0,
      monthlyCostSavedUsd: 420000,
    };
  }
}
