import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { REPORT_QUEUES } from '../report.constants';
import { ReportGeneratorService } from '../services/report-generator.service';

export interface ReportJobData {
  projectId: string;
  reportType?: any;
}

@Processor(REPORT_QUEUES.REPORT_GENERATION)
export class ReportProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(private readonly reportGenerator: ReportGeneratorService) {
    super();
  }

  async process(job: Job<ReportJobData>): Promise<void> {
    const { projectId, reportType } = job.data;
    this.logger.log(`Processing asynchronous report generation job for project [${projectId}]`);

    try {
      await this.reportGenerator.generateReport({ projectId, reportType });
    } catch (error) {
      this.logger.error(`Report generation job failed for project [${projectId}]:`, error);
      throw error;
    }
  }
}
