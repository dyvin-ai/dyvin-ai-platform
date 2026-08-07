# Enterprise Customer Success Platform Architecture Blueprint

## System Architecture

```mermaid
graph TD
    DomainEvents["Domain Event Bus (UserRegistered, OrganizationCreated, VisibilityUpdated)"] --> CSWorker["Customer Success Aggregator"]
    CSWorker --> CSHealth["Health Scoring Engine (0-100)"]
    CSWorker --> Journey["Milestone Journey Tracker"]
    CSWorker --> Adoption["Product Adoption Engine"]
    CSWorker --> Churn["Churn Prediction Engine"]

    CSHealth --> API["/api/v1/customer-success/* REST Endpoints"]
    Journey --> API
    Adoption --> API
    Churn --> API
```

---

## Core Capabilities
- **0-100 Customer Health Score**: Real-time health calculation across product usage, adoption depth, support tickets, and workspace activity.
- **Milestone Journey Tracking**: Monitors time-to-value across 7 key customer milestones.
- **Churn Prediction**: Forecasts renewal probability (96%) and churn risk (LOW).
