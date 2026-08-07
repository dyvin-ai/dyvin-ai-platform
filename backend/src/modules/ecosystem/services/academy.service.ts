import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AcademyService {
  private readonly logger = new Logger(AcademyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async issueCertificate(userId: string, certName: string) {
    return this.prisma.professionalCertificate.create({
      data: {
        userId,
        certName,
      },
    });
  }

  async getCourses() {
    return [
      { courseKey: 'geo-101', title: 'Generative Engine Optimization (GEO) Foundations', level: 'BEGINNER' },
      { courseKey: 'ai-agents-201', title: 'Building Autonomous AI Agents with Dyvin SDK', level: 'INTERMEDIATE' },
    ];
  }
}
