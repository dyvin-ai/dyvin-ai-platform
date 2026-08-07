import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { PlatformValidationController } from './platform-validation.controller';
import { PlatformCommandCenterService } from './services/platform-command-center.service';
import { PlatformHealthService } from './services/platform-health.service';
import { ValidationEngineService } from './services/validation-engine.service';
import { CertificationService } from './services/certification.service';
import { FailureSimulationService } from './services/failure-simulation.service';
import { ScenarioEngineService } from './services/scenario-engine.service';
import { PlatformScorecardService } from './services/platform-scorecard.service';
import { TechnicalDebtScannerService } from './services/technical-debt-scanner.service';
import { AutonomousOptimizationEngineService } from './services/autonomous-optimization-engine.service';
import { PlatformDigitalTwinService } from './services/platform-digital-twin.service';

@Module({
  imports: [PrismaModule],
  controllers: [PlatformValidationController],
  providers: [
    PlatformCommandCenterService,
    PlatformHealthService,
    ValidationEngineService,
    CertificationService,
    FailureSimulationService,
    ScenarioEngineService,
    PlatformScorecardService,
    TechnicalDebtScannerService,
    AutonomousOptimizationEngineService,
    PlatformDigitalTwinService,
  ],
  exports: [
    PlatformCommandCenterService,
    PlatformHealthService,
    ValidationEngineService,
    CertificationService,
    FailureSimulationService,
    ScenarioEngineService,
    PlatformScorecardService,
    TechnicalDebtScannerService,
    AutonomousOptimizationEngineService,
    PlatformDigitalTwinService,
  ],
})
export class PlatformValidationModule {}
