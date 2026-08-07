import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GlobalTrendService {
  private readonly logger = new Logger(GlobalTrendService.name);

  async getTrends() {
    return {
      dailyTrend: 'Rise of AI Search Citation optimization',
      weeklyTrend: 'Increased Claude 3.5 Sonnet technical query volume',
      quarterlyTrend: 'Shift from traditional SEO to Generative Engine Optimization',
    };
  }
}
