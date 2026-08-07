import { useQuery } from '@tanstack/react-query';
import { knowledgeApi } from '@services/api/knowledge.api';

export function useKnowledgeGraphOverview(projectId: string) {
  return useQuery({
    queryKey: ['knowledge', 'overview', projectId],
    queryFn: () => knowledgeApi.getKnowledgeGraph(projectId),
    enabled: !!projectId,
  });
}

export function useKnowledgeEntities(projectId: string) {
  return useQuery({
    queryKey: ['knowledge', 'entities', projectId],
    queryFn: () => knowledgeApi.getEntities(projectId),
    enabled: !!projectId,
  });
}

export function useKnowledgeRelationships(projectId: string) {
  return useQuery({
    queryKey: ['knowledge', 'relationships', projectId],
    queryFn: () => knowledgeApi.getRelationships(projectId),
    enabled: !!projectId,
  });
}

export function useKnowledgeFacts(projectId: string) {
  return useQuery({
    queryKey: ['knowledge', 'facts', projectId],
    queryFn: () => knowledgeApi.getFacts(projectId),
    enabled: !!projectId,
  });
}
