# Automation Engine & AI Orchestration Specification

## Autonomous Execution Lifecycle

1. **Trigger Phase**: Incoming event / webhook / cron scheduler invokes `runWorkflow(id)`.
2. **Queueing Phase**: Execution job is pushed to BullMQ `WorkflowStudioQueue`.
3. **Execution Phase**: Worker thread executes sequential/parallel nodes.
4. **Verification Phase**: Output is audited by `VerificationEngineService`.
5. **Completion Phase**: Logs are recorded, notifications sent, and status set to `COMPLETED`.
