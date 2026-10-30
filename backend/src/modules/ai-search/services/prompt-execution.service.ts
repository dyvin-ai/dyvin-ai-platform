import { Injectable, Logger } from '@nestjs/common';
import { AIProviderCode, ExecutionStatus, ExecutionTrigger } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { ProviderRouter } from '../../ai/services/provider-router.service';
import { AuditService } from '../../audit/audit.service';
import { QuotaEnforcementService } from '../../billing/services/quota-enforcement.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationDispatcherService } from '../../notification/services/notification-dispatcher.service';

export interface ExecutePromptOptions {
  promptId: string;
  providerCode?: AIProviderCode;
  trigger?: ExecutionTrigger;
  userId?: string;
  organizationId?: string;
}

@Injectable()
export class PromptExecutionService {
  private readonly logger = new Logger(PromptExecutionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerRouter: ProviderRouter,
    private readonly auditService: AuditService,
    private readonly quotaService: QuotaEnforcementService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationDispatcher: NotificationDispatcherService,
  ) {}

  async executePrompt(options: ExecutePromptOptions) {
    const startTime = Date.now();

    // 1. Feature Flag Check
    const isEnabled = await this.featureFlagService.evaluate('ai-search-platform', {
      userId: options.userId,
      organizationId: options.organizationId,
    });

    if (isEnabled === false) {
      this.logger.warn(`AI Search Platform disabled by Feature Flag.`);
    }

    // 2. Fetch Prompt & Project Details
    const prompt = await this.prisma.aISearchPrompt.findUnique({
      where: { id: options.promptId },
      include: {
        aiSearchProject: {
          include: {
            project: {
              include: { websites: true },
            },
          },
        },
      },
    });

    if (!prompt) {
      throw new Error(`AI Search Prompt [${options.promptId}] not found.`);
    }

    const brandName = prompt.aiSearchProject?.project?.name || prompt.aiSearchProject?.name || 'Brand';
    const domain = prompt.aiSearchProject?.project?.primaryDomain || 'example.com';

    const provider = options.providerCode || AIProviderCode.OPENAI;
    const targetModel = provider === AIProviderCode.CLAUDE
      ? 'claude-3-5-sonnet'
      : provider === AIProviderCode.GEMINI
      ? 'gemini-1.5-pro'
      : provider === AIProviderCode.PERPLEXITY
      ? 'sonar-pro'
      : 'gpt-4o';

    // 3. Quota check
    if (options.organizationId) {
      await this.quotaService.checkQuota(options.organizationId, 'AI_REQUESTS' as any);
    }

    let rawResponseText = '';
    let status: ExecutionStatus = ExecutionStatus.SUCCESS;
    let retryCount = 0;
    let executionMode: 'LIVE' | 'DETERMINISTIC_FALLBACK' = 'DETERMINISTIC_FALLBACK';
    let isLiveCall = false;

    try {
      // 4. Call AI Provider through ProviderRouter.routeChat
      const response = await this.providerRouter.routeChat(
        {
          messages: [{ role: 'user', content: prompt.promptText }],
          maxTokens: 1000,
          temperature: 0.7,
        },
        provider,
      );

      rawResponseText = response.content || `AI Search response generated for prompt: "${prompt.promptText.substring(0, 50)}..."`;
      executionMode = response.executionMode === 'LIVE' ? 'LIVE' : 'DETERMINISTIC_FALLBACK';
      isLiveCall = response.isLive === true;
    } catch (err: any) {
      this.logger.error(`AI Provider execution failed: ${err.message}. Retrying via deterministic simulation...`);
      retryCount = 1;

      // Retry Fallback via Mock
      const fallback = await this.providerRouter.routeChat(
        {
          messages: [{ role: 'user', content: prompt.promptText }],
          maxTokens: 500,
        },
        AIProviderCode.MOCK,
      );

      rawResponseText = fallback.content || `[Fallback] Response for: ${prompt.promptText}`;
      executionMode = 'DETERMINISTIC_FALLBACK';
      isLiveCall = false;
    }

    const latencyMs = Date.now() - startTime;
    const promptTokens = Math.ceil(prompt.promptText.length / 4);
    const completionTokens = Math.ceil(rawResponseText.length / 4);
    const totalTokens = promptTokens + completionTokens;
    const costUsd = parseFloat(((totalTokens / 1000) * 0.002).toFixed(6));

    // 5. Extract Real Observations from Response Text
    const observation = this.extractObservations(rawResponseText, brandName, domain);

    // 6. Save Execution
    const execution = await this.prisma.aISearchExecution.create({
      data: {
        aiSearchProjectId: prompt.aiSearchProjectId,
        promptId: prompt.id,
        trigger: options.trigger || ExecutionTrigger.MANUAL,
        status,
        latencyMs,
        costUsd,
        totalTokens,
        providerCode: provider,
        modelCode: targetModel,
        retryCount,
        results: {
          create: [
            {
              promptId: prompt.id,
              answerText: rawResponseText,
              visibilityScore: observation.calculatedVisibilityScore,
              citations: observation.citations,
            },
          ],
        },
        responses: {
          create: [
            {
              rawTextResponse: rawResponseText,
              structuredJson: {
                provenance: executionMode,
                isLive: isLiveCall,
                brandMentioned: observation.brandMentioned,
                mentionCount: observation.mentionCount,
                position: observation.position,
                sentiment: observation.sentiment,
                competitors: observation.competitors,
                citedDomains: observation.citedDomains,
                calculatedScore: observation.calculatedVisibilityScore,
                status: 'COMPLETED',
                confidence: isLiveCall ? 0.95 : 0.7,
              },
            },
          ],
        },
        logs: {
          create: [
            {
              logLevel: 'INFO',
              message: `Executed prompt across ${provider} (${executionMode}) in ${latencyMs}ms with score ${observation.calculatedVisibilityScore}`,
            },
          ],
        },
      },
      include: { results: true, responses: true },
    });

    // 7. Audit & Notification
    await this.auditService.logAction({
      userId: options.userId,
      organizationId: options.organizationId,
      action: 'PROMPT_EXECUTED',
      metadata: { executionId: execution.id, provider, latencyMs, costUsd, provenance: executionMode },
    });

    return execution;
  }

