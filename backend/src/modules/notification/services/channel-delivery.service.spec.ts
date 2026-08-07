import { Test, TestingModule } from '@nestjs/testing';
import { ChannelType, DeliveryStatus } from '@prisma/client';
import { ChannelDeliveryService } from './channel-delivery.service';

describe('ChannelDeliveryService', () => {
  let service: ChannelDeliveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelDeliveryService],
    }).compile();

    service = module.get<ChannelDeliveryService>(ChannelDeliveryService);
  });

  it('should deliver email notification payload', async () => {
    const res = await service.deliver({
      notificationId: 'n-1',
      channelType: ChannelType.EMAIL,
      recipient: 'user@example.com',
      title: 'Analysis Completed',
      message: 'Visibility Analysis completed for Dyvin AI',
    });
    expect(res.status).toBe(DeliveryStatus.DELIVERED);
  });

  it('should deliver slack notification payload', async () => {
    const res = await service.deliver({
      notificationId: 'n-1',
      channelType: ChannelType.SLACK,
      recipient: 'slack-webhook-url',
      title: 'Monitoring Alert',
      message: 'Critical website change detected',
    });
    expect(res.status).toBe(DeliveryStatus.DELIVERED);
  });
});
