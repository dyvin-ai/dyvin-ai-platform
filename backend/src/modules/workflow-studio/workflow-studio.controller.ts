import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { WorkflowOrchestratorService, CreateStudioWorkflowInput } from './services/workflow-orchestrator.service';
import { WorkflowTemplateService } from './services/workflow-template.service';
import { WorkflowEventBusService } from './services/workflow-event-bus.service';
import { WorkflowStudioQueue } from './queues/workflow-studio.queue';

@ApiTags('Enterprise Workflow Studio')
@Controller('workflows')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkflowStudioController {
  constructor(
    private readonly orchestrator: WorkflowOrchestratorService,
    private readonly templateService: WorkflowTemplateService,
    private readonly eventBus: WorkflowEventBusService,
    private readonly studioQueue: WorkflowStudioQueue,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new visual workflow' })
  async createWorkflow(@CurrentUser('id') userId: string, @Body() body: CreateStudioWorkflowInput) {
    return this.orchestrator.createWorkflow(userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List workflows' })
  async getWorkflows(
    @CurrentUser('id') userId: string,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.orchestrator.getWorkflows(userId, organizationId);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List reusable workflow templates' })
  async getTemplates() {
    return this.templateService.getTemplates();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get workflow event & execution history' })
  async getHistory() {
    return this.eventBus.getHistory();
  }

  @Get('executions')
  @ApiOperation({ summary: 'Get workflow executions' })
  async getExecutions(
    @CurrentUser('id') userId: string,
    @Query('workflowId') workflowId?: string,
  ) {
    return this.orchestrator.getExecutions(userId, workflowId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow detail by ID' })
  async getWorkflowById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.orchestrator.getWorkflowById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update visual workflow' })
  async updateWorkflow(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: Partial<CreateStudioWorkflowInput>,
  ) {
    return this.orchestrator.updateWorkflow(id, userId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workflow' })
  async deleteWorkflow(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.orchestrator.deleteWorkflow(id, userId);
  }

  @Post(':id/run')
  @ApiOperation({ summary: 'Trigger visual workflow execution' })
  async runWorkflow(@CurrentUser('id') userId: string, @Param('id') id: string) {
    await this.orchestrator.getWorkflowById(id, userId);
    await this.studioQueue.addExecutionJob({ workflowId: id });
    return this.orchestrator.runWorkflow(id, userId);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause workflow' })
  async pauseWorkflow(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.orchestrator.pauseWorkflow(id, userId);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume workflow' })
  async resumeWorkflow(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.orchestrator.resumeWorkflow(id, userId);
  }
}
