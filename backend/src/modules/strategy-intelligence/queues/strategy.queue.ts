import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class StrategyQueue {
  private readonly logger = new Logger(StrategyQueue.name);

  constructor(
    @InjectQueue('strategy-analysis') private readonly analysisQueue: Queue,
    @InjectQueue('strategy-forecast') private readonly forecastQueue: Queue,
    @InjectQueue('strategy-impact') private readonly impactQueue: Queue,
    @InjectQueue('strategy-roi') private readonly roiQueue: Queue,
    @InjectQueue('strategy-execution-plan') private readonly executionPlanQueue: Queue,
  ) {}

  async addAnalysisJob(data: any) {
    this.logger.log(`Enqueueing strategy analysis job for org: ${data.organizationId}`);
    return this.analysisQueue.add('analysis-job', data);
  }

  async addForecastJob(data: any) {
    this.logger.log(`Enqueueing forecast job for strategy: ${data.strategyId}`);
    return this.forecastQueue.add('forecast-job', data);
  }

  async addImpactJob(data: any) {
    this.logger.log(`Enqueueing impact job for strategy: ${data.strategyId}`);
    return this.impactQueue.add('impact-job', data);
  }

  async addROIJob(data: any) {
    this.logger.log(`Enqueueing ROI job for strategy: ${data.strategyId}`);
    return this.roiQueue.add('roi-job', data);
  }

  async addExecutionPlanJob(data: any) {
    this.logger.log(`Enqueueing execution plan job for strategy: ${data.strategyId}`);
    return this.executionPlanQueue.add('execution-plan-job', data);
  }
}
