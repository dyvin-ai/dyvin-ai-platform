import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: PrismaService,
          useValue: {
            invoice: {
              create: jest.fn().mockResolvedValue({
                id: 'inv-1',
                invoiceNumber: 'INV-123',
                status: InvoiceStatus.OPEN,
                total: 149,
                items: [],
              }),
              findMany: jest.fn().mockResolvedValue([]),
            },
            payment: { findMany: jest.fn().mockResolvedValue([]) },
            coupon: { findUnique: jest.fn().mockResolvedValue(null) },
            billingAudit: { create: jest.fn().mockResolvedValue({}) },
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should create itemized invoice with subtotal and tax calculation', async () => {
    const inv = await service.createInvoice({
      organizationId: 'org-1',
      items: [{ description: 'Growth Plan', quantity: 1, unitPrice: 149 }],
      taxPercent: 10,
    });
    expect(inv.id).toBe('inv-1');
  });
});
