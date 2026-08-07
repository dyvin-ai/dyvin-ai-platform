export enum ReportType {
  EXECUTIVE = 'EXECUTIVE',
  TECHNICAL = 'TECHNICAL',
  KNOWLEDGE = 'KNOWLEDGE',
  VERIFICATION = 'VERIFICATION',
  FULL_AUDIT = 'FULL_AUDIT',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum ExportFormat {
  PDF = 'PDF',
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  JSON = 'JSON',
  MARKDOWN = 'MARKDOWN',
}

export enum ExportStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum WidgetType {
  LINE_CHART = 'LINE_CHART',
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
  HEATMAP = 'HEATMAP',
  METRIC_CARD = 'METRIC_CARD',
  TABLE = 'TABLE',
}

export interface ScoreCardItem {
  title: string;
  score: number;
  delta: number;
  status: 'EXCELLENT' | 'GOOD' | 'IMPROVING' | 'STABLE' | 'NEEDS_ATTENTION';
}

export interface ExecutiveDashboardData {
  projectId: string;
  projectName: string;
  overallScore: number;
  scoreCards: ScoreCardItem[];
  recentVerifications: Array<{
    id: string;
    targetUrl: string;
    passed: boolean;
    createdAt: string;
  }>;
  recentAutoFixAssets: Array<{
    id: string;
    contentType: string;
    title: string;
    createdAt: string;
  }>;
  updatedAt: string;
}

export interface WidgetPayload {
  id: string;
  title: string;
  type: WidgetType;
  data: {
    labels?: string[];
    series?: Array<{ name: string; data: number[] }>;
    categories?: string[];
    scores?: number[];
    values?: number[];
  };
}

export interface AnalyticsOverview {
  projectId: string;
  totalSnapshotsRecorded: number;
  currentMetrics: {
    overallScore: number;
    knowledgeScore: number;
    authorityScore: number;
    trustScore: number;
    technicalScore: number;
  };
  snapshots: Array<{
    id: string;
    snapshotDate: string;
    overallScore: number;
    knowledgeScore: number;
    authorityScore: number;
    trustScore: number;
    technicalScore: number;
  }>;
}

export interface TrendItem {
  trendType: string;
  growthPercentage: number;
  historicalData: Array<Record<string, any>>;
}

export interface ReportSection {
  id: string;
  title: string;
  orderIndex: number;
  contentBody: Record<string, any>;
}

export interface ReportItem {
  id: string;
  projectId: string;
  title: string;
  reportType: ReportType;
  status: ReportStatus;
  summary: string;
  generatedBy?: string;
  dataPayload?: Record<string, any>;
  sections?: ReportSection[];
  exports?: Array<{
    id: string;
    format: ExportFormat;
    status: ExportStatus;
    downloadUrl: string;
    fileSizeBytes: number;
    createdAt: string;
  }>;
  createdAt: string;
}

export interface GenerateReportRequest {
  projectId: string;
  reportType?: ReportType;
  title?: string;
}

export interface ExportReportRequest {
  reportId: string;
  format?: ExportFormat;
}

export interface ExportJobResult {
  id: string;
  reportId: string;
  format: ExportFormat;
  status: ExportStatus;
  downloadUrl: string;
  fileSizeBytes: number;
  completedAt: string;
}
