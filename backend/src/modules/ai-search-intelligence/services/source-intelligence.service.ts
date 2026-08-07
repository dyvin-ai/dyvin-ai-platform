import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SourceIntelligenceService {
  private readonly logger = new Logger(SourceIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSources() {
    return [
      { sourceName: 'Wikipedia', trustIndex: 98.0, citationShare: 24.5 },
      { sourceName: 'GitHub Docs', trustIndex: 95.0, citationShare: 18.2 },
      { sourceName: 'Reddit AI Discussions', trustIndex: 88.0, citationShare: 15.0 },
      { sourceName: 'LinkedIn Technical Articles', trustIndex: 91.0, citationShare: 12.4 },
    ];
  }
}
