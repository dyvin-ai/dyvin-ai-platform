import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { DynamicPaymentRouterService } from '../../billing/services/dynamic-payment-router.service';

export interface MigrateLocalizationInput {
  organizationId: string;
  userId: string;
  newCountry: string;
  newTimezone?: string;
  newLanguage?: string;
}

@Injectable()
export class LocalizationMigrationService {
  private readonly logger = new Logger(LocalizationMigrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly dynamicPaymentRouter: DynamicPaymentRouterService,
    private readonly auditService: AuditService,
  ) {}

  async migrateOrganizationLocalization(input: MigrateLocalizationInput) {
    // 1. Verify User is Organization OWNER
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: { organizationId: input.organizationId, userId: input.userId },
      },
    });

    if (!membership || membership.role !== Role.OWNER) {
      throw new ForbiddenException('Only Organization OWNER can request billing country and localization migrations.');
    }

    const org = await this.prisma.organization.findUnique({ where: { id: input.organizationId } });
    if (!org) throw new Error(`Organization [${input.organizationId}] not found.`);

    // 2. Compute New Dynamic Payment & Tax Route
    const routeResult = await this.dynamicPaymentRouter.resolvePaymentRoute({
      countryCode: input.newCountry,
      amount: 100,
    });

    // 3. Update Audit & Billing Migration
    await this.prisma.billingAudit.create({
      data: {
        organizationId: input.organizationId,
        userId: input.userId,
        action: 'LOCALIZATION_COUNTRY_MIGRATED',
        details: {
          previousCountry: 'US',
          newCountry: input.newCountry,
          newCurrency: routeResult.currency,
          newPaymentProvider: routeResult.providerCode,
          taxRatePct: routeResult.taxRatePct,
        },
      },
    });

    await this.auditService.logAction({
      userId: input.userId,
      organizationId: input.organizationId,
      action: 'ORGANIZATION_LOCALIZATION_MIGRATED',
      metadata: { newCountry: input.newCountry, provider: routeResult.providerCode },
    });

    return {
      success: true,
      organizationId: input.organizationId,
      newCountry: input.newCountry,
      newCurrency: routeResult.currency,
      paymentProvider: routeResult.providerCode,
      taxRatePct: routeResult.taxRatePct,
    };
  }
}
