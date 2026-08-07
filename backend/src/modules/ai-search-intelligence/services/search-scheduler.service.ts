import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SearchSchedulerService {
  private readonly logger = new Logger(SearchSchedulerService.name);

  async getSchedulerStatus() {
    return {
      activeSchedulesCount: 14,
      frequenciesSupported: ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'],
      nextRunScheduled: new Date(Date.now() + 3600000),
    };
  }
}
