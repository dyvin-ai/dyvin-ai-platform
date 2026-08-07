import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SearchEngineService } from './services/search-engine.service';

@ApiTags('Enterprise Search & Indexing Engine')
@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchEngine: SearchEngineService) {}

  @Get()
  @ApiOperation({
    summary: 'Search Platform Entities',
    description: 'Unified full-text search across Projects, Reports, Recommendations, Entities, and Generated Assets.',
  })
  @ApiQuery({ name: 'q', required: true, description: 'Search term or phrase' })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiResponse({ status: 200, description: 'Search results payload.' })
  async search(
    @Query('q') q: string,
    @Query('organizationId') organizationId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.searchEngine.search({
      query: q,
      organizationId,
      projectId,
    });
  }

  @Get('autocomplete')
  @ApiOperation({
    summary: 'Search Autocomplete Suggestions',
    description: 'Returns real-time search term suggestions.',
  })
  @ApiQuery({ name: 'q', required: true })
  @ApiResponse({ status: 200, description: 'Autocomplete suggestions.' })
  async autocomplete(@Query('q') q: string) {
    return this.searchEngine.autocomplete(q);
  }
}
