export interface KnowledgeGraphOverview {
  projectId: string;
  totalEntities: number;
  totalRelationships: number;
  totalFacts: number;
  graphCompleteness: number; // 0 - 100
}

export interface KnowledgeEntityItem {
  id: string;
  name: string;
  type: 'COMPANY' | 'PRODUCT' | 'SERVICE' | 'PERSON' | 'CONCEPT';
  confidenceScore: number;
  attributes: Record<string, string>;
}

export interface KnowledgeRelationshipItem {
  id: string;
  sourceEntityId: string;
  sourceEntityName: string;
  targetEntityId: string;
  targetEntityName: string;
  relationType: 'OFFERS' | 'MANUFACTURERS' | 'FOUNDED_BY' | 'PARTNERS_WITH' | 'COMPETES_WITH';
  confidence: number;
}

export interface KnowledgeFactItem {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  confidenceScore: number;
  sourceUrl: string;
}

export interface KnowledgeProductItem {
  id: string;
  productName: string;
  category: string;
  features: string[];
}

export interface KnowledgeServiceItem {
  id: string;
  serviceName: string;
  category: string;
}
