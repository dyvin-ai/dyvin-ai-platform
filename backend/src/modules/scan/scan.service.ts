import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CrawlerService } from '../crawler/crawler.service';

@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly crawlerService: CrawlerService,
    private readonly auditService: AuditService,
  ) {}

  async initiateProjectScan(
    projectId: string,
    organizationId: string,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId, deletedAt: null },
      include: {
        websites: {
          where: { isPrimary: true, deletedAt: null },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found or accessible.');
    }

    const primaryWebsite = project.websites[0];
    if (!primaryWebsite) {
      throw new NotFoundException('Project does not have a primary website configured.');
    }

    const scan = await this.prisma.scan.create({
      data: {
        projectId,
        websiteId: primaryWebsite.id,
        status: 'QUEUED',
        createdBy: userId,
      },
    });

    // Enqueue website crawl background job
    await this.crawlerService.enqueueWebsiteCrawl({
      scanId: scan.id,
      projectId,
      websiteId: primaryWebsite.id,
      url: primaryWebsite.url,
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'SCAN_STARTED',
      ipAddress,
      userAgent,
      metadata: { scanId: scan.id, projectId, websiteUrl: primaryWebsite.url },
    });

    return scan;
  }

  async getOrganizationScans(organizationId: string) {
    return this.prisma.scan.findMany({
      where: {
        project: { organizationId },
        deletedAt: null,
      },
      include: {
        project: {
          select: { id: true, name: true, primaryDomain: true },
        },
        website: {
          select: { id: true, url: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getScanDetails(scanId: string) {
    const scan = await this.prisma.scan.findUnique({
      where: { id: scanId },
      include: {
        project: { select: { id: true, name: true, organizationId: true } },
        website: { select: { id: true, url: true, domain: true } },
        _count: {
          select: {
            pages: true,
            assets: true,
            technologies: true,
            securityFindings: true,
          },
        },
      },
    });

    if (!scan || scan.deletedAt) {
      throw new NotFoundException('Scan not found.');
    }

    return scan;
  }

  async getScanPages(scanId: string) {
    await this.getScanDetails(scanId);
    return this.prisma.scanPage.findMany({
      where: { scanId },
      select: {
        id: true,
        url: true,
        statusCode: true,
        contentType: true,
        title: true,
        metaDescription: true,
        wordCount: true,
        readingTime: true,
        language: true,
        canonicalUrl: true,
        depth: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getScanMetadata(scanId: string) {
    await this.getScanDetails(scanId);
    return this.prisma.scanMetadata.findMany({
      where: { scanPage: { scanId } },
      include: {
        scanPage: { select: { url: true, title: true } },
      },
    });
  }

  async getScanStructuredData(scanId: string) {
    await this.getScanDetails(scanId);
    return this.prisma.structuredData.findMany({
      where: { scanPage: { scanId } },
      include: {
        scanPage: { select: { url: true, title: true } },
      },
    });
  }

  async getScanTechnologies(scanId: string) {
    await this.getScanDetails(scanId);
    return this.prisma.technology.findMany({
      where: { scanId },
      include: {
        scanPage: { select: { url: true } },
      },
    });
  }
}
