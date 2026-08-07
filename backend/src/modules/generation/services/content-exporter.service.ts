import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GeneratedContentStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

export interface ExportOutput {
  contentId: string;
  format: string;
  codeContent: string;
  exportedAt: Date;
}

@Injectable()
export class ContentExporterService {
  private readonly logger = new Logger(ContentExporterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async exportContent(contentId: string, format: string = 'json', userId?: string): Promise<ExportOutput> {
    const content = await this.prisma.generatedContent.findUnique({
      where: { id: contentId },
      include: { assets: true },
    });

    if (!content) {
      throw new NotFoundException('Generated content asset not found.');
    }

    if (content.status !== GeneratedContentStatus.APPROVED && content.status !== GeneratedContentStatus.EXPORTED) {
      throw new BadRequestException('Only approved content assets can be exported. Please complete the review & approval workflow first.');
    }

    const asset = content.assets.find((a) => a.exportFormat === format.toLowerCase()) || content.assets[0];

    if (!asset) {
      throw new NotFoundException(`No asset code content found for export format [${format}].`);
    }

    await this.prisma.generatedContent.update({
      where: { id: contentId },
      data: { status: GeneratedContentStatus.EXPORTED },
    });

    await this.auditService.logAction({
      userId,
      action: 'CONTENT_EXPORTED',
      metadata: { contentId, format },
    });

    return {
      contentId,
      format: asset.exportFormat,
      codeContent: asset.codeContent,
      exportedAt: new Date(),
    };
  }
}
