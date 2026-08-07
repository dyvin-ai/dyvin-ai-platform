import { Injectable } from '@nestjs/common';

export interface MetricEvaluation {
  metricName: string;
  previousValue: string | null;
  currentValue: string | null;
  delta: number;
  confidence: number;
}

@Injectable()
export class VerificationMetricsService {
  evaluateMetric(
    metricName: string,
    previousValue: string | null,
    currentValue: string | null,
  ): MetricEvaluation {
    const prevNum = Number(previousValue) || 0;
    const currNum = Number(currentValue) || 0;
    const delta = currNum - prevNum;

    return {
      metricName,
      previousValue,
      currentValue,
      delta,
      confidence: 100,
    };
  }
}
