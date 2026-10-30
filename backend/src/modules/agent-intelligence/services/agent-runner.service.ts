import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { NotificationCategory, NotificationPriority } from "@prisma/client";
import { PrismaService } from "../../../database/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { NotificationEngineService } from "../../notification/services/notification-engine.service";
import { VisibilityScoreService } from "../../visibility-analytics/services/visibility-score.service";
import { VisibilityBaselineService } from "../../visibility-analytics/services/visibility-baseline.service";
import { CompetitorManagementService } from "../../competitor/services/competitor-management.service";
import { CitationAnalyticsService } from "../../citation/services/citation-analytics.service";
import { PromptLibraryService } from "../../ai-search/services/prompt-library.service";
import { RootCauseEngineService } from "../../strategy-intelligence/services/root-cause-engine.service";
import { StrategyEngineService } from "../../strategy-intelligence/services/strategy-engine.service";

export interface AgentRunResult {
  id: string;
  agentId: string;
  organizationId: string;
  projectId: string;
  status: "COMPLETED" | "FAILED" | "PARTIAL";
  progress: number;
  startedAt: string;
  completedAt: string;
  finding: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  evidence: Record<string, any>;
  recommendation: string;
  relatedRoute: string;
  relatedInsightId?: string;
  relatedStrategyActionId?: string;
  provenance: "LIVE" | "DETERMINISTIC_FALLBACK" | "DERIVED";
  notificationDispatched: boolean;
}

export interface AgentDefinition {
  id: string;
  name: string;
  type: "VISIBILITY" | "COMPETITOR" | "CITATION" | "PROMPT" | "MODEL" | "STRATEGY";
  description: string;
  schedule: string;
  icon: string;
  subject: string;
  enabled: boolean;
  status: "ACTIVE" | "PAUSED" | "ERROR" | "DRAFT";
  lastRunAt?: string;
  nextRunAt?: string;
  lastResult?: AgentRunResult | null;
  provenance: "LIVE" | "DETERMINISTIC_FALLBACK" | "DERIVED";
}

@Injectable()
export class AgentRunnerService {
  private readonly logger = new Logger(AgentRunnerService.name);

