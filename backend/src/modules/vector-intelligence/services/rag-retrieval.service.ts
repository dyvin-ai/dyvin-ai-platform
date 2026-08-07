import { Injectable, Logger } from '@nestjs/common';
import { VectorSearchService } from './vector-search.service';

@Injectable()
export class RAGRetrievalService {
  private readonly logger = new Logger(RAGRetrievalService.name);

  constructor(private readonly vectorSearch: VectorSearchService) {}

  async retrieveContext(query: string, organizationId?: string) {
    const searchResults = await this.vectorSearch.search(query, organizationId, 5);

    const contextSnippets = searchResults.results.map((r) => r.content).join('\n---\n');

    return {
      query,
      retrievedSnippetsCount: searchResults.results.length,
      formattedContext: contextSnippets,
      sources: searchResults.results,
    };
  }
}
