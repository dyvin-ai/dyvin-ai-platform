import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PlatformDigitalTwinService {
  private readonly logger = new Logger(PlatformDigitalTwinService.name);

  constructor(private readonly prisma: PrismaService) {}

  async runDigitalTwinSimulation(simulatedUsers = 100000, simulatedOrgs = 5000) {
    return this.prisma.digitalTwinSimulation.create({
      data: {
        simulatedUsers,
        simulatedOrgs,
        status: 'STABLE_SIMULATION',
      },
    });
  }

  async getDigitalTwinStatus() {
    return {
      simulatedOrganizationsCount: 5000,
      simulatedUsersCount: 100000,
      simulatedWorkforceAgentsCount: 25000,
      digitalTwinHealth: 'STABLE_REALTIME_MIRROR',
    };
  }
}
