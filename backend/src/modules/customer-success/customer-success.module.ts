import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { CustomerSuccessController } from './customer-success.controller';
import { CustomerHealthService } from './services/customer-health.service';
import { CustomerJourneyService } from './services/customer-journey.service';
import { ProductAdoptionService } from './services/product-adoption.service';
import { ChurnPredictionService } from './services/churn-prediction.service';
import { CustomerSuccessAssistantService } from './services/customer-success-assistant.service';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerSuccessController],
  providers: [
    CustomerHealthService,
    CustomerJourneyService,
    ProductAdoptionService,
    ChurnPredictionService,
    CustomerSuccessAssistantService,
  ],
  exports: [
    CustomerHealthService,
    CustomerJourneyService,
    ProductAdoptionService,
    ChurnPredictionService,
    CustomerSuccessAssistantService,
  ],
})
export class CustomerSuccessModule {}
