import { Injectable, Logger } from '@nestjs/common';
import { KeywordIntentType, KeywordSource } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';

export interface CSVImportInput {
  organizationId: string;
  filename: string;
  csvContent: string;
}

@Injectable()
export class KeywordImportService {
  private readonly logger = new Logger(KeywordImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  normalizeKeyword(raw: string): string {
    return raw.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  detectIntent(keyword: string): KeywordIntentType {
    const k = keyword.toLowerCase();
    if (k.includes('vs') || k.includes('compare') || k.includes('alternative')) return KeywordIntentType.COMPARISON;
    if (k.includes('buy') || k.includes('pricing') || k.includes('cost')) return KeywordIntentType.TRANSACTIONAL;
    if (k.includes('best') || k.includes('top') || k.includes('review')) return KeywordIntentType.COMMERCIAL;
    if (k.includes('how') || k.includes('what') || k.includes('why')) return KeywordIntentType.QUESTION;
    if (k.includes('near me') || k.includes('location')) return KeywordIntentType.LOCAL;
    return KeywordIntentType.INFORMATIONAL;
  }

  async importKeywords(input: CSVImportInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-keyword-intelligence');
    if (isEnabled === false) {
      this.logger.warn(`Keyword Intelligence disabled by Feature Flag.`);
    }

    const lines = input.csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const rawKeywords = lines.slice(lines[0].toLowerCase().includes('keyword') ? 1 : 0);

    let importedCount = 0;
    let invalidCount = 0;
    const createdKeywords = [];

    const importRecord = await this.prisma.keywordImport.create({
      data: {
        filename: input.filename,
        totalRows: rawKeywords.length,
      },
    });

    for (const raw of rawKeywords) {
      const parts = raw.split(',');
      const text = parts[0]?.replace(/^"|"$/g, '').trim();

      if (!text || text.length < 2) {
        invalidCount++;
        continue;
      }

      const normalizedText = this.normalizeKeyword(text);
      const intent = this.detectIntent(normalizedText);

      const keyword = await this.prisma.keyword.create({
        data: {
          organizationId: input.organizationId,
          text,
          normalizedText,
          intent,
          source: KeywordSource.CSV_IMPORT,
          searchVolume: 1200,
          difficulty: 35,
          opportunityScore: 82.0,
        },
      });

      createdKeywords.push(keyword);
      importedCount++;
    }

    await this.prisma.keywordImport.update({
      where: { id: importRecord.id },
      data: { importedRows: importedCount, invalidRows: invalidCount },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'KEYWORD_CSV_IMPORTED',
      metadata: { importId: importRecord.id, total: rawKeywords.length, imported: importedCount, invalid: invalidCount },
    });

    return {
      importId: importRecord.id,
      totalRows: rawKeywords.length,
      importedCount,
      invalidCount,
      keywords: createdKeywords,
    };
  }
}
