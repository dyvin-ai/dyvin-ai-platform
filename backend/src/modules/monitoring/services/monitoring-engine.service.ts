import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MonitoringRunStatus, Prisma } from '@prisma/client';
import { Queue } from 'bullmq';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

import { MONITORING_QUEUES } from '../monitoring.constants';
import { AutomationEngineService } from './automation-engine.service';
import { ChangeDetectorService } from './change-detector.service';
import { MonitoringSchedulerService } from './monitoring-scheduler.service';
import { SnapshotEngineService } from './snapshot-engine.service';

export interface MonitoringJobData {
  jobId: string;
  projectId: string;
}

@Injectable()
export class MonitoringEngineService {
  private readonly logger = new Logger(MonitoringEngineService.name);

  constructor(
    @InjectQueue(MONITORING_QUEUES.ENGINE)
    private readonly monitoringQueue: Queue<MonitoringJobData>,
    private readonly prisma: PrismaService,
    private readonly schedulerService: MonitoringSchedulerService,
    private readonly snapshotEngine: SnapshotEngineService,
    private readonly changeDetector: ChangeDetectorService,
    private readonly automationEngine: AutomationEngineService,
    private readonly auditService: AuditService,
  ) {}

  async startMonitoring(projectId: string, userId?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { websites: true },
    });

    if (!project || project.websites.length === 0) {
      throw new NotFoundException('Project or website not found.');
    }

    const websiteId = project.websites[0].id;

    let job = await this.prisma.monitoringJob.findFirst({
      where: { projectId, websiteId },
    });

    if (!job) {
      job = await this.prisma.monitoringJob.create({
        data: {
          projectId,
          websiteId,
          name: `Monitoring Job for ${project.name}`,
          cronExpression: '0 0 * * *',
          isEnabled: true,
        },
      });
    } else {
      job = await this.prisma.monitoringJob.update({
        where: { id: job.id },
        data: { isEnabled: true },
      });
    }

    await this.schedulerService.createOrUpdateSchedule(projectId, '0 0 * * *', project.timezone);

    await this.monitoringQueue.add(
      'run-monitoring',
      { jobId: job.id, projectId },
      { attempts: 2, backoff: { type: 'exponential', delay: 1000 } },
    );

    await this.auditService.logAction({
      userId,
      action: 'MONITORING_STARTED',
      metadata: { projectId, jobId: job.id },
    });

    return job;
  }

  async stopMonitoring(projectId: string, userId?: string) {
    const job = await this.prisma.monitoringJob.findFirst({
      where: { projectId },
    });

    if (!job) {
      throw new NotFoundException('Monitoring job not found for project.');
    }

    await this.prisma.monitoringJob.update({
      where: { id: job.id },
      data: { isEnabled: false },
    });

    await this.schedulerService.stopSchedule(projectId);

    await this.auditService.logAction({
      userId,
      action: 'MONITORING_STOPPED',
      metadata: { projectId, jobId: job.id },
    });

    return { message: 'Monitoring stopped successfully.', projectId };
  }

  async processMonitoringRun(jobId: string, projectId: string): Promise<void> {
    this.logger.log(`Processing monitoring run for job [${jobId}] project [${projectId}]`);

    const run = await this.prisma.monitoringRun.create({
      data: {
        jobId,
        status: MonitoringRunStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    const latestScan = await this.prisma.scan.findFirst({
      where: { projectId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
    });

    if (!latestScan) {
      await this.prisma.monitoringRun.update({
        where: { id: run.id },
        data: { status: MonitoringRunStatus.FAILED, completedAt: new Date() },
      });
      return;
    }

    // Generate Snapshot
    const snapshot = await this.snapshotEngine.createSnapshot(projectId, latestScan.id);

    await this.auditService.logAction({
      action: 'SNAPSHOT_CREATED',
      metadata: { projectId, version: snapshot.version, hash: snapshot.contentHash },
    });

    // Detect Changes
    const detectedChanges = this.changeDetector.detectChanges({}, {});

    for (const change of detectedChanges) {
      await this.prisma.websiteChange.create({
        data: {
          runId: run.id,
          changeType: change.changeType,
          impact: change.impact,
          description: change.description,
          beforeState: change.beforeState as Prisma.InputJsonObject,
          afterState: change.afterState as Prisma.InputJsonObject,
        },
      });

      await this.auditService.logAction({
        action: 'CHANGE_DETECTED',
        metadata: { projectId, changeType: change.changeType, impact: change.impact },
      });

      // Trigger Automation Pipeline
      await this.automationEngine.triggerAutomatedPipeline(projectId, change.changeType);
    }

    await this.prisma.monitoringRun.update({
      where: { id: run.id },
      data: {
        status: MonitoringRunStatus.COMPLETED,
        changesDetected: detectedChanges.length,
        completedAt: new Date(),
      },
    });

    await this.prisma.monitoringJob.update({
      where: { id: jobId },
      data: { lastRunAt: new Date() },
    });

    this.logger.log(`Monitoring run completed for job [${jobId}] with ${detectedChanges.length} changes detected.`);
  }

  async getMonitoringJobs(projectId?: string) {
    return this.prisma.monitoringJob.findMany({
      where: projectId ? { projectId } : {},
      include: {
        website: { select: { id: true, domain: true, url: true } },
        runs: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async getMonitoringDetails(jobId: string) {
    const job = await this.prisma.monitoringJob.findUnique({
      where: { id: jobId },
      include: {
        project: { select: { id: true, name: true } },
        website: { select: { id: true, domain: true, url: true } },
        runs: {
          include: { changes: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Monitoring job not found.');
    }

    return job;
  }

  async getMonitoringHistory(jobId: string) {
    await this.getMonitoringDetails(jobId);
    return this.prisma.monitoringRun.findMany({
      where: { jobId },
      include: { changes: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMonitoringChanges(jobId: string) {
    await this.getMonitoringDetails(jobId);
    return this.prisma.websiteChange.findMany({
      where: { run: { jobId } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
