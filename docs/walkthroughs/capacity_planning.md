# 30-Day Infrastructure Capacity Forecasting Guide

## 1. Forecast Metrics (`GET /api/v1/ops/capacity`)
- **Database Storage Growth**: Projected at `+12 GB / week`. Current utilization `42.1%`.
- **Redis Memory Growth**: Projected at `+4 GB / week`. Current utilization `38.5%`.
- **Worker Scaling Recommendation**: Maintain `5 pod replicas` baseline with auto-scaling to `20`.
