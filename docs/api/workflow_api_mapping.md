# Workflow Studio API Mapping & Contract Reference

| Frontend Hook / Function | HTTP Method | Backend Route | Controller & Method |
|---|---|---|---|
| `workflowApi.getWorkflows` | `GET` | `/api/v1/workflows` | `WorkflowStudioController.getWorkflows` |
| `workflowApi.getWorkflowById` | `GET` | `/api/v1/workflows/:id` | `WorkflowStudioController.getWorkflowById` |
| `workflowApi.createWorkflow` | `POST` | `/api/v1/workflows` | `WorkflowStudioController.createWorkflow` |
| `workflowApi.updateWorkflow` | `PATCH` | `/api/v1/workflows/:id` | `WorkflowStudioController.updateWorkflow` |
| `workflowApi.deleteWorkflow` | `DELETE` | `/api/v1/workflows/:id` | `WorkflowStudioController.deleteWorkflow` |
| `workflowApi.runWorkflow` | `POST` | `/api/v1/workflows/:id/run` | `WorkflowStudioController.runWorkflow` |
| `workflowApi.pauseWorkflow` | `POST` | `/api/v1/workflows/:id/pause` | `WorkflowStudioController.pauseWorkflow` |
| `workflowApi.resumeWorkflow` | `POST` | `/api/v1/workflows/:id/resume` | `WorkflowStudioController.resumeWorkflow` |
| `workflowApi.getWorkflowTemplates` | `GET` | `/api/v1/workflows/templates` | `WorkflowStudioController.getTemplates` |
| `workflowApi.getWorkflowExecutions` | `GET` | `/api/v1/workflows/executions` | `WorkflowStudioController.getExecutions` |
| `workflowApi.getWorkflowHistory` | `GET` | `/api/v1/workflows/history` | `WorkflowStudioController.getHistory` |
