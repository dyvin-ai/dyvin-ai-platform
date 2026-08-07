import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DiscoveryEngineService } from '../services/discovery-engine.service';
import { ResearchReportService } from '../services/research-report.service';

@Processor('research-discovery')
export class DiscoveryWorker extends WorkerHost {
  private readonly logger = new Logger(DiscoveryWorker.name);

  constructor(private readonly discoveryEngine: DiscoveryEngineService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing discovery job ${job.id}`);
    return this.discoveryEngine.runDiscoveryProject(job.data);
  }
}

@Processor('research-analysis')
export class AnalysisWorker extends WorkerHost {
  private readonly logger = new Logger(AnalysisWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing research analysis job ${job.id}`);
    return { status: 'ANALYZED' };
  }
}

@Processor('research-trends')
export class TrendWorker extends WorkerHost {
  private readonly logger = new Logger(TrendWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing trend detection job ${job.id}`);
    return { status: 'TRENDS_UPDATED' };
  }
}

@Processor('research-report')
export class ReportWorker extends WorkerHost {
  private readonly logger = new Logger(ReportWorker.name);

  constructor(private readonly reportService: ResearchReportService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing report generation job ${job.id}`);
    return this.reportService.generateReport(job.data.projectId, job.data.reportType);
  }
}

@Processor('research-alert')
export class AlertWorker extends WorkerHost {
  private readonly logger = new Logger(AlertWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing alert job ${job.id}`);
    return { status: 'ALERT_DISPATCHED' };
  }
}