  // In-memory state caches for agent toggles, runs, and notification deduplication
  private agentStatusMap: Map<string, { enabled: boolean; status: "ACTIVE" | "PAUSED" }> = new Map();
  private agentRunHistory: Map<string, AgentRunResult[]> = new Map();
  private notificationDeduplicationMap: Map<string, number> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly notificationEngine: NotificationEngineService,
    private readonly visibilityScoreService: VisibilityScoreService,
    private readonly baselineService: VisibilityBaselineService,
    private readonly competitorService: CompetitorManagementService,
    private readonly citationService: CitationAnalyticsService,
    private readonly promptLibraryService: PromptLibraryService,
    private readonly rootCauseEngine: RootCauseEngineService,
    private readonly strategyEngine: StrategyEngineService,
  ) {}

  private getAgentKey(orgId: string, projectId: string, agentId: string): string {
    return `${orgId}:${projectId}:${agentId}`;
  }

  private async resolveScopedProject(organizationId: string, projectId?: string) {
    if (projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project) {
        throw new NotFoundException("Project not found.");
      }
      if (project.organizationId !== organizationId) {
        throw new ForbiddenException("Access denied: Project does not belong to active organization.");
      }
      return project;
    }

    const defaultProject = await this.prisma.project.findFirst({
      where: { organizationId },
      orderBy: { createdAt: "asc" },
    });
    return defaultProject;
  }

  /**
   * Returns list of configured intelligence agents for the scoped organization & project.
   */
  async getAgents(organizationId: string, projectId?: string, userId?: string): Promise<AgentDefinition[]> {
    const project = await this.resolveScopedProject(organizationId, projectId);
    if (!project) {
      return [];
    }

    const baselineState = await this.baselineService.getBaselineState(organizationId, project.id);
    const isMeasured = baselineState.status === "READY" || baselineState.status === "PARTIAL";

    const agentBlueprints: Array<Omit<AgentDefinition, "enabled" | "status" | "lastResult" | "lastRunAt" | "nextRunAt">> = [
      {
        id: "agent-vis-monitor",
        name: "Visibility Drift Monitor",
        type: "VISIBILITY",
        description: "Continuously tracks brand AI visibility score movements and detects abrupt model-specific drops.",
        schedule: "Every 24 hours",
        icon: "Radar",
        subject: "Overall AI Search Visibility",
        provenance: baselineState.provenance === "LIVE" ? "LIVE" : "DETERMINISTIC_FALLBACK",
      },
      {
        id: "agent-comp-watch",
        name: "Competitor Intelligence Watch",
        type: "COMPETITOR",
        description: "Monitors competitor share-of-voice gains, ranking changes, and generative overtake events.",
        schedule: "Every 12 hours",
        icon: "Users",
        subject: "Competitive Share-of-Voice",
        provenance: baselineState.provenance === "LIVE" ? "LIVE" : "DETERMINISTIC_FALLBACK",
      },
      {
        id: "agent-citation-watch",
        name: "Citation Authority Scout",
        type: "CITATION",
        description: "Detects new authoritative domain citations and identifies missing citation sources leveraged by rivals.",
        schedule: "Every 24 hours",
        icon: "Link2",
        subject: "Authoritative Citation Footprint",
        provenance: baselineState.provenance === "LIVE" ? "LIVE" : "DETERMINISTIC_FALLBACK",
      },
      {
        id: "agent-prompt-monitor",
        name: "Prompt Coverage Guardian",
        type: "PROMPT",
        description: "Tracks high-intent commercial evaluation queries and detects when the brand is unmentioned.",
        schedule: "Every 6 hours",
        icon: "MessageSquareText",
        subject: "High-Intent Query Coverage",
        provenance: baselineState.provenance === "LIVE" ? "LIVE" : "DETERMINISTIC_FALLBACK",
      },
      {
        id: "agent-model-monitor",
        name: "AI Model Alignment Monitor",
        type: "MODEL",
        description: "Monitors performance parity across ChatGPT, Claude, Gemini, and Perplexity to identify model bias.",
        schedule: "Every 12 hours",
        icon: "Cpu",
        subject: "Cross-Engine Disparity",
        provenance: baselineState.provenance === "LIVE" ? "LIVE" : "DETERMINISTIC_FALLBACK",
      },
      {
        id: "agent-strategy-monitor",
        name: "Strategy Opportunity Radar",
        type: "STRATEGY",
        description: "Synthesizes cross-engine visibility intelligence into prioritized P0/P1 strategic optimization moves.",
        schedule: "Every 6 hours",
        icon: "Compass",
        subject: "High-ROI Action Discovery",
        provenance: baselineState.provenance === "LIVE" ? "LIVE" : "DETERMINISTIC_FALLBACK",
      },
    ];

    const result: AgentDefinition[] = [];

    for (const bp of agentBlueprints) {
      const key = this.getAgentKey(organizationId, project.id, bp.id);
      const state = this.agentStatusMap.get(key) || { enabled: true, status: "ACTIVE" };
      const runs = this.agentRunHistory.get(key) || [];
      const latestRun = runs.length > 0 ? runs[0] : null;

      let lastResult: AgentRunResult | null = latestRun;

      // If no explicit run occurred yet, evaluate initial diagnostic state
      if (!lastResult) {
        if (isMeasured) {
          lastResult = await this.evaluateAgentFinding(bp.id, organizationId, project.id, false, userId);
        } else {
          lastResult = null;
        }
      }

      result.push({
        ...bp,
        enabled: state.enabled,
        status: state.status,
        lastRunAt: lastResult?.completedAt || (isMeasured ? new Date(Date.now() - 3600000).toISOString() : undefined),
        nextRunAt: state.enabled ? new Date(Date.now() + 43200000).toISOString() : undefined,
        lastResult,
      });
    }

    return result;
  }

  /**
   * Get single agent detail
   */
  async getAgentById(agentId: string, organizationId: string, projectId?: string, userId?: string): Promise<AgentDefinition> {
    const agents = await this.getAgents(organizationId, projectId, userId);
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
      throw new NotFoundException(`Agent '${agentId}' not found.`);
    }
    return agent;
  }

  /**
   * Get agent run history
   */
  async getAgentRuns(agentId: string, organizationId: string, projectId?: string, userId?: string): Promise<AgentRunResult[]> {
    const project = await this.resolveScopedProject(organizationId, projectId);
    if (!project) {
      return [];
    }
    const key = this.getAgentKey(organizationId, project.id, agentId);
    return this.agentRunHistory.get(key) || [];
  }

  /**
   * Explicit Run Now trigger for an agent
   */
  async runAgent(agentId: string, organizationId: string, projectId?: string, userId?: string): Promise<AgentRunResult> {
    const project = await this.resolveScopedProject(organizationId, projectId);
    if (!project) {
      throw new NotFoundException("Project not found.");
    }

    this.logger.log(`Executing explicit run for agent: ${agentId} on org: ${organizationId}, project: ${project.id}`);

    const runResult = await this.evaluateAgentFinding(agentId, organizationId, project.id, true, userId);

    // Save run record to history
    const key = this.getAgentKey(organizationId, project.id, agentId);
    const existing = this.agentRunHistory.get(key) || [];
    this.agentRunHistory.set(key, [runResult, ...existing.slice(0, 19)]); // Keep last 20 runs

    // Audit log the execution
    await this.auditService.logAction({
      userId,
      organizationId,
      action: "AGENT_EXECUTED",
      metadata: {
        agentId,
        projectId: project.id,
        finding: runResult.finding,
        severity: runResult.severity,
        notificationDispatched: runResult.notificationDispatched,
      },
    });

    return runResult;
  }

  /**
   * Enable / Pause agent mutation
   */
  async updateAgentStatus(
    agentId: string,
    update: { enabled?: boolean; status?: "ACTIVE" | "PAUSED" },
    organizationId: string,
    projectId?: string,
    userId?: string,
  ): Promise<AgentDefinition> {
    const project = await this.resolveScopedProject(organizationId, projectId);
    if (!project) {
      throw new NotFoundException("Project not found.");
    }

    const key = this.getAgentKey(organizationId, project.id, agentId);
    const current = this.agentStatusMap.get(key) || { enabled: true, status: "ACTIVE" };

    const newEnabled = update.enabled !== undefined ? update.enabled : current.enabled;
    const newStatus = update.status !== undefined ? update.status : newEnabled ? "ACTIVE" : "PAUSED";

    this.agentStatusMap.set(key, { enabled: newEnabled, status: newStatus });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: newEnabled ? "AGENT_ENABLED" : "AGENT_PAUSED",
      metadata: {
        agentId,
        projectId: project.id,
        enabled: newEnabled,
        status: newStatus,
      },
    });

    return this.getAgentById(agentId, organizationId, project.id, userId);
  }

  /**
   * Evaluates observational intelligence and generates real evidence.
   */
  private async evaluateAgentFinding(
    agentId: string,
    organizationId: string,
    projectId: string,
    dispatchNotificationIfNew: boolean,
    userId?: string,
  ): Promise<AgentRunResult> {
    const startedAt = new Date().toISOString();
    const insights = await this.rootCauseEngine.diagnoseRootCauses(organizationId, projectId, userId);
    const baselineState = await this.baselineService.getBaselineState(organizationId, projectId);
    const isMeasured = baselineState.status === "READY" || baselineState.status === "PARTIAL";

    let finding = "No anomalies detected in current search environment.";
    let severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO" = "LOW";
    let evidence: Record<string, any> = {};
    let recommendation = "Maintain current monitoring schedule.";
    let relatedRoute = "/overview";
    let relatedInsightId: string | undefined;
    let relatedStrategyActionId: string | undefined;

    if (!isMeasured) {
      finding = "No visibility baseline recorded yet. Run an initial scan to begin intelligence detection.";
      severity = "INFO";
      evidence = { status: "UNMEASURED" };
      recommendation = "Run an initial visibility scan to establish baseline measurements.";
      relatedRoute = "/visibility";
    } else {
      switch (agentId) {
        case "agent-vis-monitor": {
          const visInsight = insights.find((i) => i.type === "VISIBILITY");
          if (visInsight) {
            finding = `AI Search Visibility declined by ${Math.abs(visInsight.evidence.delta || 0).toFixed(1)} pts across tracked models.`;
            severity = visInsight.severity;
            evidence = visInsight.evidence;
            recommendation = visInsight.recommendation;
            relatedRoute = "/visibility";
            relatedInsightId = visInsight.id;
          } else {
            finding = `Visibility is stable at ${(baselineState.visibilityScore || 50).toFixed(1)}% across all engines.`;
            severity = "LOW";
            evidence = { score: baselineState.visibilityScore };
            recommendation = "Continue periodic scanning to maintain ranking signal.";
            relatedRoute = "/visibility";
          }
          break;
        }

        case "agent-comp-watch": {
          const compInsight = insights.find((i) => i.type === "COMPETITOR");
          if (compInsight) {
            finding = `${compInsight.evidence.competitorBrand || "Competitor"} leads generative share of voice by ${compInsight.evidence.gap || 0} pts.`;
            severity = compInsight.severity;
            evidence = compInsight.evidence;
            recommendation = compInsight.recommendation;
            relatedRoute = "/competitors";
            relatedInsightId = compInsight.id;
          } else {
            finding = "Brand holds leading share-of-voice against top configured rivals.";
            severity = "LOW";
            evidence = { leading: true };
            recommendation = "Expand competitor tracking to adjacent vertical contenders.";
            relatedRoute = "/competitors";
          }
          break;
        }

        case "agent-citation-watch": {
          const citInsight = insights.find((i) => i.type === "CITATION");
          if (citInsight) {
            finding = `High-authority citation gap detected across ${(citInsight.evidence.affectedDomains || []).join(", ")}.`;
            severity = citInsight.severity;
            evidence = citInsight.evidence;
            recommendation = citInsight.recommendation;
            relatedRoute = "/sources";
            relatedInsightId = citInsight.id;
          } else {
            finding = "Citation profile healthy. Verified brand links present in authoritative sources.";
            severity = "LOW";
            evidence = { authoritySourcesActive: true };
            recommendation = "Monitor editorial source additions in weekly sync.";
            relatedRoute = "/sources";
          }
          break;
        }

        case "agent-prompt-monitor": {
          const promptInsight = insights.find((i) => i.type === "PROMPT_COVERAGE");
          if (promptInsight) {
            finding = `Brand unmentioned in ${(promptInsight.evidence.affectedPrompts || []).length} high-intent commercial queries.`;
            severity = promptInsight.severity;
            evidence = promptInsight.evidence;
            recommendation = promptInsight.recommendation;
            relatedRoute = "/prompts";
            relatedInsightId = promptInsight.id;
          } else {
            finding = "All high-priority commercial evaluation queries include verified brand mentions.";
            severity = "LOW";
            evidence = { coverageRatio: 1.0 };
            recommendation = "Generate new prompt clusters for expanding product capabilities.";
            relatedRoute = "/prompts";
          }
          break;
        }

        case "agent-model-monitor": {
          const modelInsight = insights.find((i) => i.type === "MODEL_PERFORMANCE");
          if (modelInsight) {
            finding = `Performance lag concentrated on ${modelInsight.evidence.weakestModel || "Claude"} (${modelInsight.evidence.spread || 0} pt spread).`;
            severity = modelInsight.severity;
            evidence = modelInsight.evidence;
            recommendation = modelInsight.recommendation;
            relatedRoute = "/visibility";
            relatedInsightId = modelInsight.id;
          } else {
            finding = "Model performance balanced across ChatGPT, Claude, Gemini, and Perplexity.";
            severity = "LOW";
            evidence = { modelSpread: "BALANCED" };
            recommendation = "Maintain structured markup standards across all technical endpoints.";
            relatedRoute = "/visibility";
          }
          break;
        }

        case "agent-strategy-monitor":
        default: {
          const strategyOverview = await this.strategyEngine.getStrategyOverview(organizationId, projectId, userId);
          const topAction = strategyOverview.actions[0];
          if (topAction && topAction.priority === "P0") {
            finding = `Critical P0 strategic action available: ${topAction.title} (est gain: ${topAction.expectedGain}).`;
            severity = "HIGH";
            evidence = { topActionId: topAction.id, expectedGain: topAction.expectedGain };
            recommendation = topAction.description;
            relatedRoute = "/strategy";
            relatedStrategyActionId = topAction.id;
          } else {
            finding = `${strategyOverview.summary.totalActions} strategic optimization moves prioritized in roadmap.`;
            severity = "LOW";
            evidence = { totalActions: strategyOverview.summary.totalActions };
            recommendation = "Review strategic roadmap to execute recommended moves.";
            relatedRoute = "/strategy";
          }
          break;
        }
      }
    }

    const completedAt = new Date().toISOString();
    let notificationDispatched = false;

    // Deduplicated notification dispatch
    if (dispatchNotificationIfNew && userId && isMeasured && (severity === "HIGH" || severity === "CRITICAL")) {
      const dedupKey = `${agentId}:${organizationId}:${projectId}:${JSON.stringify(evidence)}`;
      const lastSent = this.notificationDeduplicationMap.get(dedupKey);
      const now = Date.now();

      // Only send if not sent within 12 hours (43,200,000 ms)
      if (!lastSent || now - lastSent > 43200000) {
        try {
          await this.notificationEngine.dispatch({
            userId,
            organizationId,
            title: `[Agent Alert] ${finding}`,
            message: `${recommendation} View evidence in ${relatedRoute}.`,
            category: NotificationCategory.SYSTEM,
            priority: severity === "CRITICAL" ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
            metadata: {
              agentId,
              projectId,
              severity,
              evidence,
              relatedRoute,
            },
          });
          this.notificationDeduplicationMap.set(dedupKey, now);
          notificationDispatched = true;
        } catch (err) {
          this.logger.warn(`Failed to dispatch agent notification: ${(err as Error).message}`);
        }
      }
    }

    return {
      id: `run-${agentId}-${Date.now()}`,
      agentId,
      organizationId,
      projectId,
      status: "COMPLETED",
      progress: 100,
      startedAt,
      completedAt,
      finding,
      severity,
      evidence,
      recommendation,
      relatedRoute,
      relatedInsightId,
      relatedStrategyActionId,
      provenance: baselineState.provenance === "LIVE" ? "LIVE" : "DETERMINISTIC_FALLBACK",
      notificationDispatched,
    };
  }
}
