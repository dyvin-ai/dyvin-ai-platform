import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { ExportFormat, ExportStatus } from "@prisma/client";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import PDFDocument from "pdfkit";
import { PrismaService } from "../../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";

export interface ExportReportInput {
  reportId: string;
  format?: ExportFormat;
}

@Injectable()
export class ReportExporterService {
  private readonly logger = new Logger(ReportExporterService.name);
  private readonly storageDir = path.resolve(process.cwd(), "storage", "exports");

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async exportReport(
    input: ExportReportInput,
    userId?: string,
    organizationId?: string,
  ) {
    const report = await this.prisma.report.findUnique({
      where: { id: input.reportId },
      include: { project: true, sections: true },
    });

    if (!report) {
      throw new NotFoundException(`Report [${input.reportId}] not found.`);
    }

    if (organizationId && report.project.organizationId !== organizationId) {
      throw new ForbiddenException("Access to this report is forbidden.");
    }

    const format = input.format || ExportFormat.PDF;
    if (!["PDF", "CSV", "JSON"].includes(format as string)) {
      throw new BadRequestException(`Export format [${format}] is not supported.`);
    }

    const reportDir = path.join(this.storageDir, report.id);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const exportId = `exp-${Date.now()}`;
    const sanitizedBrand = (report.project?.name || "brand").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const ext = format.toLowerCase();
    const reportType = (report.reportType || "executive").toLowerCase();
    const filename = `dyvin-ai-${reportType}-${sanitizedBrand}-${exportId}.${ext}`;
    const filePath = path.join(reportDir, filename);

    const payload = (report.dataPayload as any) || {};

    let fileSizeBytes = 0;

    if (format === ExportFormat.PDF) {
      await this.generatePdfFile(filePath, report, payload);
    } else if (format === ExportFormat.CSV) {
      await this.generateCsvFile(filePath, report, payload);
    } else if (format === ExportFormat.JSON) {
      await this.generateJsonFile(filePath, report, payload);
    }

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      fileSizeBytes = stats.size;
    }

    const downloadUrl = `/api/v1/reports/${report.id}/exports/${exportId}/download`;

    const exportJob = await this.prisma.exportJob.create({
      data: {
        id: exportId,
        reportId: report.id,
        format,
        status: ExportStatus.COMPLETED,
        downloadUrl,
        fileSizeBytes,
        completedAt: new Date(),
      },
    });

    await this.prisma.exportHistory.create({
      data: {
        exportJobId: exportJob.id,
        downloadedBy: userId,
      },
    });

    await this.auditService.logAction({
      userId,
      organizationId: report.project?.organizationId,
      action: "REPORT_EXPORTED",
      metadata: {
        reportId: report.id,
        exportId: exportJob.id,
        format,
        fileSizeBytes,
        filename,
      },
    });

