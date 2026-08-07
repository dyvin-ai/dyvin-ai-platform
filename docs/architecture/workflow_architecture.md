# Dyvin AI Enterprise Workflow Studio Architecture

## Executive Summary

The Dyvin AI Workflow Studio is an enterprise visual automation and AI orchestration platform. It enables organizations to build, execute, monitor, and scale multi-node AI pipelines seamlessly integrated with NestJS backend modules (`WorkflowStudioModule`, `ActionEngineModule`, `IntegrationHubModule`, `ObservabilityModule`).

## Core Architectural Pillars

```mermaid
graph TD
    A["Visual Canvas Interface (React + SVG)"] --> B["Zustand Workflow Store"]
    B --> C["React Query API Layer"]
    C --> D["NestJS WorkflowStudioController"]
    D --> E["WorkflowOrchestratorService"]
    E --> F["Prisma Postgres DB"]
    E --> G["BullMQ Redis Queue (WorkflowStudioQueue)"]
    G --> H["Worker Execution Threads"]
```

### Key Subsystems
1. **Interactive Drag-and-Drop Canvas**: High-performance SVG & HTML5 canvas renderer supporting zoom, pan, grid snap, port-to-port edge creation, and cycle detection.
2. **Node Palette**: 20+ backend-backed node types (Triggers, Search, Reasoning, Generation, Verification, Recommendation, Knowledge Graph, Notifications, Databases).
3. **Execution Console**: Live log streaming, historical execution records, and real-time BullMQ queue latency monitoring.
4. **Integration Hub**: Deep integration with CRM, CMS, and Webhook providers.
