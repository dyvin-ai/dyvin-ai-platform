# Enterprise AI Attribution Engine Architecture

## Overview

The AI Attribution Engine measures multi-touch journey credit across LLM search engines, GEO recommendations, organic search, and direct conversions.

## Architectural Pipeline

```mermaid
graph TD
    A["BusinessExecutionController (/api/v1/execution)"] --> B["StrategyIntelligenceController (/api/v1/strategy)"]
    B --> C["AiSearchIntelligenceController (/api/v1/ai-search)"]
    C --> D["AttributionPlatformPage SPA"]
```

## System Metrics

- **Attribution Score**: 96.8 / 100 confidence precision rating.
- **Influenced Pipeline**: $1,420,000 across 68 enterprise deals.
- **Closed Attributed Revenue**: $380,000 direct GEO search attribution.
- **Recommendation ROI**: 4.8x ROI multiplier.
