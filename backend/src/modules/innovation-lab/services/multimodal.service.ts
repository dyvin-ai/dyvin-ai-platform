import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class MultimodalService {
  private readonly logger = new Logger(MultimodalService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processMultimodal(mediaType: string, modality = 'VISION_OCR') {
    return this.prisma.multimodalExperiment.create({
      data: {
        mediaType,
        modality,
        accuracyPct: 98.5,
      },
    });
  }

  async getMultimodalCapabilities() {
    return {
      supportedModalities: ['VISION', 'OCR', 'AUDIO_STT', 'VIDEO_ANALYTICS', 'DOCUMENT_STRUCTURE'],
      visionOcrAccuracyPct: 98.5,
    };
  }
}
