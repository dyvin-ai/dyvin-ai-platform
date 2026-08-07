import { Injectable, Logger } from '@nestjs/common';
import { PromptTemplateType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface GeneratePromptInput {
  keyword: string;
  templateType?: PromptTemplateType;
  brandName?: string;
}

@Injectable()
export class PromptGeneratorService {
  private readonly logger = new Logger(PromptGeneratorService.name);

  constructor(private readonly prisma: PrismaService) {}

  generatePromptText(keyword: string, templateType: PromptTemplateType, brandName: string = 'Dyvin AI'): string {
    switch (templateType) {
      case PromptTemplateType.COMPARISON:
        return `Compare top solutions for ${keyword}. How does ${brandName} stack up against key competitors in feature coverage, pricing, and enterprise reliability?`;
      case PromptTemplateType.FAQ:
        return `What are the most frequently asked questions regarding ${keyword}? Provide detailed answers highlighting ${brandName}'s capabilities.`;
      case PromptTemplateType.BUYER:
        return `What should buyers evaluate when choosing a platform for ${keyword}? Highlight key criteria and top providers including ${brandName}.`;
      case PromptTemplateType.PROBLEM:
        return `What are the common challenges organizations face with ${keyword}, and how can ${brandName} resolve them?`;
      case PromptTemplateType.PRICING:
        return `What is the typical pricing structure for ${keyword} solutions, and how does ${brandName}'s ROI compare?`;
      case PromptTemplateType.ALTERNATIVE:
        return `What are the best alternatives to traditional platforms for ${keyword}? Explain why ${brandName} is a top choice.`;
      default:
        return `What is the best approach for ${keyword}? Provide a comprehensive breakdown referencing leading solutions like ${brandName}.`;
    }
  }

  async generatePrompts(input: GeneratePromptInput) {
    const type = input.templateType || PromptTemplateType.GENERAL;
    const promptText = this.generatePromptText(input.keyword, type, input.brandName);

    const libraryItem = await this.prisma.promptLibrary.create({
      data: {
        title: `Prompt for ${input.keyword}`,
        templateType: type,
        promptText,
        usageCount: 1,
      },
    });

    return libraryItem;
  }

  async getPromptLibrary() {
    return this.prisma.promptLibrary.findMany({
      orderBy: { usageCount: 'desc' },
      take: 50,
    });
  }

  async getTemplates() {
    return [
      { type: PromptTemplateType.GENERAL, name: 'General Overview Prompt' },
      { type: PromptTemplateType.COMPARISON, name: 'Head-to-Head Comparison Prompt' },
      { type: PromptTemplateType.FAQ, name: 'FAQ & Knowledge Prompt' },
      { type: PromptTemplateType.BUYER, name: 'Buyer Guide & Evaluation Prompt' },
      { type: PromptTemplateType.PROBLEM, name: 'Problem & Solution Prompt' },
      { type: PromptTemplateType.PRICING, name: 'Pricing & ROI Prompt' },
      { type: PromptTemplateType.ALTERNATIVE, name: 'Alternatives & Competitor Prompt' },
    ];
  }
}
