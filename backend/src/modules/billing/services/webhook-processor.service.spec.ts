import { Test, TestingModule } from '@nestjs/testing';
import { PaymentProviderCode, WebhookEventStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PaymentProviderRouter } from '../providers/payment-provider-router.service';
import { WebhookProcessorService } from './webhook-processor.service';

describe('WebhookProcessorService', () => {
  let service: WebhookProcessorService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      webhookEvent: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({ id: 'evt-1', status: WebhookEventStatus.PROCESSED }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookProcessorService,
        {
          provide: PrismaService,
          useValue: prismaMock,
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

  it('should reject a non-MOCK webhook event with a missing signature', async () => {
    await expect(
      service.processWebhook({
        providerCode: PaymentProviderCode.STRIPE,
        signature: '',
        body: { id: 'evt_200', type: 'invoice.paid' },
        rawBody: '{"id":"evt_200"}',
      }),
    ).rejects.toThrow('Missing webhook signature');
  });

  it('should return idempotent response when event was already processed', async () => {
    prismaMock.webhookEvent.findUnique.mockResolvedValue({
      eventId: 'evt_100',
      status: WebhookEventStatus.PROCESSED,
    });

    const res = await service.processWebhook({
      providerCode: PaymentProviderCode.MOCK,
      signature: 'sig',
      body: { id: 'evt_100', type: 'invoice.paid' },
    });

    expect(res.message).toBe('Webhook event already processed.');
    expect(prismaMock.webhookEvent.upsert).not.toHaveBeenCalled();
  });
});
