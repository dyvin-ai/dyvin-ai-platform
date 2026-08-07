import { Injectable, Logger } from '@nestjs/common';
import { AIProviderCode } from '@prisma/client';

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface ProviderHealth {
  code: AIProviderCode;
  healthScore: number; // 0 - 100
  state: CircuitBreakerState;
  failureCount: number;
  lastFailureTime?: number;
  averageLatencyMs: number;
}

@Injectable()
export class IntelligentRouterService {
  private readonly logger = new Logger(IntelligentRouterService.name);
  private providerHealthMap = new Map<AIProviderCode, ProviderHealth>();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const codes: AIProviderCode[] = [
      AIProviderCode.OPENAI,
      AIProviderCode.CLAUDE,
      AIProviderCode.GEMINI,
      AIProviderCode.PERPLEXITY,
      AIProviderCode.MOCK,
    ];

    for (const code of codes) {
      this.providerHealthMap.set(code, {
        code,
        healthScore: 100,
        state: 'CLOSED',
        failureCount: 0,
        averageLatencyMs: 400,
      });
    }
  }

  selectOptimalProvider(preferredCode?: AIProviderCode): AIProviderCode {
    if (preferredCode && this.isProviderAvailable(preferredCode)) {
      return preferredCode;
    }

    const available = Array.from(this.providerHealthMap.values()).filter((p) => this.isProviderAvailable(p.code));

    if (available.length === 0) {
      return AIProviderCode.MOCK;
    }

    // Weighted routing based on health score and latency
    available.sort((a, b) => b.healthScore - a.healthScore || a.averageLatencyMs - b.averageLatencyMs);

    return available[0].code;
  }

  recordSuccess(code: AIProviderCode, latencyMs: number) {
    const health = this.providerHealthMap.get(code);
    if (!health) return;

    health.failureCount = 0;
    health.healthScore = Math.min(100, health.healthScore + 5);
    health.averageLatencyMs = Math.round((health.averageLatencyMs + latencyMs) / 2);

    if (health.state === 'HALF_OPEN') {
      health.state = 'CLOSED';
      this.logger.log(`Circuit Breaker CLOSED for AI Provider [${code}]. Recovered!`);
    }
  }

  recordFailure(code: AIProviderCode, errorMessage?: string) {
    const health = this.providerHealthMap.get(code);
    if (!health) return;

    health.failureCount += 1;
    health.lastFailureTime = Date.now();
    health.healthScore = Math.max(0, health.healthScore - 30);

    if (health.failureCount >= 3) {
      health.state = 'OPEN';
      this.logger.error(`Circuit Breaker OPENED for AI Provider [${code}]. Cooldown initiated. Reason: ${errorMessage}`);
    }
  }

  isProviderAvailable(code: AIProviderCode): boolean {
    const health = this.providerHealthMap.get(code);
    if (!health) return false;

    if (health.state === 'OPEN') {
      const cooldownMs = 30000; // 30s cooldown
      if (Date.now() - (health.lastFailureTime || 0) > cooldownMs) {
        health.state = 'HALF_OPEN';
        this.logger.log(`Circuit Breaker HALF_OPEN for AI Provider [${code}]. Testing recovery...`);
        return true;
      }
      return false;
    }

    return true;
  }

  getHealthReport(): ProviderHealth[] {
    return Array.from(this.providerHealthMap.values());
  }
}
