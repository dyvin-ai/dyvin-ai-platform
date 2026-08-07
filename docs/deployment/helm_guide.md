# Dyvin AI Production Helm Deployment Guide

## 1. Helm Chart Overview (`infrastructure/helm/`)

The Helm package configures:
- Backend NestJS API & BullMQ Workers
- Redis Cluster / Sentinel
- OpenSearch Cluster
- Prometheus & Grafana Monitoring Agents

---

## 2. Deployment Commands

```bash
helm upgrade --install dyvin-backend ./infrastructure/helm \
  --namespace dyvin-prod \
  --values ./infrastructure/helm/values.yaml
```
