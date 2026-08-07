import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AuditService } from '../../audit/audit.service';
import { KNOWLEDGE_QUEUES } from '../knowledge.constants';
import { KnowledgeExtractionService } from '../services/knowledge-extraction.service';

export interface ExtractKnowledgeJobData {
  scanId: string;
  projectId: string;
}

@Processor(KNOWLEDGE_QUEUES.EXTRACTION)
export class KnowledgeExtractionProcessor extends WorkerHost {
  private readonly logger = new Logger(KnowledgeExtractionProcessor.name);

  constructor(
    private readonly extractionService: KnowledgeExtractionService,
    private readonly auditService: AuditService,
  ) {
    super();
  }

  async process(job: Job<ExtractKnowledgeJobData>): Promise<void> {
    const { scanId, projectId } = job.data;
    this.logger.log(`Processing knowledge extraction job for scan [${scanId}]`);

    try {
      await this.extractionService.extractKnowledgeFromScan(scanId);

      await this.auditService.logAction({
        action: 'KNOWLEDGE_GENERATED',
        metadata: { scanId, projectId },
      });
    } catch (error) {
      this.logger.error(`Knowledge extraction job failed for scan [${scanId}]:`, error);
      throw error;
    }
  }
}
