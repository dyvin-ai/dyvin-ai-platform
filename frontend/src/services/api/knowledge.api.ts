import { apiClient } from './client';
import type {
  KnowledgeGraphOverview,
  KnowledgeEntityItem,
  KnowledgeRelationshipItem,
  KnowledgeFactItem,
  KnowledgeProductItem,
  KnowledgeServiceItem,
} from '@app-types/knowledge.types';

export const knowledgeApi = {
  getKnowledgeGraph: async (projectId: string): Promise<KnowledgeGraphOverview> => {
    const { data } = await apiClient.get<KnowledgeGraphOverview>(`/api/v1/projects/${projectId}/knowledge`);
    return data;
  },

  getEntities: async (projectId: string): Promise<KnowledgeEntityItem[]> => {
    const { data } = await apiClient.get<KnowledgeEntityItem[]>(`/api/v1/projects/${projectId}/entities`);
    return data;
  },

  getRelationships: async (projectId: string): Promise<KnowledgeRelationshipItem[]> => {
    const { data } = await apiClient.get<KnowledgeRelationshipItem[]>(`/api/v1/projects/${projectId}/relationships`);
    return data;
  },

  getFacts: async (projectId: string): Promise<KnowledgeFactItem[]> => {
    const { data } = await apiClient.get<KnowledgeFactItem[]>(`/api/v1/projects/${projectId}/facts`);
    return data;
  },

  getProducts: async (projectId: string): Promise<KnowledgeProductItem[]> => {
    const { data } = await apiClient.get<KnowledgeProductItem[]>(`/api/v1/projects/${projectId}/products`);
    return data;
  },

  getServices: async (projectId: string): Promise<KnowledgeServiceItem[]> => {
    const { data } = await apiClient.get<KnowledgeServiceItem[]>(`/api/v1/projects/${projectId}/services`);
    return data;
  },
};
