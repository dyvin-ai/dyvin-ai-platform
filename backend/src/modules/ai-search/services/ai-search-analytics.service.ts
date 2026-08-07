import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AISearchAnalyticsService {
  private readonly logger = new Logger(AISearchAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(aiSearchProjectId?: string) {
    const executions = await this.prisma.aISearchExecution.findMany({
      where: aiSearchProjectId ? { aiSearchProjectId } : undefined,
      include: { results: true },
    });

    const totalExecutions = executions.length;
    if (totalExecutions === 0) {
      return {
        promptSuccessRate: 100,
        executionSuccessCount: 0,
        averageLatencyMs: 0,
        averageCostUsd: 0,
        averageTokens: 0,
        totalTokens: 0,
        modelComparisons: [],
      };
    }

    const totalLatency = executions.reduce((acc, e) => acc + e.latencyMs, 0);
    const totalCost = executions.reduce((acc, e) => acc + e.costUsd, 0);
    const totalTokens = executions.reduce((acc, e) => acc + e.totalTokens, 0);

    // Group by Provider / Model for comparison
    const providerMap = new Map<string, { count: number; latency: number; cost: number; tokens: number }>();

    for (const e of executions) {
      const key = `${e.providerCode}:${e.modelCode}`;
      const existing = providerMap.get(key) || { count: 0, latency: 0, cost: 0, tokens: 0 };
      existing.count += 1;
      existing.latency += e.latencyMs;
      existing.cost += e.costUsd;
      existing.tokens += e.totalTokens;
      providerMap.set(key, existing);
    }

    const modelComparisons = Array.from(providerMap.entries()).map(([key, val]) => {
      const [provider, model] = key.split(':');
      return {
        provider,
        model,
        totalExecutions: val.count,
        averageLatencyMs: Math.round(val.latency / val.count),
        averageCostUsd: parseFloat((val.cost / val.count).toFixed(6)),
        averageTokens: Math.round(val.tokens / val.count),
      };
    });

    return {
      promptSuccessRate: 100.0,
      executionSuccessCount: totalExecutions,
      averageLatencyMs: Math.round(totalLatency / totalExecutions),
      averageCostUsd: parseFloat((totalCost / totalExecutions).toFixed(6)),
      averageTokens: Math.round(totalTokens / totalExecutions),
      totalTokens,
      modelComparisons,
    };
  }

  async getExecutionHistory(aiSearchProjectId?: string, limit: number = 50) {
    return this.prisma.aISearchExecution.findMany({
      where: aiSearchProjectId ? { aiSearchProjectId } : undefined,
      include: { prompt: true, results: true, responses: true, logs: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getProviders() {
    return [
      { code: 'OPENAI', name: 'ChatGPT / OpenAI', isEnabled: true, models: ['gpt-4o', 'gpt-4o-mini', 'o1-preview'] },
      { code: 'CLAUDE', name: 'Anthropic Claude', isEnabled: true, models: ['claude-3-5-sonnet', 'claude-3-haiku'] },
      { code: 'GEMINI', name: 'Google Gemini', isEnabled: true, models: ['gemini-1.5-pro', 'gemini-1.5-flash'] },
      { code: 'PERPLEXITY', name: 'Perplexity AI', isEnabled: true, models: ['sonar-pro', 'sonar-reasoning'] },
    ];
  }

  async getModels() {
    return [
      { code: 'gpt-4o', provider: 'OPENAI', supportsCitations: true },
      { code: 'claude-3-5-sonnet', provider: 'CLAUDE', supportsCitations: true },
      { code: 'gemini-1.5-pro', provider: 'GEMINI', supportsCitations: true },
      { code: 'sonar-pro', provider: 'PERPLEXITY', supportsCitations: true },
    ];
  }
}
