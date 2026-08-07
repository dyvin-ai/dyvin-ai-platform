import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ModelRegistryService {
  private readonly logger = new Logger(ModelRegistryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registerModel(modelName: string, provider: string) {
    return this.prisma.evolutionModelProfile.create({
      data: {
        modelName,
        provider,
        contextWindow: 128000,
        costPer1kTokens: 0.005,
        reasoningScore: 94.5,
      },
    });
  }

  async getRegisteredModels() {
    return this.prisma.evolutionModelProfile.findMany();
  }
}
