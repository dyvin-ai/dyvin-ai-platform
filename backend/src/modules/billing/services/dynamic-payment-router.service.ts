import { Injectable, Logger } from '@nestjs/common';
import { PaymentProviderCode } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface RoutePaymentContext {
  countryCode: string;
  amount: number;
}

export interface PaymentRouteResult {
  providerCode: PaymentProviderCode;
  currency: string;
  taxName: string;
  taxRatePct: number;
}

@Injectable()
export class DynamicPaymentRouterService {
  private readonly logger = new Logger(DynamicPaymentRouterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async resolvePaymentRoute(context: RoutePaymentContext): Promise<PaymentRouteResult> {
    const country = context.countryCode.toUpperCase();

    // 1. Fetch Currency & Tax Rules
    const currRule = await this.prisma.currencyRule.findUnique({ where: { countryCode: country } });
    const taxRule = await this.prisma.taxRule.findUnique({ where: { countryCode: country } });

    const currency = currRule ? currRule.currency : 'USD';
    const taxName = taxRule ? taxRule.taxName : 'VAT';
    const taxRatePct = taxRule ? taxRule.taxRatePct : 0.0;

    // 2. Fetch Dynamic Payment Region
    const regions = await this.prisma.paymentRegion.findMany({
      include: { routes: { where: { isEnabled: true }, orderBy: { priority: 'asc' } } },
    });

    for (const region of regions) {
      const countries = (region.countryCodes as string[]) || [];
      if (countries.includes(country) && region.routes.length > 0) {
        const topRoute = region.routes[0];
        this.logger.log(`Dynamic Payment Route matched region [${region.name}] for country [${country}]: Provider [${topRoute.providerCode}]`);
        return {
          providerCode: topRoute.providerCode,
          currency,
          taxName,
          taxRatePct,
        };
      }
    }

    // Default Fallback
    const fallbackProvider = country === 'IN' ? PaymentProviderCode.RAZORPAY : PaymentProviderCode.STRIPE;
    return {
      providerCode: fallbackProvider,
      currency,
      taxName,
      taxRatePct,
    };
  }
}
