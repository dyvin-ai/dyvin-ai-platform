export interface BillingPlan {
  id: string;
  planCode: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: Record<string, number>;
}

export interface SubscriptionOverview {
  id: string;
  planCode: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface UsageMetric {
  metric: string;
  current: number;
  limit: number;
  unit: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  issuedAt: string;
}

export interface TenantItem {
  id: string;
  name: string;
  plan: string;
  status: string;
  usersCount: number;
  region: string;
}

export interface SupportTicketItem {
  id: string;
  subject: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

export interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  isKillSwitched: boolean;
  strategy: string;
  percentage?: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  resource: string;
  timestamp: string;
}
