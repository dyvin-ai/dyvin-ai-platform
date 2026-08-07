import { Injectable } from '@nestjs/common';
import { GapSeverity, GapType } from '@prisma/client';
import { ScanAndKnowledgeData } from './scoring-engine.service';

export interface DetectedGap {
  gapType: GapType;
  title: string;
  description: string;
  severity: GapSeverity;
}

@Injectable()
export class KnowledgeGapEngineService {
  detectGaps(data: ScanAndKnowledgeData): DetectedGap[] {
    const gaps: DetectedGap[] = [];

    if (!data.hasSchema) {
      gaps.push({
        gapType: GapType.MISSING_SCHEMA,
        title: 'Missing Schema.org Structured Data',
        description: 'No JSON-LD Organization or Product schema detected on primary website pages.',
        severity: GapSeverity.CRITICAL,
      });
    }

    if (!data.hasProducts) {
      gaps.push({
        gapType: GapType.MISSING_PRODUCTS,
        title: 'Unidentified Product Entities',
        description: 'No explicit product entities or pricing structures detected in knowledge graph.',
        severity: GapSeverity.HIGH,
      });
    }

    if (!data.hasServices) {
      gaps.push({
        gapType: GapType.MISSING_SERVICES,
        title: 'Missing Service Definitions',
        description: 'Core business services are missing structured descriptions.',
        severity: GapSeverity.HIGH,
      });
    }

    if (!data.hasFaqs) {
      gaps.push({
        gapType: GapType.MISSING_FAQS,
        title: 'Missing FAQ Structured Markup',
        description: 'FAQPage schema missing. AI answer engines cannot easily extract direct Q&A pairs.',
        severity: GapSeverity.MEDIUM,
      });
    }

    if (!data.hasHttps || data.securityScore < 80) {
      gaps.push({
        gapType: GapType.MISSING_TRUST_SIGNALS,
        title: 'Weak Security & Trust Signals',
        description: 'Suboptimal HSTS/CSP security headers or non-HTTPS connections detected.',
        severity: GapSeverity.HIGH,
      });
    }

    return gaps;
  }
}
