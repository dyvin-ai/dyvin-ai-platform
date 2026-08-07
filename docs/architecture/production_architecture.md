# Dyvin AI Enterprise Production Cloud Architecture

## 1. Cloud Architecture Overview

Dyvin AI is deployed on **AWS Enterprise Multi-AZ Architecture** utilizing Kubernetes (EKS), Aurora PostgreSQL, ElastiCache Redis, CloudFront CDN, and OpenTelemetry observability.

```mermaid
graph TD
    Client["Global Enterprise User"] --> Cloudflare["Cloudflare Enterprise WAF / DDoS"]
    Cloudflare --> ALB["AWS Application Load Balancer"]
    
    subgraph AWS VPC (us-east-1)
        subgraph Public Subnets
            ALB
            NAT["NAT Gateways"]
        end
        
        subgraph Private Subnets - EKS Cluster
            API["Dyvin Backend API Pods (HPA 3-20 Replicas)"]
            Workers["BullMQ Worker Pods (StatefulSets)"]
        end
        
        subgraph Database & Caching Subnets
            Aurora[("AWS Aurora PostgreSQL Multi-AZ")]
            ElastiCache[("AWS ElastiCache Redis Cluster")]
            OpenSearch[("AWS OpenSearch Service")]
        end
    end

    API --> Aurora
    API --> ElastiCache
    API --> OpenSearch
    Workers --> ElastiCache
```

---

## 2. Infrastructure Scale & High Availability Metrics

| Layer | Component | Scale / HA Configuration | RPO / RTO |
|---|---|---|---|
| **Compute** | AWS EKS (Kubernetes) | Multi-AZ 3–20 Node Auto-Scaling Group (`m6i.xlarge`) | RPO: 0 / RTO: < 10s |
| **Database** | AWS Aurora PostgreSQL | Multi-AZ Primary + Read Replicas | RPO: < 1s / RTO: < 30s |
| **Cache & Queue** | AWS ElastiCache Redis | Multi-AZ Cluster Mode Enabled (Sentinel Auto-Failover) | RPO: < 1s / RTO: < 5s |
| **Object Storage** | AWS S3 + Cloudflare R2 | Multi-Region Bucket Replication & Versioning | RPO: 0 / RTO: 0 |
| **CDN & Edge** | Cloudflare + AWS CloudFront | 275+ Global Edge PoPs with WAF & Rate Limiting | RPO: N/A / RTO: 0 |
