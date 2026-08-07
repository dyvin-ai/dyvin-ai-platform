import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CitationQueue, ParseCitationJobPayload } from '../queues/citation.queue';
import { CitationParserService } from '../services/citation-parser.service';

@Processor(CitationQueue.PARSER_QUEUE)
export class CitationWorker extends WorkerHost {
  private readonly logger = new Logger(CitationWorker.name);

  constructor(private readonly parserService: CitationParserService) {
    super();
  }

  async process(job: Job<ParseCitationJobPayload>): Promise<any> {
    this.logger.log(`Processing Citation Queue Job [${job.id}] for Execution [${job.data.executionId}]`);
    return this.parserService.parseAndExtractCitations(job.data);
  }
}
