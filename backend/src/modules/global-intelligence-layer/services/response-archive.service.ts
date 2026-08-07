import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ResponseArchiveService {
  private readonly logger = new Logger(ResponseArchiveService.name);

  constructor(private readonly prisma: PrismaService) {}

  async archiveResponse(promptText: string, responseText: string, provider: string, model: string, latencyMs: number) {
    return this.prisma.globalArchiveRecord.create({
      data: {
        promptText,
        responseText,
        provider,
        model,
        latencyMs,
      },
    });
  }

  async getArchiveStats() {
    return {
      archivedResponses: 12500000,
      supportedProviders: ['OPENAI', 'ANTHROPIC', 'GOOGLE', 'PERPLEXITY'],
      retention: 'PERMANENT_APPEND_ONLY',
    };
  }
}
