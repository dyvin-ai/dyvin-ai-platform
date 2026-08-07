import { Injectable } from '@nestjs/common';
import { AIProviderCode } from '@prisma/client';
import { ProviderHealthResult } from '../providers/base-ai-provider.interface';
import { ProviderRegistry } from './provider-registry.service';

@Injectable()
export class ProviderHealthMonitor {
  constructor(private readonly registry: ProviderRegistry) {}

  async checkAllProviders(): Promise<Record<AIProviderCode, ProviderHealthResult>> {
    const providers = this.registry.getAllProviders();
    const results: Partial<Record<AIProviderCode, ProviderHealthResult>> = {};

    for (const provider of providers) {
      results[provider.code] = await provider.health();
    }

    return results as Record<AIProviderCode, ProviderHealthResult>;
  }
}