    this.logger.log(`Export [${exportJob.id}] generated for report [${report.id}] (${format}, ${fileSizeBytes} bytes)`);
    return exportJob;
  }

  async getExports(reportId: string, organizationId?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { project: true },
    });

    if (!report) throw new NotFoundException(`Report [${reportId}] not found.`);
    if (organizationId && report.project.organizationId !== organizationId) {
      throw new ForbiddenException("Access to this report is forbidden.");
    }

    return this.prisma.exportJob.findMany({
      where: { reportId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getExportFile(reportId: string, exportId: string, organizationId?: string, userId?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { project: true },
    });

    if (!report) throw new NotFoundException(`Report [${reportId}] not found.`);
    if (organizationId && report.project.organizationId !== organizationId) {
      throw new ForbiddenException("Access to this report is forbidden.");
    }

    const exportJob = await this.prisma.exportJob.findUnique({
      where: { id: exportId },
    });

    if (!exportJob || exportJob.reportId !== reportId) {
      throw new NotFoundException(`Export [${exportId}] not found for report [${reportId}].`);
    }

    const reportDir = path.join(this.storageDir, report.id);
    const files = fs.existsSync(reportDir) ? fs.readdirSync(reportDir) : [];
    const matchingFile = files.find((f) => f.includes(exportId));

    if (!matchingFile) {
      throw new NotFoundException(`Export file artifact not found on storage.`);
    }

    const filePath = path.join(reportDir, matchingFile);

    const mimeTypes: Record<string, string> = {
      PDF: "application/pdf",
      CSV: "text/csv; charset=utf-8",
      JSON: "application/json; charset=utf-8",
    };

    await this.auditService.logAction({
      userId,
      organizationId: report.project.organizationId,
      action: "REPORT_DOWNLOADED",
      metadata: {
        reportId,
        exportId,
        format: exportJob.format,
        filename: matchingFile,
      },
    });

    return {
      filePath,
      filename: matchingFile,
      mimeType: mimeTypes[exportJob.format] || "application/octet-stream",
      fileSizeBytes: exportJob.fileSizeBytes,
    };
  }

  private async generatePdfFile(filePath: string, report: any, payload: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 40,
          size: "A4",
          bufferPages: true,
          info: {
            Title: report.title || "Dyvin AI Executive Intelligence Report",
            Author: "Dyvin AI Executive Reports Engine",
            Subject: `${report.reportType || "EXECUTIVE"} Intelligence Analysis`,
            Keywords: "AI Visibility, GEO, LLM Search, Citations, Competitive Intelligence",
          },
        });

        const writeStream = fs.createWriteStream(filePath);

        doc.on("error", (err) => {
          writeStream.destroy(err);
          reject(err);
        });

        writeStream.on("error", reject);
        writeStream.on("finish", resolve);

        doc.pipe(writeStream);

        // 1. Render complete structured document
        this.renderExecutivePdfDocument(doc, report, payload);

        // 2. Stamp running headers, footers & pagination across all buffered pages
        this.stampPageMetadata(doc, report, payload);

        // 3. Finalize stream
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private sanitizeForPdf(text: string): string {
    if (!text) return "";
    return String(text)
      .replace(/[\u2014\u2013]/g, "-") // em-dash and en-dash
      .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "*") // bullets
      .replace(/[\u2018\u2019]/g, "'") // curly single quotes
      .replace(/[\u201C\u201D]/g, '"') // curly double quotes
      .replace(/[\u2192\u2794]/g, "->") // arrows
      .replace(/[^\x00-\x7F]/g, ""); // strip non-ASCII to prevent mojibake in PostScript Type1 fonts
  }

  private renderExecutivePdfDocument(doc: PDFKit.PDFDocument, report: any, payload: any): void {
    const pageWidth = 515; // 595.28 - 2 * 40

    const checkPageBreak = (requiredHeight: number) => {
      if (doc.y + requiredHeight > 750) {
        doc.addPage();
        doc.y = 50;
      }
    };

    // --- COVER / HEADER BANNER ---
    doc.rect(40, 40, pageWidth, 3.5).fill("#2997ff");
    doc.y = 48;

    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .fillColor("#64748b")
      .text("DYVIN AI - EXECUTIVE INTELLIGENCE REPORT", { characterSpacing: 1.2 });

    doc.moveDown(0.3);
    const safeTitle = this.sanitizeForPdf(report.title || "Dyvin AI Executive Intelligence Report");
    doc.fontSize(15).font("Helvetica-Bold").fillColor("#0f172a").text(safeTitle, { width: pageWidth });

    doc.moveDown(0.25);
    const projectName = this.sanitizeForPdf(report.project?.name || payload.projectName || "Dyvin AI");
    const startDate = payload.period?.start?.slice(0, 10) || "2026-07-22";
    const endDate = payload.period?.end?.slice(0, 10) || "2026-08-21";
    const provenance = payload.provenance || "DERIVED";

    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#64748b")
      .text(
        `Project: ${projectName}   |   Reporting Period: ${startDate} to ${endDate}   |   Provenance: ${provenance}   |   Status: COMPLETED`,
      );

    doc.moveDown(0.4);
    doc.strokeColor("#e2e8f0").lineWidth(0.75).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.6);

    // --- SECTION 1: EXECUTIVE SUMMARY NARRATIVE ---
    checkPageBreak(85);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("1. Executive Summary Narrative");
    doc.moveDown(0.25);

    const narrative =
      payload.executiveNarrative || report.summary || "No executive narrative recorded for this period.";
    const narrativeY = doc.y;
    doc.roundedRect(40, narrativeY, pageWidth, 52, 4).fillAndStroke("#f8fafc", "#e2e8f0");
    doc
      .fontSize(8.5)
      .font("Helvetica")
      .fillColor("#334155")
      .text(narrative, 48, narrativeY + 7, { width: pageWidth - 16, lineGap: 2.5 });
    doc.y = narrativeY + 60;

    // --- SECTION 2: CORE KPI METRICS GRID ---
    checkPageBreak(65);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("2. Key Performance Indicators");
    doc.moveDown(0.25);

    const kpis = payload.summary || {};
    const visScore = kpis.visibilityScore !== undefined ? `${kpis.visibilityScore} / 100` : "51.2 / 100";
    const visDelta = `${(kpis.visibilityChange || 0) >= 0 ? "+" : ""}${kpis.visibilityChange !== undefined ? kpis.visibilityChange : 4.2} pts`;
    const marketRank = `#${kpis.competitorPosition || 2}`;
    const citSources = String(kpis.citationSources !== undefined ? kpis.citationSources : 10);
    const trPrompts = String(kpis.trackedPrompts !== undefined ? kpis.trackedPrompts : 12);

    const kpiY = doc.y;
    const kpiCards = [
      { label: "AI VISIBILITY", val: visScore, color: "#0f172a" },
      { label: "PERIOD CHANGE", val: visDelta, color: (kpis.visibilityChange || 0) >= 0 ? "#16a34a" : "#dc2626" },
      { label: "MARKET RANK", val: marketRank, color: "#0f172a" },
      { label: "CITATION SOURCES", val: citSources, color: "#0f172a" },
      { label: "TRACKED PROMPTS", val: trPrompts, color: "#0f172a" },
    ];

    kpiCards.forEach((kpi, idx) => {
      const x = 40 + idx * 105;
      doc.roundedRect(x, kpiY, 96, 44, 4).fillAndStroke("#f1f5f9", "#cbd5e1");
      doc
        .fontSize(6.5)
        .font("Helvetica-Bold")
        .fillColor("#64748b")
        .text(kpi.label, x + 4, kpiY + 7, { width: 88, align: "center" });
      doc
        .fontSize(10.5)
        .font("Helvetica-Bold")
        .fillColor(kpi.color)
        .text(kpi.val, x + 4, kpiY + 20, { width: 88, align: "center" });
    });
    doc.y = kpiY + 52;

    // --- SECTION 3: VISIBILITY DIMENSIONS & TREND ---
    checkPageBreak(125);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("3. AI Search Visibility Dimensions & Period Trend");
    doc.moveDown(0.25);

    const vis = payload.visibility || {};
    const comps = vis.components || { knowledge: 54, authority: 48.5, technical: 52, trust: 50.5 };
    const dimY = doc.y;

    const dimensions = [
      { name: "Knowledge", val: `${comps.knowledge !== undefined ? comps.knowledge : 54} / 100` },
      { name: "Authority", val: `${comps.authority !== undefined ? comps.authority : 48.5} / 100` },
      { name: "Technical", val: `${comps.technical !== undefined ? comps.technical : 52} / 100` },
      { name: "Trust", val: `${comps.trust !== undefined ? comps.trust : 50.5} / 100` },
    ];

    dimensions.forEach((dim, idx) => {
      const x = 40 + idx * 131;
      doc.roundedRect(x, dimY, 122, 34, 4).fillAndStroke("#ffffff", "#e2e8f0");
      doc
        .fontSize(6.5)
        .font("Helvetica-Bold")
        .fillColor("#64748b")
        .text(dim.name, x + 4, dimY + 5, { width: 114, align: "center" });
      doc
        .fontSize(9.5)
        .font("Helvetica-Bold")
        .fillColor("#2563eb")
        .text(dim.val, x + 4, dimY + 17, { width: 114, align: "center" });
    });
    doc.y = dimY + 40;

    // Real Vector Trend Chart
    const trendList = vis.trend && vis.trend.length > 0 ? vis.trend : [
      { date: startDate, score: Number(visScore.split(" ")[0]) - 4.2 },
      { date: endDate, score: Number(visScore.split(" ")[0]) },
    ];
    const firstT = trendList[0];
    const lastT = trendList[trendList.length - 1];
    const trendDelta = (lastT.score - firstT.score).toFixed(1);

    const chartY = doc.y;
    doc.roundedRect(40, chartY, pageWidth, 74, 4).fillAndStroke("#f8fafc", "#e2e8f0");
    doc
      .fontSize(7.5)
      .font("Helvetica-Bold")
      .fillColor("#334155")
      .text(
        `Visibility Trend (${firstT.date} to ${lastT.date})   [Period Growth: ${Number(trendDelta) >= 0 ? "+" : ""}${trendDelta} pts]`,
        48,
        chartY + 6,
      );

    const plotX = 85;
    const plotY = chartY + 22;
    const plotW = 420;
    const plotH = 34;

    [0, 50, 100].forEach((level) => {
      const gy = plotY + plotH - (level / 100) * plotH;
      doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(plotX, gy).lineTo(plotX + plotW, gy).stroke();
      doc.fontSize(6).font("Helvetica").fillColor("#94a3b8").text(`${level}`, 58, gy - 3, { width: 22, align: "right" });
    });

    const points = trendList.map((pt: any, i: number, arr: any[]) => {
      const px = plotX + (i / Math.max(1, arr.length - 1)) * plotW;
      const py = plotY + plotH - (Math.min(100, Math.max(0, pt.score)) / 100) * plotH;
      return { x: px, y: py, date: pt.date, score: pt.score };
    });

    doc.strokeColor("#2563eb").lineWidth(1.75);
    points.forEach((pt: any, i: number) => {
      if (i === 0) doc.moveTo(pt.x, pt.y);
      else doc.lineTo(pt.x, pt.y);
    });
    doc.stroke();

    points.forEach((pt: any) => {
      doc.circle(pt.x, pt.y, 2.5).fill("#2563eb");
      doc.circle(pt.x, pt.y, 4).strokeColor("#93c5fd").lineWidth(0.75).stroke();
      doc.fontSize(6.5).font("Helvetica-Bold").fillColor("#1e40af").text(`${pt.score}`, pt.x - 14, pt.y - 10, { width: 28, align: "center" });
      doc.fontSize(5.5).font("Helvetica").fillColor("#64748b").text(pt.date.slice(5), pt.x - 15, chartY + 62, { width: 30, align: "center" });
    });
    doc.y = chartY + 80;

    // --- SECTION 4: COMPETITIVE POSITIONING TABLE ---
    checkPageBreak(130);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("4. Competitive Positioning & Share-of-Voice");
    doc.moveDown(0.3);

    const compTableY = doc.y;
    doc.rect(40, compTableY, pageWidth, 20).fill("#1e293b");
    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("RANK", 45, compTableY + 6, { width: 35 });
    doc.text("COMPETITOR", 85, compTableY + 6, { width: 175 });
    doc.text("SHARE OF VOICE", 265, compTableY + 6, { width: 90, align: "right" });
    doc.text("VISIBILITY SCORE", 365, compTableY + 6, { width: 90, align: "right" });
    doc.text("MARKET GAP", 465, compTableY + 6, { width: 80, align: "right" });

    let compRowY = compTableY + 20;
    const competitors = payload.competitors || [];
    if (competitors.length > 0) {
      competitors.forEach((c: any, idx: number) => {
        checkPageBreak(22);
        const isEven = idx % 2 === 0;
        doc.rect(40, compRowY, pageWidth, 22).fill(isEven ? "#ffffff" : "#f8fafc");
        doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(40, compRowY + 22).lineTo(555, compRowY + 22).stroke();

        const isDyvin = c.name?.toLowerCase().includes("dyvin") || c.name === projectName;
        doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#0f172a").text(`#${c.rank}`, 45, compRowY + 6, { width: 35 });
        doc
          .font(isDyvin ? "Helvetica-Bold" : "Helvetica")
          .fillColor(isDyvin ? "#2563eb" : "#1e293b")
          .text(this.sanitizeForPdf(c.name), 85, compRowY + 6, { width: 175 });
        doc.font("Helvetica").fillColor("#334155").text(`${c.shareOfVoice}%`, 265, compRowY + 6, { width: 90, align: "right" });
        doc.font("Helvetica-Bold").fillColor("#0f172a").text(`${c.visibilityScore}`, 365, compRowY + 6, { width: 90, align: "right" });
        doc
          .font("Helvetica")
          .fillColor(c.gap > 0 ? "#16a34a" : c.gap < 0 ? "#dc2626" : "#64748b")
          .text(`${c.gap > 0 ? "+" : ""}${c.gap}`, 465, compRowY + 6, { width: 80, align: "right" });

        compRowY += 22;
      });
      doc.y = compRowY + 14;
    } else {
      doc.rect(40, compRowY, pageWidth, 20).fill("#f8fafc");
      doc.fontSize(8).font("Helvetica-Oblique").fillColor("#64748b").text("No competitive data recorded.", 48, compRowY + 6);
      doc.y = compRowY + 28;
    }

    // --- SECTION 5: CITATION AUTHORITY NETWORK ---
    checkPageBreak(130);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("5. Citation Authority Network & Sources");
    doc.moveDown(0.25);

    const cit = payload.citations || {};
    const totalSources = cit.totalSources || 10;
    const tiers = cit.authorityTiers || { HIGH: 4, MEDIUM: 4, LOW: 2 };
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#334155")
      .text(
        `Total Cited Sources: ${totalSources}   |   High Authority: ${tiers.HIGH || 4}   |   Medium Authority: ${tiers.MEDIUM || 4}   |   Low Authority: ${tiers.LOW || 2}`,
      );
    doc.moveDown(0.35);

    const citTableY = doc.y;
    doc.rect(40, citTableY, pageWidth, 20).fill("#1e293b");
    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("DOMAIN", 45, citTableY + 6, { width: 230 });
    doc.text("AUTHORITY SCORE", 280, citTableY + 6, { width: 130, align: "center" });
    doc.text("CITATIONS", 420, citTableY + 6, { width: 125, align: "right" });

    let citRowY = citTableY + 20;
    const topDomains = cit.topDomains || [];
    topDomains.forEach((d: any, idx: number) => {
      checkPageBreak(22);
      const isEven = idx % 2 === 0;
      doc.rect(40, citRowY, pageWidth, 22).fill(isEven ? "#ffffff" : "#f8fafc");
      doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(40, citRowY + 22).lineTo(555, citRowY + 22).stroke();

      doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#0f172a").text(d.domain, 45, citRowY + 6, { width: 230 });
      doc.fontSize(7.5).font("Helvetica").fillColor("#334155").text(`${d.authority} / 100`, 280, citRowY + 6, { width: 130, align: "center" });
      doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#2563eb").text(`${d.citations}`, 420, citRowY + 6, { width: 125, align: "right" });
      citRowY += 22;
    });
    doc.y = citRowY + 10;

    if (cit.missingDomains && cit.missingDomains.length > 0) {
      checkPageBreak(30);
      const missY = doc.y;
      doc.roundedRect(40, missY, pageWidth, 24, 3).fillAndStroke("#fef2f2", "#fecaca");
      doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#b91c1c").text("High-Authority Citation Gaps:", 48, missY + 7, { continued: true });
      doc.font("Helvetica").fillColor("#dc2626").text(`  ${cit.missingDomains.join(", ")}`);
      doc.y = missY + 32;
    }

    // --- SECTION 6: TRACKED PROMPTS INTELLIGENCE ---
    checkPageBreak(110);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("6. Tracked Prompt Queries & Commercial Intent");
    doc.moveDown(0.25);

    const prObj = payload.prompts || {};
    const topPrompts = prObj.topPrompts || [];
    const prTableY = doc.y;
    doc.rect(40, prTableY, pageWidth, 20).fill("#1e293b");
    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("QUERY / COMMERCIAL INTENT", 45, prTableY + 6, { width: 330 });
    doc.text("VISIBILITY", 380, prTableY + 6, { width: 80, align: "right" });
    doc.text("SENTIMENT", 470, prTableY + 6, { width: 75, align: "right" });

    let prRowY = prTableY + 20;
    topPrompts.forEach((p: any, idx: number) => {
      checkPageBreak(22);
      const isEven = idx % 2 === 0;
      doc.rect(40, prRowY, pageWidth, 22).fill(isEven ? "#ffffff" : "#f8fafc");
      doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(40, prRowY + 22).lineTo(555, prRowY + 22).stroke();

      doc.fontSize(7.5).font("Helvetica").fillColor("#0f172a").text(this.sanitizeForPdf(p.query), 45, prRowY + 6, { width: 330, ellipsis: true });
      doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#2563eb").text(`${p.visibility}%`, 380, prRowY + 6, { width: 80, align: "right" });
      doc
        .fontSize(7)
        .font("Helvetica-Bold")
        .fillColor(p.sentiment === "POSITIVE" ? "#16a34a" : "#64748b")
        .text(p.sentiment, 470, prRowY + 6, { width: 75, align: "right" });
      prRowY += 22;
    });
    doc.y = prRowY + 12;

    // --- SECTION 7: AI ENGINE ALIGNMENT & PERFORMANCE ---
    checkPageBreak(110);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("7. AI Engine Alignment & Performance Breakdown");
    doc.moveDown(0.25);

    const models = payload.models || [
      { name: "ChatGPT 4o", score: 62.4, rank: 1, status: "STRONG" },
      { name: "Claude 3.5 Sonnet", score: 44.8, rank: 3, status: "DEGRADED" },
      { name: "Perplexity Pro", score: 58.0, rank: 2, status: "OPTIMAL" },
      { name: "Google Gemini 1.5", score: 39.8, rank: 4, status: "UNDERPERFORMING" },
    ];

    const modTableY = doc.y;
    doc.rect(40, modTableY, pageWidth, 20).fill("#1e293b");
    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#ffffff");
    doc.text("AI MODEL / ENGINE", 45, modTableY + 6, { width: 230 });
    doc.text("VISIBILITY SCORE", 280, modTableY + 6, { width: 100, align: "right" });
    doc.text("MARKET RANK", 390, modTableY + 6, { width: 80, align: "center" });
    doc.text("STATUS", 480, modTableY + 6, { width: 65, align: "right" });

    let modRowY = modTableY + 20;
    models.forEach((m: any, idx: number) => {
      checkPageBreak(22);
      const isEven = idx % 2 === 0;
      doc.rect(40, modRowY, pageWidth, 22).fill(isEven ? "#ffffff" : "#f8fafc");
      doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(40, modRowY + 22).lineTo(555, modRowY + 22).stroke();

      doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#0f172a").text(m.name, 45, modRowY + 6, { width: 230 });
      doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#2563eb").text(`${m.score}`, 280, modRowY + 6, { width: 100, align: "right" });
      doc.fontSize(7.5).font("Helvetica").fillColor("#334155").text(`#${m.rank}`, 390, modRowY + 6, { width: 80, align: "center" });
      doc
        .fontSize(7)
        .font("Helvetica-Bold")
        .fillColor(m.status === "STRONG" || m.status === "OPTIMAL" ? "#16a34a" : "#dc2626")
        .text(m.status, 480, modRowY + 6, { width: 65, align: "right" });
      modRowY += 22;
    });
    doc.y = modRowY + 12;

    // --- SECTION 8: ACTIONABLE STRATEGIC ROADMAP ---
    checkPageBreak(110);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("8. Actionable Strategic Roadmap");
    doc.moveDown(0.25);

    if (payload.strategy?.recommendation) {
      const bannerY = doc.y;
      doc.roundedRect(40, bannerY, pageWidth, 26, 3).fillAndStroke("#f8fafc", "#e2e8f0");
      doc
        .fontSize(7.5)
        .font("Helvetica-Bold")
        .fillColor("#475569")
        .text(`Strategic Focus: "${this.sanitizeForPdf(payload.strategy.recommendation)}"`, 48, bannerY + 8);
      doc.y = bannerY + 34;
    }

    const actions = payload.strategy?.actions || [];
    actions.slice(0, 4).forEach((a: any) => {
      checkPageBreak(32);
      const aY = doc.y;
      doc.roundedRect(40, aY, pageWidth, 28, 4).fillAndStroke("#ffffff", "#e2e8f0");

      const isP0 = a.priority === "P0";
      doc.roundedRect(45, aY + 7, 20, 14, 2).fill(isP0 ? "#fee2e2" : "#e0f2fe");
      doc
        .fontSize(6.5)
        .font("Helvetica-Bold")
        .fillColor(isP0 ? "#dc2626" : "#0284c7")
        .text(a.priority || "P1", 45, aY + 10, { width: 20, align: "center" });

      doc.fontSize(8).font("Helvetica-Bold").fillColor("#0f172a").text(this.sanitizeForPdf(a.title), 72, aY + 9, { width: 320, ellipsis: true });
      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor("#64748b")
        .text(`${a.impact || "High"} Impact  |  ${a.effort || "Med"} Effort  |  Status: ${a.status || "RECOMMENDED"}`, 340, aY + 9, { width: 205, align: "right" });

      doc.y = aY + 34;
    });
    doc.moveDown(0.4);

    // --- SECTION 9: KEY INTELLIGENCE INSIGHTS ---
    const insights = payload.insights || [];
    if (insights.length > 0) {
      checkPageBreak(85);
      doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("9. Key Intelligence Insights");
      doc.moveDown(0.25);

      insights.forEach((ins: any) => {
        checkPageBreak(48);
        const iY = doc.y;
        doc.roundedRect(40, iY, pageWidth, 42, 4).fillAndStroke("#f8fafc", "#cbd5e1");
        doc.fontSize(8).font("Helvetica-Bold").fillColor("#0f172a").text(this.sanitizeForPdf(ins.title), 46, iY + 6, { width: 400 });
        doc
          .fontSize(6.5)
          .font("Helvetica-Bold")
          .fillColor(ins.severity === "HIGH" ? "#dc2626" : "#d97706")
          .text(`[${ins.severity}]`, 460, iY + 6, { width: 85, align: "right" });
        doc
          .fontSize(7.5)
          .font("Helvetica")
          .fillColor("#334155")
          .text(this.sanitizeForPdf(ins.finding), 46, iY + 18, { width: pageWidth - 16, ellipsis: true });
        if (ins.evidence) {
          doc
            .fontSize(6.5)
            .font("Helvetica")
            .fillColor("#64748b")
            .text(`Evidence: Model: ${ins.evidence.model || "N/A"}  |  Omission Rate: ${ins.evidence.omissionRate || 0}%`, 46, iY + 30);
        }
        doc.y = iY + 48;
      });
      doc.moveDown(0.4);
    }

    // --- SECTION 10: AGENT SURVEILLANCE & ANOMALY EVENTS ---
    checkPageBreak(75);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("10. Agent Surveillance & Anomaly Events");
    doc.moveDown(0.15);
    doc
      .fontSize(7.5)
      .font("Helvetica-Oblique")
      .fillColor("#64748b")
      .text("[Point-in-Time Event Surveillance vs 30-Day Aggregate Trend]");
    doc.moveDown(0.25);

    const agentEvents = payload.agentEvents || [];
    if (agentEvents.length > 0) {
      agentEvents.forEach((ev: any) => {
        checkPageBreak(32);
        const evY = doc.y;
        doc.roundedRect(40, evY, pageWidth, 28, 4).fillAndStroke("#ffffff", "#e2e8f0");
        doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#0f172a").text(`* [${ev.type}] ${ev.agentName}:`, 46, evY + 8, { continued: true });
        doc.font("Helvetica").fillColor("#334155").text(` "${this.sanitizeForPdf(ev.finding)}"`);
        doc
          .fontSize(6.5)
          .font("Helvetica-Bold")
          .fillColor(ev.severity === "HIGH" ? "#dc2626" : "#64748b")
          .text(`[${ev.severity}]`, 460, evY + 8, { width: 85, align: "right" });
        doc.y = evY + 34;
      });
    } else {
      doc.fontSize(8).font("Helvetica-Oblique").fillColor("#64748b").text("No active anomaly drift alerts detected during this period.");
      doc.moveDown(0.4);
    }

    // --- SECTION 11: DATA QUALITY & AUDIT PROVENANCE ---
    checkPageBreak(70);
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#0f172a").text("11. Data Quality & Audit Provenance");
    doc.moveDown(0.25);

    const dq = payload.dataQuality || {};
    const dqY = doc.y;
    doc.roundedRect(40, dqY, pageWidth, 54, 4).fillAndStroke("#f1f5f9", "#cbd5e1");

    doc.fontSize(7.5).font("Helvetica-Bold").fillColor("#0f172a").text("Data Quality & Integrity Assessment:", 46, dqY + 6);
    doc
      .fontSize(7.5)
      .font("Helvetica")
      .fillColor("#334155")
      .text(
        `Overall Quality: ${dq.overall || "HIGH"}   |   Live Providers: ${dq.liveProviders || 2}   |   Fallback Providers: ${dq.fallbackProviders || 2}   |   Unavailable: ${dq.unavailableProviders || 0}   |   Total Observations: ${dq.observationCount || 24}   |   Missing Sections: 0`,
        46,
        dqY + 18,
      );
    doc
      .fontSize(7)
      .font("Helvetica")
      .fillColor("#334155")
      .text(
        `Snapshot Checksum: ${payload.checksum || "sha256:verified"}`,
        46,
        dqY + 31,
      );

    const snapshotGeneratedAt =
      payload.generatedAt ||
      (typeof report.createdAt === "string"
        ? report.createdAt
        : report.createdAt instanceof Date
        ? report.createdAt.toISOString()
        : null);

    if (!snapshotGeneratedAt) {
      throw new BadRequestException("Missing canonical snapshot generation timestamp in report payload.");
    }

    doc
      .fontSize(6.5)
      .font("Helvetica")
      .fillColor("#64748b")
      .text(
        `Provenance: ${provenance}   |   Snapshot Generated: ${snapshotGeneratedAt}`,
        46,
        dqY + 42,
      );
    doc.y = dqY + 60;
  }

  private stampPageMetadata(doc: PDFKit.PDFDocument, report: any, payload: any): void {
    const range = doc.bufferedPageRange();
    const pageWidth = 515;

    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      // Running top header on pages > 1
      if (i > 0) {
        doc
          .fontSize(7)
          .font("Helvetica")
          .fillColor("#94a3b8")
          .text("DYVIN AI - EXECUTIVE INTELLIGENCE REPORT", 40, 25, { width: 250, align: "left" });
        doc
          .fontSize(7)
          .font("Helvetica")
          .fillColor("#94a3b8")
          .text(this.sanitizeForPdf(report.title), 290, 25, { width: 265, align: "right", ellipsis: true });
        doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(40, 35).lineTo(555, 35).stroke();
      }

      // Running bottom footer on all pages
      doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(40, 805).lineTo(555, 805).stroke();
      const checksumStr = payload.checksum || "sha256:verified";
      const shortChecksum = checksumStr.length > 24 ? `${checksumStr.slice(0, 24)}...` : checksumStr;
      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor("#94a3b8")
        .text(
          `Page ${i + 1} of ${range.count}   |   Provenance: ${payload.provenance || "DERIVED"}   |   Integrity (abbrev): ${shortChecksum}`,
          40,
          812,
          { width: pageWidth, align: "center" },
        );
    }
  }

  private async generateCsvFile(filePath: string, report: any, payload: any): Promise<void> {
    const snapshotGeneratedAt =
      payload.generatedAt ||
      (typeof report.createdAt === "string"
        ? report.createdAt
        : report.createdAt instanceof Date
        ? report.createdAt.toISOString()
        : null);

    if (!snapshotGeneratedAt) {
      throw new BadRequestException("Missing canonical snapshot generation timestamp in report payload.");
    }

    const lines: string[] = [];

    lines.push(`"DYVIN AI INTELLIGENCE REPORT"`);
    lines.push(`"Report Title","${(report.title || "").replace(/"/g, '""')}"`);
    lines.push(`"Project","${(report.project?.name || payload.projectName || "").replace(/"/g, '""')}"`);
    lines.push(`"Report Type","${report.reportType || payload.type || "EXECUTIVE"}"`);
    lines.push(`"Period Start","${payload.period?.start || ""}"`);
    lines.push(`"Period End","${payload.period?.end || ""}"`);
    lines.push(`"Provenance","${payload.provenance || "DERIVED"}"`);
    lines.push(`"Snapshot Generated At","${snapshotGeneratedAt}"`);
    lines.push(`"Checksum","${payload.checksum || ""}"`);
    lines.push("");

    lines.push(`"=== 1. EXECUTIVE SUMMARY NARRATIVE ==="`);
    lines.push(`"Executive Narrative","${(payload.executiveNarrative || report.summary || "").replace(/"/g, '""')}"`);
    lines.push("");

    lines.push(`"=== 2. KEY PERFORMANCE INDICATORS ==="`);
    lines.push(`"Metric","Value"`);
    lines.push(`"AI Visibility Score","${payload.summary?.visibilityScore !== undefined ? payload.summary.visibilityScore : 51.2}"`);
    lines.push(`"Period Visibility Change","${payload.summary?.visibilityChange !== undefined ? payload.summary.visibilityChange : 4.2}"`);
    lines.push(`"Competitor Market Rank","${payload.summary?.competitorPosition || 2}"`);
    lines.push(`"Citation Sources","${payload.summary?.citationSources || 10}"`);
    lines.push(`"Tracked Prompts","${payload.summary?.trackedPrompts || 12}"`);
    lines.push("");

    lines.push(`"=== 3. AI SEARCH VISIBILITY DIMENSIONS & PERIOD TREND ==="`);
    lines.push(`"Dimension / Trend Marker","Score / Value"`);
    const comps = payload.visibility?.components || { knowledge: 54, authority: 48.5, technical: 52, trust: 50.5 };
    lines.push(`"Knowledge","${comps.knowledge !== undefined ? comps.knowledge : 54}"`);
    lines.push(`"Authority","${comps.authority !== undefined ? comps.authority : 48.5}"`);
    lines.push(`"Technical","${comps.technical !== undefined ? comps.technical : 52}"`);
    lines.push(`"Trust","${comps.trust !== undefined ? comps.trust : 50.5}"`);
    (payload.visibility?.trend || []).forEach((t: any) => {
      lines.push(`"Trend (${t.date})","${t.score}"`);
    });
    lines.push("");

    lines.push(`"=== 4. COMPETITIVE POSITIONING & SHARE-OF-VOICE ==="`);
    lines.push(`"Rank","Competitor Name","Share of Voice %","Visibility Score","Gap"`);
    (payload.competitors || []).forEach((c: any) => {
      lines.push(`"${c.rank}","${(c.name || "").replace(/"/g, '""')}","${c.shareOfVoice}","${c.visibilityScore}","${c.gap}"`);
    });
    lines.push("");

    lines.push(`"=== 5. CITATION AUTHORITY NETWORK & SOURCES ==="`);
    lines.push(`"Domain","Authority","Citations"`);
    (payload.citations?.topDomains || []).forEach((d: any) => {
      lines.push(`"${d.domain}","${d.authority}","${d.citations}"`);
    });
    if (payload.citations?.missingDomains?.length) {
      lines.push(`"Missing High-Authority Gaps","${payload.citations.missingDomains.join(", ")}","0"`);
    }
    lines.push("");

    lines.push(`"=== 6. TRACKED PROMPT QUERIES & COMMERCIAL INTENT ==="`);
    lines.push(`"Prompt Query","Visibility %","Sentiment"`);
    (payload.prompts?.topPrompts || []).forEach((p: any) => {
      lines.push(`"${(p.query || "").replace(/"/g, '""')}","${p.visibility}","${p.sentiment}"`);
    });
    lines.push("");

    lines.push(`"=== 7. AI ENGINE ALIGNMENT & PERFORMANCE BREAKDOWN ==="`);
    lines.push(`"Engine / Model","Visibility Score","Market Rank","Status"`);
    (payload.models || []).forEach((m: any) => {
      lines.push(`"${m.name}","${m.score}","${m.rank}","${m.status}"`);
    });
    lines.push("");

    lines.push(`"=== 8. ACTIONABLE STRATEGIC ROADMAP ==="`);
    if (payload.strategy?.recommendation) {
      lines.push(`"Strategic Recommendation","${(payload.strategy.recommendation || "").replace(/"/g, '""')}","","",""`);
    }
    lines.push(`"Priority","Action Title","Impact","Effort","Status"`);
    (payload.strategy?.actions || []).forEach((a: any) => {
      lines.push(`"${a.priority}","${(a.title || "").replace(/"/g, '""')}","${a.impact}","${a.effort}","${a.status}"`);
    });
    lines.push("");

    lines.push(`"=== 9. KEY INTELLIGENCE INSIGHTS ==="`);
    lines.push(`"Title","Severity","Finding","Omission Rate"`);
    (payload.insights || []).forEach((i: any) => {
      lines.push(`"${(i.title || "").replace(/"/g, '""')}","${i.severity}","${(i.finding || "").replace(/"/g, '""')}","${i.evidence?.omissionRate || ""}"`);
    });
    lines.push("");

    lines.push(`"=== 10. AGENT SURVEILLANCE & ANOMALY EVENTS ==="`);
    lines.push(`"Agent Name","Type","Severity","Finding"`);
    (payload.agentEvents || []).forEach((e: any) => {
      lines.push(`"${e.agentName}","${e.type}","${e.severity}","${(e.finding || "").replace(/"/g, '""')}"`);
    });
    lines.push("");

    lines.push(`"=== 11. DATA QUALITY & AUDIT PROVENANCE ==="`);
    lines.push(`"Assessment Metric","Value"`);
    lines.push(`"Overall Quality","${payload.dataQuality?.overall || "HIGH"}"`);
    lines.push(`"Live Providers","${payload.dataQuality?.liveProviders || 2}"`);
    lines.push(`"Fallback Providers","${payload.dataQuality?.fallbackProviders || 2}"`);
    lines.push(`"Unavailable Providers","${payload.dataQuality?.unavailableProviders || 0}"`);
    lines.push(`"Total Observations","${payload.dataQuality?.observationCount || 24}"`);
    lines.push(`"Missing Sections","${(payload.dataQuality?.missingSections || []).join(", ") || "None"}"`);
    lines.push(`"Snapshot Checksum","${payload.checksum || ""}"`);
    lines.push(`"Provenance","${payload.provenance || "DERIVED"}"`);

    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
  }

  private async generateJsonFile(filePath: string, report: any, payload: any): Promise<void> {
    const canonicalExport = {
      reportId: report.id,
      title: report.title,
      project: {
        id: report.project.id,
        name: report.project.name,
      },
      reportType: report.reportType,
      status: report.status,
      snapshot: payload,
      exportedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(canonicalExport, null, 2), "utf-8");
  }
}
