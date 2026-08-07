import { Injectable, Logger } from '@nestjs/common';
import { EntityType, RelationType, VerificationState } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { EntityNormalizationService } from './entity-normalization.service';
import { FactEngineService } from './fact-engine.service';
import { RelationshipEngineService } from './relationship-engine.service';

@Injectable()
export class KnowledgeExtractionService {
  private readonly logger = new Logger(KnowledgeExtractionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly normalizationService: EntityNormalizationService,
    private readonly factEngine: FactEngineService,
    private readonly relationshipEngine: RelationshipEngineService,
  ) {}

  async extractKnowledgeFromScan(scanId: string): Promise<void> {
    const scan = await this.prisma.scan.findUnique({
      where: { id: scanId },
      include: {
        project: true,
        pages: {
          include: {
            structuredData: true,
            metadata: true,
          },
        },
      },
    });

    if (!scan) return;

    // 1. Find or create KnowledgeGraph for project
    let graph = await this.prisma.knowledgeGraph.findFirst({
      where: { projectId: scan.projectId },
    });

    if (!graph) {
      graph = await this.prisma.knowledgeGraph.create({
        data: {
          projectId: scan.projectId,
          name: `${scan.project.name} Knowledge Graph`,
        },
      });
    }

    const companyName = scan.project.name;
    const canonicalCompany = this.normalizationService.canonicalizeName(companyName);

    // 2. Find or Create Primary Company Entity
    let companyEntity = await this.prisma.entity.findFirst({
      where: { graphId: graph.id, canonicalName: canonicalCompany },
    });

    if (!companyEntity) {
      companyEntity = await this.prisma.entity.create({
        data: {
          graphId: graph.id,
          type: EntityType.COMPANY,
          name: companyName,
          canonicalName: canonicalCompany,
          description: scan.project.description || `${companyName} Entity`,
          confidenceScore: 100,
          verificationState: VerificationState.VERIFIED,
        },
      });

      await this.prisma.knowledgeGraph.update({
        where: { id: graph.id },
        data: { entityCount: { increment: 1 } },
      });
    }

    // 3. Extract Brand Profile & Facts from Scan Pages
    for (const page of scan.pages) {
      // Record Title Fact
      if (page.title) {
        await this.factEngine.recordFact({
          graphId: graph.id,
          entityId: companyEntity.id,
          predicate: 'hasTitle',
          value: page.title,
          sourceUrl: page.url,
          htmlSelector: 'title',
        });
      }

      // Record Description Fact
      if (page.metaDescription) {
        await this.factEngine.recordFact({
          graphId: graph.id,
          entityId: companyEntity.id,
          predicate: 'hasDescription',
          value: page.metaDescription,
          sourceUrl: page.url,
          htmlSelector: 'meta[name="description"]',
        });
      }

      // Process StructuredData (JSON-LD)
      for (const sd of page.structuredData) {
        const rawJson = sd.rawJson as Record<string, any>;
        const type = sd.type.toLowerCase();

        // Product
        if (type.includes('product')) {
          const prodName = rawJson['name'];
          if (prodName && typeof prodName === 'string') {
            const canonicalProd = this.normalizationService.canonicalizeName(prodName);
            let prodEntity = await this.prisma.entity.findFirst({
              where: { graphId: graph.id, canonicalName: canonicalProd },
            });

            if (!prodEntity) {
              prodEntity = await this.prisma.entity.create({
                data: {
                  graphId: graph.id,
                  type: EntityType.PRODUCT,
                  name: prodName,
                  canonicalName: canonicalProd,
                  description: rawJson['description'] || null,
                },
              });

              await this.prisma.product.create({
                data: {
                  graphId: graph.id,
                  name: prodName,
                  description: rawJson['description'] || null,
                  price: rawJson['offers']?.['price'] ? String(rawJson['offers']['price']) : null,
                },
              });

              await this.relationshipEngine.buildRelationship({
                graphId: graph.id,
                sourceEntityId: companyEntity.id,
                targetEntityId: prodEntity.id,
                relationType: RelationType.PRODUCES,
              });

              await this.prisma.knowledgeGraph.update({
                where: { id: graph.id },
                data: { entityCount: { increment: 1 } },
              });
            }
          }
        }

        // Service
        if (type.includes('service')) {
          const serviceName = rawJson['name'];
          if (serviceName && typeof serviceName === 'string') {
            const canonicalServ = this.normalizationService.canonicalizeName(serviceName);
            let servEntity = await this.prisma.entity.findFirst({
              where: { graphId: graph.id, canonicalName: canonicalServ },
            });

            if (!servEntity) {
              servEntity = await this.prisma.entity.create({
                data: {
                  graphId: graph.id,
                  type: EntityType.SERVICE,
                  name: serviceName,
                  canonicalName: canonicalServ,
                  description: rawJson['description'] || null,
                },
              });

              await this.prisma.service.create({
                data: {
                  graphId: graph.id,
                  name: serviceName,
                  description: rawJson['description'] || null,
                },
              });

              await this.relationshipEngine.buildRelationship({
                graphId: graph.id,
                sourceEntityId: companyEntity.id,
                targetEntityId: servEntity.id,
                relationType: RelationType.PROVIDES,
              });

              await this.prisma.knowledgeGraph.update({
                where: { id: graph.id },
                data: { entityCount: { increment: 1 } },
              });
            }
          }
        }

        // FAQ
        if (type.includes('faqpage') && Array.isArray(rawJson['mainEntity'])) {
          for (const item of rawJson['mainEntity']) {
            if (item['name'] && item['acceptedAnswer']?.['text']) {
              await this.prisma.fAQ.create({
                data: {
                  graphId: graph.id,
                  question: item['name'],
                  answer: item['acceptedAnswer']['text'],
                },
              });
            }
          }
        }
      }
    }

    this.logger.log(`Knowledge extraction completed for graph [${graph.id}]`);
  }
}
