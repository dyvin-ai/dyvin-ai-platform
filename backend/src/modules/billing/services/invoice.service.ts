import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateInvoiceInput {
  organizationId: string;
  subscriptionId?: string;
  items: Array<{ description: string; quantity: number; unitPrice: number }>;
  taxPercent?: number;
  couponCode?: string;
}

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createInvoice(input: CreateInvoiceInput) {
    const subtotal = input.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const tax = input.taxPercent ? subtotal * (input.taxPercent / 100) : 0;
    let discountAmount = 0;

    if (input.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: input.couponCode },
      });
      if (coupon && coupon.isActive) {
        if (coupon.percentOff) {
          discountAmount = subtotal * (coupon.percentOff / 100);
        } else if (coupon.amountOff) {
          discountAmount = coupon.amountOff;
        }
      }
    }

    const total = Math.max(0, subtotal + tax - discountAmount);
    const invoiceNumber = `INV-${Date.now()}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const invoice = await this.prisma.invoice.create({
      data: {
        organizationId: input.organizationId,
        subscriptionId: input.subscriptionId,
        invoiceNumber,
        status: InvoiceStatus.OPEN,
        subtotal,
        tax,
        discount: discountAmount,
        total,
        dueDate,
        items: {
          create: input.items.map((i) => ({
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            amount: i.quantity * i.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    await this.prisma.billingAudit.create({
      data: {
        organizationId: input.organizationId,
        action: 'INVOICE_GENERATED',
        details: { invoiceId: invoice.id, invoiceNumber, total },
      },
    });

    return invoice;
  }

  async getInvoices(organizationId: string) {
    return this.prisma.invoice.findMany({
      where: { organizationId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayments(organizationId: string) {
    return this.prisma.payment.findMany({
      where: { subscription: { organizationId } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
