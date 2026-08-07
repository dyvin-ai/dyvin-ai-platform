import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RetryManager {
  private readonly logger = new Logger(RetryManager.name);

  async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
  ): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await fn();
      } catch (err: any) {
        attempt++;
        if (attempt >= maxRetries) {
          this.logger.error(`Execution failed after ${maxRetries} attempts: ${err.message}`);
          throw err;
        }
        this.logger.warn(`Execution attempt ${attempt} failed: ${err.message}. Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)));
      }
    }
    throw new Error('Retry manager exceeded maximum retries');
  }
}
