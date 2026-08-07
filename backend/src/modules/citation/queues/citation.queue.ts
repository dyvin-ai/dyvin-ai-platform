import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

export interface ParseCitationJobPayload {
  aiSearchProjectId: string;
  executionId: string;
  responseText: string;
  brandDomain?: string;
}

@Injectable()
export class CitationQueue {
  private readonly logger = new Logger(CitationQueue.name);
  public static readonly PARSER_QUEUE = 'citation-parser';
  public static readonly AUTHORITY_QUEUE = 'citation-authority';
  public static readonly NORMALIZER_QUEUE = 'citation-normalizer';

  constructor(@InjectQueue(CitationQueue.PARSER_QUEUE) private readonly parserQueue: Queue) {}

  async enqueueParseJob(payload: ParseCitationJobPayload) {
    this.logger.log(`Enqueueing Citation Parser Job for Execution [${payload.executionId}]`);
    return this.parserQueue.add('parse-ai-response-citations', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
    });
  }
}
