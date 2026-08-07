import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActionEngineService, CreateActionInput } from './services/action-engine.service';
import { WorkflowEngineService, CreateWorkflowInput } from './services/workflow-engine.service';
import { PlaybookService, CreatePlaybookInput } from './services/playbook.service';
import { ActionQueue } from './queues/action.queue';

@ApiTags('AI Action Engine')
@Controller('api/v1')
export class ActionEngineController {
  constructor(
    private readonly actionEngine: ActionEngineService,
    private readonly workflowEngine: WorkflowEngineService,
    private readonly playbookService: PlaybookService,
    private readonly actionQueue: ActionQueue,
  ) {}

  @Post('actions')
  @ApiOperation({ summary: 'Create a new autonomous action' })
  async createAction(@Body() body: CreateActionInput) {
    return this.actionEngine.createAction(body);
  }

  @Get('actions')
  @ApiOperation({ summary: 'List actions' })
  async getActions(@Query('organizationId') organizationId?: string) {
    return this.actionEngine.getActions(organizationId);
  }

  @Get('actions/:id')
  @ApiOperation({ summary: 'Get action details by ID' })
  async getActionById(@Param('id') id: string) {
    return this.actionEngine.getActionById(id);
  }

  @Post('actions/:id/run')
  @ApiOperation({ summary: 'Run action asynchronously' })
  async runAction(@Param('id') id: string) {
    await this.actionQueue.addExecutionJob({ actionId: id });
    return this.actionEngine.runAction(id);
  }

  @Post('workflows')
  @ApiOperation({ summary: 'Create a multi-step workflow' })
  async createWorkflow(@Body() body: CreateWorkflowInput) {
    return this.workflowEngine.createWorkflow(body);
  }

  @Get('workflows')
  @ApiOperation({ summary: 'List workflows' })
  async getWorkflows(@Query('organizationId') organizationId?: string) {
    return this.workflowEngine.getWorkflows(organizationId);
  }

  @Post('playbooks')
  @ApiOperation({ summary: 'Create a reusable playbook' })
  async createPlaybook(@Body() body: CreatePlaybookInput) {
    return this.playbookService.createPlaybook(body);
  }

  @Get('playbooks')
  @ApiOperation({ summary: 'List playbooks' })
  async getPlaybooks() {
    return this.playbookService.getPlaybooks();
  }

  @Get('executions')
  @ApiOperation({ summary: 'Get execution records' })
  async getExecutions(@Query('actionId') actionId?: string) {
    return this.actionEngine.getExecutions(actionId);
  }

  @Get('artifacts')
  @ApiOperation({ summary: 'Get generated artifacts' })
  async getArtifacts(@Query('actionId') actionId?: string) {
    return this.actionEngine.getArtifacts(actionId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get action status history' })
  async getHistory(@Query('actionId') actionId?: string) {
    return this.actionEngine.getHistory(actionId);
  }
}
