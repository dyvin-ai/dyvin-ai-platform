import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TrainingService {
  private readonly logger = new Logger(TrainingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trainEmployee(employeeId: string, playbookTitle: string) {
    return this.prisma.workforceTraining.create({
      data: {
        employeeId,
        playbookTitle,
        status: 'COMPLETED',
      },
    });
  }

  async issueCertification(employeeId: string, certificateName: string) {
    return this.prisma.workforceCertification.create({
      data: {
        employeeId,
        certificateName,
      },
    });
  }
}
