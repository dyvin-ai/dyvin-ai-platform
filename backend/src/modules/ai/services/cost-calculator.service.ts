import { Injectable } from '@nestjs/common';

@Injectable()
export class CostCalculator {
  calculateCost(
    promptTokens: number,
    completionTokens: number,
    costPer1kPrompt: number = 0.0015,
    costPer1kCompletion: number = 0.002,
  ): number {
    const promptCost = (promptTokens / 1000) * costPer1kPrompt;
    const completionCost = (completionTokens / 1000) * costPer1kCompletion;
    return Number((promptCost + completionCost).toFixed(6));
  }
}
