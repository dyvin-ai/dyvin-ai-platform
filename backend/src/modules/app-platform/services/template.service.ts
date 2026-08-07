import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(templateName: string, category = 'GEO_SEO_AUTOMATION') {
    return this.prisma.platformWorkflowTemplate.create({
      data: {
        templateName,
        category,
      },
    });
  }

  async getTemplates() {
    return this.prisma.platformWorkflowTemplate.findMany();
  }
}
