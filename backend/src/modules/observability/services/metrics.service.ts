import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generatePrometheusMetrics(): Promise<string> {
    const orgCount = await this.prisma.organization.count();
    const projectCount = await this.prisma.project.count();
    const websiteCount = await this.prisma.website.count();
    const scanCount = await this.prisma.scan.count();
    const scanCompletedCount = await this.prisma.scan.count({ where: { status: 'COMPLETED' } });
    const aiRequestCount = await this.prisma.aIRequest.count();
    const recCount = await this.prisma.recommendation.count();
    const reportCount = await this.prisma.report.count();
    const paymentCount = await this.prisma.payment.count({ where: { status: 'SUCCEEDED' } });

    return `
# HELP dyvin_organizations_total Total registered organizations
# TYPE dyvin_organizations_total counter
dyvin_organizations_total ${orgCount}

# HELP dyvin_projects_total Total created projects
# TYPE dyvin_projects_total counter
dyvin_projects_total ${projectCount}

# HELP dyvin_websites_total Total registered websites
# TYPE dyvin_websites_total counter
dyvin_websites_total ${websiteCount}

# HELP dyvin_scans_total Total scans executed
# TYPE dyvin_scans_total counter
dyvin_scans_total ${scanCount}

# HELP dyvin_scans_completed_total Total successful scans
# TYPE dyvin_scans_completed_total counter
dyvin_scans_completed_total ${scanCompletedCount}

# HELP dyvin_ai_requests_total Total AI Provider requests
# TYPE dyvin_ai_requests_total counter
dyvin_ai_requests_total ${aiRequestCount}

# HELP dyvin_recommendations_total Total visibility recommendations
# TYPE dyvin_recommendations_total counter
dyvin_recommendations_total ${recCount}

# HELP dyvin_reports_total Total generated intelligence reports
# TYPE dyvin_reports_total counter
dyvin_reports_total ${reportCount}

# HELP dyvin_successful_payments_total Total succeeded billing payments
# TYPE dyvin_successful_payments_total counter
dyvin_successful_payments_total ${paymentCount}
`.trim();
  }
}
