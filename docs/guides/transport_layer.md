# Event Transport Abstraction Layer

## Pluggable Transport Adapters
- **IN_MEMORY**: Local fast event emitter for unit testing and dev environment.
- **BULLMQ**: Redis-backed BullMQ priority queue transport.
- **REDIS_STREAMS**: High-throughput Redis Streams consumer groups (`> 100,000 events/sec`).
- **KAFKA**: Apache Kafka topic partitions for enterprise multi-region event streaming.
- **AWS_EVENTBRIDGE**: Serverless event routing for AWS Cloud deployments.
