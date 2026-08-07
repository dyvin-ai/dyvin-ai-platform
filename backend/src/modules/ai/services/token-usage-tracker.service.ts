import { Injectable, Logger } from '@nestjs/common';
import { AIProviderCode, AIRequestType, AIResponseStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { NormalizedAIResponse } from '../providers/base-ai-provider.interface';

export interface RecordUsageParams {
  providerCode: AIProviderCode;
  modelCode: string;
  requestType: AIRequestType;
  response: NormalizedAIResponse;
}

@Injectable()
export class TokenUsageTracker {
  private readonly logger = new Logger(TokenUsageTracker.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordUsage(params: RecordUsageParams) {
    try {
      const request = await this.prisma.aIRequest.create({
        data: {
          providerCode: params.providerCode,
          modelCode: params.modelCode,
          requestType: params.requestType,
        },
      });

      const response = await this.prisma.aIResponse.create({
        data: {
          requestId: request.id,
          status: AIResponseStatus.SUCCESS,
          content: params.response.content,
          structuredData: (params.response.structuredData as any) || undefined,
          latencyMs: params.response.latencyMs,
        },
      });

      const tokenUsage = await this.prisma.tokenUsage.create({
        data: {
          requestId: request.id,
          promptTokens: params.response.usage.promptTokens,
          completionTokens: params.response.usage.completionTokens,
          totalTokens: params.response.usage.totalTokens,
        },
      });

      await this.prisma.costRecord.create({
        data: {
          requestId: request.id,
          tokenUsageId: tokenUsage.id,
          estimatedCost: params.response.estimatedCost,
          currency: 'USD',
        },
      });

      return { requestId: request.id, responseId: response.id };
    } catch (err: any) {
      this.logger.error(`Failed to record token usage in database: ${err.message}`);
    }
  }
}
