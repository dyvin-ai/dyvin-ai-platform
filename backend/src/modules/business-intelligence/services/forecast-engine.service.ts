import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ForecastEngineService {
  private readonly logger = new Logger(ForecastEngineService.name);

  async getForecasts() {
    return {
      forecastPeriodDays: 30,
      forecastedArrUsd: 16200000.0,
      forecastedCustomers: 1580,
      confidenceLowUsd: 15400000.0,
      confidenceHighUsd: 17000000.0,
      forecastedInfraCostUsd: 4850.0,
    };
  }
}
