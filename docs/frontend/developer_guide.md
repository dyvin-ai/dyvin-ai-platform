# External Developer Onboarding & Quickstart Guide

## 1. Quickstart with TypeScript SDK

```typescript
import { DyvinClient } from '@dyvin-ai/sdk-typescript';

const client = new DyvinClient({
  apiKey: 'dyv_live_9b1deb4d3b7d4bad9bdd2b0d7b3dcb6d',
});

async function main() {
  const visibility = await client.visibility.getScore();
  console.log('AI Visibility Score:', visibility.data.score);
}
main();
```
