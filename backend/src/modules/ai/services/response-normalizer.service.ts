import { Injectable } from '@nestjs/common';
import { NormalizedAIResponse } from '../providers/base-ai-provider.interface';

@Injectable()
export class ResponseNormalizer {
  normalize<T = any>(rawResponse: NormalizedAIResponse<T>): NormalizedAIResponse<T> {
    return {
      provider: rawResponse.provider,
      model: rawResponse.model,
      content: rawResponse.content ? rawResponse.content.trim() : null,
      structuredData: rawResponse.structuredData ?? null,
      usage: {
        promptTokens: rawResponse.usage?.promptTokens || 0,
        completionTokens: rawResponse.usage?.completionTokens || 0,
        totalTokens: rawResponse.usage?.totalTokens || 0,
      },
      latencyMs: Math.max(0, rawResponse.latencyMs || 0),
      estimatedCost: Math.max(0, rawResponse.estimatedCost || 0),
    };
  }
}
