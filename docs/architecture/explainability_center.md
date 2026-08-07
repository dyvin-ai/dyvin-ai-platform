# Explainability Center & Decision Provenance Architecture

## Overview

The Explainability Center provides transparent, mathematical auditing of how AI foundation models evaluate brand presence, citation authority, and fact verification accuracy.

## Provenance Graph

```mermaid
graph LR
    A["Public Web Index"] --> B["Authority Source Graph"]
    B --> C["LLM Prompt Execution"]
    C --> D["Explainability Node Attribution"]
```
