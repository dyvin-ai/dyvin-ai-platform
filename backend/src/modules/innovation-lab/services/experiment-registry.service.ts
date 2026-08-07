import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExperimentRegistryService {
  private readonly logger = new Logger(ExperimentRegistryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createExperiment(title: string, owner: string, riskLevel = 'LOW') {
    return this.prisma.innovationExperiment.create({
      data: {
        title,
        owner,
        status: 'SANDBOX_TESTING',
        riskLevel,
      },
    });
  }

  async getExperiments() {
    return this.prisma.innovationExperiment.findMany();
  }
}
