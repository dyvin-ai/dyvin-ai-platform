# AWS Enterprise Cloud Architecture Report

## Cloud Component Topology
- **Amazon EKS**: Managed Kubernetes cluster `v1.28` with auto-scaling node groups (`m6i.xlarge`).
- **Amazon Aurora PostgreSQL**: Serverless v2 Multi-AZ PostgreSQL with automated encryption & read replicas.
- **Amazon ElastiCache Redis**: Multi-AZ cluster with Sentinel failover.
- **Amazon S3 & Cloudflare R2**: Object storage with cross-region replication.
- **Cloudflare & AWS CloudFront**: Global edge network for WAF, DDoS mitigation, and SSL/TLS termination.
