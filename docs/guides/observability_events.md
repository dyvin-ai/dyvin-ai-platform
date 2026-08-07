# Event Bus Observability & Prometheus Metrics

- `domain_events_published_total{event_type="..."}`: Counter for total events published.
- `domain_events_consumed_total{event_type="...", subscriber="..."}`: Counter for total events consumed.
- `domain_events_processing_duration_seconds`: Histogram of event processing latency.
- `domain_events_dlq_size`: Gauge tracking dead-letter queue count.
