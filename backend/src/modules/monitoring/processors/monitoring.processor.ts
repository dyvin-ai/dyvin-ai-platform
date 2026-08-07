import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MonitoringJobData, MonitoringEngineService } from '../services/monitoring-engine.service';
import { MONITORING_QUEUES } from '../monitoring.constants';

@Processor(MONITORING_QUEUES.ENGINE)
export class MonitoringProcessor extends WorkerHost {
  private readonly logger = new Logger(MonitoringProcessor.name);

  constructor(private readonly monitoringService: MonitoringEngineService) {
    super();
  }

  async process(job: Job<MonitoringJobData>): Promise<void> {
    const { jobId, projectId } = job.data;
    this.logger.log(`Processing monitoring job [${jobId}] for project [${projectId}]`);

    try {
      await this.monitoringService.processMonitoringRun(jobId, projectId);
    } catch (error) {
      this.logger.error(`Monitoring job failed for [${jobId}]:`, error);
      throw error;
    }
  }
}
