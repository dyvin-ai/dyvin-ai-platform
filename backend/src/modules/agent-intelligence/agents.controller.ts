import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentOrganization } from "../../common/decorators/current-organization.decorator";
import { CurrentUser, UserPayload } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AgentRunnerService, AgentDefinition, AgentRunResult } from "./services/agent-runner.service";

@ApiTags("AI Agent Intelligence Platform")
@Controller("agents")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AgentsController {
  constructor(private readonly agentRunner: AgentRunnerService) {}

  @Get()
  @ApiOperation({
    summary: "List Core Intelligence Agents",
    description: "Returns configured AI intelligence agents with live status, schedules, last findings, and observational evidence.",
  })
  @ApiQuery({ name: "projectId", required: false, description: "Optional project scope within the active organization" })
  @ApiResponse({ status: 200, description: "Array of configured intelligence agents" })
  async getAgents(
    @CurrentOrganization() orgId?: string | null,
    @Query("projectId") projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<AgentDefinition[]> {
    const targetOrgId = orgId || "org-default";
    return this.agentRunner.getAgents(targetOrgId, projectId, user?.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get Agent Detail & Run Status" })
  async getAgent(
    @Param("id") id: string,
    @CurrentOrganization() orgId?: string | null,
    @Query("projectId") projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<AgentDefinition> {
    const targetOrgId = orgId || "org-default";
    return this.agentRunner.getAgentById(id, targetOrgId, projectId, user?.id);
  }

  @Get(":id/runs")
  @ApiOperation({ summary: "Get Agent Run History" })
  async getAgentRuns(
    @Param("id") id: string,
    @CurrentOrganization() orgId?: string | null,
    @Query("projectId") projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<AgentRunResult[]> {
    const targetOrgId = orgId || "org-default";
    return this.agentRunner.getAgentRuns(id, targetOrgId, projectId, user?.id);
  }

  @Post(":id/run")
  @ApiOperation({
    summary: "Trigger Explicit Agent Run",
    description: "Executes an immediate observational intelligence evaluation for the agent, logging audit trail and deduplicated alerts.",
  })
  async triggerRun(
    @Param("id") id: string,
    @CurrentOrganization() orgId?: string | null,
    @Query("projectId") projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<AgentRunResult> {
    const targetOrgId = orgId || "org-default";
    return this.agentRunner.runAgent(id, targetOrgId, projectId, user?.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update Agent Status (Enable / Pause)" })
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { enabled?: boolean; status?: "ACTIVE" | "PAUSED" },
    @CurrentOrganization() orgId?: string | null,
    @Query("projectId") projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<AgentDefinition> {
    const targetOrgId = orgId || "org-default";
    return this.agentRunner.updateAgentStatus(id, body, targetOrgId, projectId, user?.id);
  }
}
