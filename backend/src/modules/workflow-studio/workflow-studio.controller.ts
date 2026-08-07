import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkflowOrchestratorService, CreateStudioWorkflowInput } from './services/workflow-orchestrator.service';
import { WorkflowTemplateService } from './services/workflow-template.service';
import { WorkflowEventBusService } from './services/workflow-event-bus.service';
import { WorkflowStudioQueue } from './queues/workflow-studio.queue';

@ApiTags('Enterprise Workflow Studio')
@Controller('api/v1/workflows')
export class WorkflowStudioController {
  constructor(
    private readonly orchestrator: WorkflowOrchestratorService,
    private readonly templateService: WorkflowTemplateService,
    private readonly eventBus: WorkflowEventBusService,
    private readonly studioQueue: WorkflowStudioQueue,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new visual workflow' })
  async createWorkflow(@Body() body: CreateStudioWorkflowInput) {
    return this.orchestrator.createWorkflow(body);
  }

  @Get()
  @ApiOperation({ summary: 'List workflows' })
  async getWorkflows(@Query('organizationId') organizationId?: string) {
    return this.orchestrator.getWorkflows(organizationId);
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
  async getExecutions(@Query('workflowId') workflowId?: string) {
    return this.orchestrator.getExecutions(workflowId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow detail by ID' })
  async getWorkflowById(@Param('id') id: string) {
    return this.orchestrator.getWorkflowById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update visual workflow' })
  async updateWorkflow(@Param('id') id: string, @Body() body: Partial<CreateStudioWorkflowInput>) {
    return this.orchestrator.updateWorkflow(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workflow' })
  async deleteWorkflow(@Param('id') id: string) {
    return this.orchestrator.deleteWorkflow(id);
  }

  @Post(':id/run')
  @ApiOperation({ summary: 'Trigger visual workflow execution' })
  async runWorkflow(@Param('id') id: string) {
    await this.studioQueue.addExecutionJob({ workflowId: id });
    return this.orchestrator.runWorkflow(id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause workflow' })
  async pauseWorkflow(@Param('id') id: string) {
    return this.orchestrator.pauseWorkflow(id);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume workflow' })
  async resumeWorkflow(@Param('id') id: string) {
    return this.orchestrator.resumeWorkflow(id);
  }
}
