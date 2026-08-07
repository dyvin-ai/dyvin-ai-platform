# Terraform Infrastructure-as-Code Architecture

## 1. Module Structure (`infrastructure/terraform/`)

- **VPC Module**: Multi-AZ VPC (`10.0.0.0/16`) with 3 Private Subnets, 3 Public Subnets, NAT Gateways.
- **EKS Module**: Kubernetes `v1.28` managed node groups (`m6i.xlarge`, 3–20 nodes).
- **State Backend**: S3 (`dyvin-tf-state-prod`) with DynamoDB lock table (`dyvin-tf-locks`).

---

## 2. Infrastructure Deployment Commands

```bash
cd infrastructure/terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```
