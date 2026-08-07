# Enterprise AI Consistency Engine Architecture

## Overview

The AI Consistency Engine evaluates factual alignment across foundation models (ChatGPT, Perplexity, Claude, Gemini, DeepSeek, Grok) and calculates model variance.

## Architectural Pipeline

```mermaid
graph TD
    A["AiSearchIntelligenceController (/api/v1/ai-search)"] --> B["ModelComparisonService"]
    B --> C["IntelligenceController (/api/v1/intelligence)"]
    C --> D["ResearchIntelligenceController (/api/v1/research)"]
    D --> E["ConsistencyPlatformPage SPA"]
```

## Metrics

- **AI Consistency Score**: 0-100 score measuring statement agreement across models.
- **Cross-Model Variance**: Factual divergence rate (1.8%).
- **Active Conflicts**: Flagged statement discrepancies requiring schema alignment.
