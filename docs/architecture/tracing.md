# Distributed Tracing Architecture

## OpenTelemetry Tracing

Distributed tracing tracks end-to-end request flows across frontend SPA API calls, NestJS backend controllers, BullMQ worker nodes, and foundation model APIs.

```mermaid
graph LR
    Client --> |traceparent| APIGateway
    APIGateway --> |traceparent| WorkerNode
    WorkerNode --> |traceparent| LLMProvider
```
