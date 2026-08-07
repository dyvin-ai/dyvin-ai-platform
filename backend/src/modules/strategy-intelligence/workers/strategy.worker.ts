import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { StrategyEngineService } from '../services/strategy-engine.service';
import { ImpactRoiService } from '../services/impact-roi.service';
import { ExecutionPlannerService } from '../services/execution-planner.service';

@Processor('strategy-analysis')
export class StrategyAnalysisWorker extends WorkerHost {
  private readonly logger = new Logger(StrategyAnalysisWorker.name);

  constructor(private readonly strategyEngine: StrategyEngineService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing strategy analysis job ${job.id}`);
    return this.strategyEngine.analyzeAndCreateStrategy(job.data);
  }
}

@Processor('strategy-forecast')
export class ForecastWorker extends WorkerHost {
  private readonly logger = new Logger(ForecastWorker.name);

  constructor(private readonly executionPlanner: ExecutionPlannerService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing forecast job ${job.id}`);
    return this.executionPlanner.getForecast(job.data.strategyId);
  }
}

@Processor('strategy-impact')
export class ImpactWorker extends WorkerHost {
  private readonly logger = new Logger(ImpactWorker.name);

  constructor(private readonly impactRoiService: ImpactRoiService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing impact job ${job.id}`);
    return this.impactRoiService.calculateImpact(job.data.strategyId);
  }
}

@Processor('strategy-roi')
export class ROIWorker extends WorkerHost {
  private readonly logger = new Logger(ROIWorker.name);

  constructor(private readonly impactRoiService: ImpactRoiService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing ROI job ${job.id}`);
    return this.impactRoiService.calculateROI(job.data.strategyId);
  }
}

@Processor('strategy-execution-plan')
export class ExecutionPlanWorker extends WorkerHost {
  private readonly logger = new Logger(ExecutionPlanWorker.name);

  constructor(private readonly executionPlanner: ExecutionPlannerService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing execution plan job ${job.id}`);
    return this.executionPlanner.generateExecutionPlan(job.data.strategyId);
  }
}
