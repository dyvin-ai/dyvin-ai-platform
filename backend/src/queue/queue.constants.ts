export const QUEUE_NAMES = {
  AI_ANALYSIS: 'ai-analysis-queue',
  RECOMMENDATIONS: 'recommendations-queue',
  VISIBILITY_MONITOR: 'visibility-monitor-queue',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
