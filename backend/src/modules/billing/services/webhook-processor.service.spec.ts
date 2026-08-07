import { Test, TestingModule } from '@nestjs/testing';
import { PaymentProviderCode, WebhookEventStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';
import { WebhookProcessorService } from './webhook-processor.service';

describe('WebhookProcessorService', () => {
  let service: WebhookProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookProcessorService,
        {
          provide: PrismaService,
          useValue: {
            webhookEvent: {
              findUnique: jest.fn().mockResolvedValue(null),
              upsert: jest.fn().mockResolvedValue({ id: 'evt-1', status: WebhookEventStatus.PROCESSED }),
            },
          },
        },
        {
          provide: PaymentProviderRouter,
          useValue: {
            getProvider: jest.fn().mockReturnValue({
              verifyWebhookSignature: jest.fn().mockReturnValue(true),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<WebhookProcessorService>(WebhookProcessorService);
  });

  it('should verify signature and process inbound webhook event', async () => {
    const res = await service.processWebhook({
      providerCode: PaymentProviderCode.MOCK,
      signature: 'valid_sig',
      body: { id: 'evt_100', type: 'invoice.paid' },
    });
    expect(res.success).toBe(true);
    expect(res.status).toBe(WebhookEventStatus.PROCESSED);
  });
});
