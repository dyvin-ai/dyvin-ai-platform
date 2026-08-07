# Dyvin AI Cross-Module Dependency Matrix (Sprints 1–30)

| Module | Core Dependencies | Consumed By | Shared Infrastructure |
|---|---|---|---|
| **Auth & User** | Prisma, Config | All Modules | JWT, Password Hashing |
| **Organization & Workspace** | Auth, Prisma | All Modules | Multi-Tenant Isolation |
| **Project & Website** | Organization, Prisma | Crawler, Scans, Search | Workspace Context |
| **Crawler & Knowledge** | Website, Prisma | AI Search, Retrieval | HTML Parser, Vector Store |
| **AI Provider & Reasoning** | Config, Prisma | AI Search, Recommendation, Strategy | OpenAI, Anthropic, Gemini Routers |
| **AI Search Intelligence** | AI Provider, Knowledge | Citation, Retrieval, Visibility | Search Query Engine |
| **Citation Intelligence** | AI Search, Prisma | Retrieval, Visibility, Strategy | Citation Match Engine |
| **Retrieval Intelligence** | Citation, AI Search | Visibility Analytics, Strategy | Explainability Engine |
| **Visibility Analytics** | Retrieval, Citation | Strategy, Reports, Dashboard | AI Visibility Score Engine |
| **Competitor Intelligence** | AI Search, Visibility | Strategy, Research, Reports | Competitor SERP Benchmarking |
| **Keyword Intelligence** | AI Search, Prisma | Prompt Engine, Campaigns | Intent Clustering Engine |
| **Prompt Engine & Campaign** | Keyword, AI Provider | Action Engine, Workflows | Prompt Interpolator |
| **Strategy Intelligence** | Visibility, Competitor, Retrieval | Action Engine, Workflows | Root Cause & Impact ROI Engine |
| **Action Engine** | Strategy, Recommendation | Workflow Studio, Integration Hub | Playbook & Approval System |
| **Research Intelligence** | Crawler, AI Search, Competitor | Strategy, Workflows, Reports | Multi-Source Discovery Engine |
| **Integration Hub** | Action Engine, Developer Platform | Workflows, CMS, CRM | 22 SaaS Connectors & Webhooks |
| **Developer Platform** | Auth, Organization, ApiGateway | Agent Marketplace, External Clients | Hashed API Keys, OAuth2 Server |
| **Workflow Studio** | Action, Strategy, Research, Integrations | Admin Platform, Agent Marketplace | Visual DAG Orchestrator |
| **Admin Platform** | Organization, Billing, Audit | Security, Platform Ops | Enterprise Control Plane |
| **Platform Security** | Audit, FeatureFlags, Admin | All Modules | SOC2, GDPR, Backups, Chaos |
| **Agent Marketplace** | Developer Platform, Workflow Studio | External Developers, Partners | Skills, Sandboxed Tools, Memory |
| **Reports & Analytics** | All Intelligence Modules | Dashboard, Admin, Notifications | PDF Report Generator |
| **Billing Platform** | Organization, Usage | Admin, Developer Platform | Stripe Connector, Quota Engine |
| **Notifications** | Organization, User | Action, Workflow, Security | Email, Slack, In-App Dispatcher |
| **Feature Flags** | Organization, Config | All Modules | Dynamic Flag Evaluator |
| **Audit Service** | Organization, Auth | All Modules | Immutable Audit Logger |
