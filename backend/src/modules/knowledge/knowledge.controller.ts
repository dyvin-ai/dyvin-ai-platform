import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { KnowledgeService } from './knowledge.service';

@ApiTags('Knowledge Graph')
@Controller('projects/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'X-Organization-Id',
  description: 'Active Organization ID',
  required: true,
})
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get('knowledge')
  @ApiOperation({
    summary: 'Get Knowledge Graph Overview',
    description: 'Retrieves Knowledge Graph metrics, entity counts, and brand profile.',
  })
  @ApiResponse({ status: 200, description: 'Knowledge Graph overview.' })
  async getKnowledgeGraph(@Param('id') projectId: string) {
    return this.knowledgeService.getProjectKnowledgeGraph(projectId);
  }

  @Get('entities')
  @ApiOperation({
    summary: 'Get Extracted Entities',
    description: 'Lists canonical business entities (Company, Products, Services, Persons).',
  })
  @ApiResponse({ status: 200, description: 'Extracted entities.' })
  async getEntities(@Param('id') projectId: string) {
    return this.knowledgeService.getProjectEntities(projectId);
  }

  @Get('relationships')
  @ApiOperation({
    summary: 'Get Graph Relationships',
    description: 'Lists directed relationship edges connecting business entities.',
  })
  @ApiResponse({ status: 200, description: 'Graph relationships.' })
  async getRelationships(@Param('id') projectId: string) {
    return this.knowledgeService.getProjectRelationships(projectId);
  }

  @Get('facts')
  @ApiOperation({
    summary: 'Get Extracted Facts',
    description: 'Lists extracted facts with confidence score and source URL provenance.',
  })
  @ApiResponse({ status: 200, description: 'Extracted facts.' })
  async getFacts(@Param('id') projectId: string) {
    return this.knowledgeService.getProjectFacts(projectId);
  }

  @Get('products')
  @ApiOperation({
    summary: 'Get Extracted Products',
    description: 'Lists products extracted from website intelligence.',
  })
  @ApiResponse({ status: 200, description: 'Extracted products.' })
  async getProducts(@Param('id') projectId: string) {
    return this.knowledgeService.getProjectProducts(projectId);
  }

  @Get('services')
  @ApiOperation({
    summary: 'Get Extracted Services',
    description: 'Lists services extracted from website intelligence.',
  })
  @ApiResponse({ status: 200, description: 'Extracted services.' })
  async getServices(@Param('id') projectId: string) {
    return this.knowledgeService.getProjectServices(projectId);
  }
}