  private extractObservations(text: string, brandName: string, domain: string) {
    const lowerText = text.toLowerCase();
    const cleanBrand = brandName.toLowerCase().trim();
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();

    // 1. Mention Check
    const brandRegex = new RegExp(`\\b${cleanBrand}\\b`, 'gi');
    const brandMatches = text.match(brandRegex);
    const domainMentioned = lowerText.includes(cleanDomain);
    const mentionCount = (brandMatches ? brandMatches.length : 0) + (domainMentioned ? 1 : 0);
    const brandMentioned = mentionCount > 0;

    // 2. Position Ranking Detection (Ordered Lists)
    let position: number | null = null;
    const lines = text.split('\n');
    let rankIndex = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      const listMatch = trimmed.match(/^(\d+)[\.\)]\s*(.+)/);
      if (listMatch) {
        rankIndex++;
        if (listMatch[2].toLowerCase().includes(cleanBrand) || listMatch[2].toLowerCase().includes(cleanDomain)) {
          position = parseInt(listMatch[1], 10) || rankIndex;
          break;
        }
      }
    }

    // 3. Sentiment Extraction
    let sentiment: 'positive' | 'neutral' | 'negative' | 'unknown' = 'unknown';
    if (brandMentioned) {
      const posWords = ['best', 'top', 'recommend', 'leader', 'leading', 'superior', 'reliable', 'excellent', 'robust', 'innovative', 'popular'];
      const negWords = ['worst', 'avoid', 'poor', 'outdated', 'expensive', 'slow', 'issues', 'bugs', 'limited', 'lacks'];

      let posScore = 0;
      let negScore = 0;
      for (const w of posWords) {
        if (lowerText.includes(w)) posScore++;
      }
      for (const w of negWords) {
        if (lowerText.includes(w)) negScore++;
      }

      if (posScore > negScore) sentiment = 'positive';
      else if (negScore > posScore) sentiment = 'negative';
      else sentiment = 'neutral';
    }

    // 4. Citation Extraction
    const urlRegex = /https?:\/\/[^\s)\]">]+/gi;
    const foundUrls = text.match(urlRegex) || [];
    const citations: Array<{ url: string; domain: string; source: string }> = [];
    const citedDomains: string[] = [];

    for (const u of foundUrls.slice(0, 8)) {
      try {
        const uObj = new URL(u);
        const host = uObj.hostname.replace(/^www\./, '');
        if (!citedDomains.includes(host)) {
          citedDomains.push(host);
        }
        citations.push({ url: u, domain: host, source: host });
      } catch {
        // Skip malformed URLs
      }
    }

    // 5. Competitor Extraction
    const competitors: string[] = [];
    const knownPeers = ['Stripe', 'Square', 'PayPal', 'Adyen', 'Shopify', 'Salesforce', 'HubSpot', 'Microsoft', 'Google', 'Amazon', 'Apple', 'Meta'];
    for (const peer of knownPeers) {
      if (peer.toLowerCase() !== cleanBrand && lowerText.includes(peer.toLowerCase())) {
        competitors.push(peer);
      }
    }

    // 6. Calculate Visibility Score for this specific execution observation (0 - 100)
    let calculatedVisibilityScore = 0;
    if (brandMentioned) {
      if (position === 1) calculatedVisibilityScore = 95;
      else if (position === 2) calculatedVisibilityScore = 85;
      else if (position === 3) calculatedVisibilityScore = 75;
      else if (position !== null && position > 3) calculatedVisibilityScore = 60;
      else calculatedVisibilityScore = 65; // unranked mention

      if (sentiment === 'positive') calculatedVisibilityScore = Math.min(100, calculatedVisibilityScore + 10);
      else if (sentiment === 'negative') calculatedVisibilityScore = Math.max(10, calculatedVisibilityScore - 20);

      if (citations.some((c) => c.domain.includes(cleanDomain))) {
        calculatedVisibilityScore = Math.min(100, calculatedVisibilityScore + 5);
      }
    }

    return {
      brandMentioned,
      mentionCount,
      position,
      sentiment,
      citations,
      citedDomains,
      competitors: competitors.slice(0, 5),
      calculatedVisibilityScore,
    };
  }
}
