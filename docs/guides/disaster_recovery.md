# Multi-Region Disaster Recovery Plan (DRP)

## 1. RPO & RTO Objectives

- **Recovery Point Objective (RPO)**: `< 1 Minute` (Aurora PostgreSQL & ElastiCache Cross-Region Replication).
- **Recovery Time Objective (RTO)**: `< 15 Minutes` (Automated DNS Failover via Route53).

## 2. Multi-Region Failover Sequence
1. Route53 health check detects primary region down (`us-east-1`).
2. Traffic automatically rerouted to secondary standby region (`us-west-2`).
3. Secondary Aurora cluster promoted to Primary.
4. Kubernetes deployment in `us-west-2` automatically scales up.
