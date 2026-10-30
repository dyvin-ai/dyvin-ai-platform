import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CrawlerService } from '../crawler/crawler.service';
import { CrawlerSafetyService } from '../crawler/services/crawler-safety.service';

@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);
  private readonly crawlerSafety = new CrawlerSafetyService();


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
    customUrl?: string,
  ) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId, deletedAt: null },
      include: {
        websites: {
          where: { deletedAt: null },
          orderBy: { isPrimary: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found or accessible.');
    }

    let targetWebsite = project.websites.find((w) => w.isPrimary) || project.websites[0];

    if (customUrl && customUrl.trim()) {
      const rawUrl = customUrl.trim();
      const normalizedUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
        ? rawUrl
        : `https://${rawUrl}`;

      const safety = this.crawlerSafety.validateUrlSafety(normalizedUrl);
      if (!safety.isAllowed) {
        throw new BadRequestException(safety.reason || 'Unsafe URL target rejected.');
      }

      const parsed = new URL(normalizedUrl);
      const domain = parsed.hostname.toLowerCase();

      // Check if this website is already registered for this project
      const existing = project.websites.find(
        (w) => w.domain.toLowerCase() === domain || w.url.toLowerCase() === parsed.origin.toLowerCase(),
      );

      if (existing) {
        targetWebsite = existing;
      } else {
        targetWebsite = await this.prisma.website.create({
          data: {
            projectId,
            url: parsed.origin,
            domain,
            isPrimary: project.websites.length === 0,
          },
        });
      }
    }

    if (!targetWebsite) {
      throw new NotFoundException('Project does not have a primary website configured and no valid URL was provided.');
    }

    const websiteSafety = this.crawlerSafety.validateUrlSafety(targetWebsite.url);
    if (!websiteSafety.isAllowed) {
      throw new BadRequestException(websiteSafety.reason || 'Unsafe website URL rejected.');
    }


    const scan = await this.prisma.scan.create({
      data: {
        projectId,
        websiteId: targetWebsite.id,
        status: 'QUEUED',
        createdBy: userId,
      },
    });

    // Enqueue website crawl background job
    await this.crawlerService.enqueueWebsiteCrawl({
      scanId: scan.id,
      projectId,
      websiteId: targetWebsite.id,
      url: targetWebsite.url,
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'SCAN_STARTED',
      ipAddress,
      userAgent,
      metadata: { scanId: scan.id, projectId, websiteUrl: targetWebsite.url },
    });

    return scan;
  }

  async getOrganizationScans(organizationId: string, projectId?: string) {
    return this.prisma.scan.findMany({
      where: {
        project: {
          organizationId,
          ...(projectId ? { id: projectId } : {}),
        },
        deletedAt: null,
      },
      include: {
        project: {
          select: { id: true, name: true, primaryDomain: true },
        },
        website: {
          select: { id: true, url: true, domain: true },
        },
        _count: {
          select: {
            pages: true,
            assets: true,
            technologies: true,
            securityFindings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getScanDetails(scanId: string, organizationId?: string) {
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

    if (organizationId && scan.project.organizationId !== organizationId) {
      throw new NotFoundException('Scan not found.');
    }

    return scan;
  }

  async getScanPages(scanId: string, organizationId?: string) {
    await this.getScanDetails(scanId, organizationId);
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

  async getScanMetadata(scanId: string, organizationId?: string) {
    await this.getScanDetails(scanId, organizationId);
    return this.prisma.scanMetadata.findMany({
      where: { scanPage: { scanId } },
      include: {
        scanPage: { select: { url: true, title: true } },
      },
    });
  }

  async getScanStructuredData(scanId: string, organizationId?: string) {
    await this.getScanDetails(scanId, organizationId);
    return this.prisma.structuredData.findMany({
      where: { scanPage: { scanId } },
      include: {
        scanPage: { select: { url: true, title: true } },
      },
    });
  }

  async getScanTechnologies(scanId: string, organizationId?: string) {
    await this.getScanDetails(scanId, organizationId);
    return this.prisma.technology.findMany({
      where: { scanId },
      include: {
        scanPage: { select: { url: true } },
      },
    });
  }
}
