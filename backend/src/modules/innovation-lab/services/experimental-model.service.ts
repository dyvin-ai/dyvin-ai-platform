import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ExperimentalModelService {
  private readonly logger = new Logger(ExperimentalModelService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerPreviewModel(modelName: string, provider: string) {
    return this.prisma.experimentalModel.create({
      data: {
        modelName,
        provider,
        isExperimental: true,
      },
    });
  }

  async getExperimentalModels() {
    return this.prisma.experimentalModel.findMany();
  }
}
