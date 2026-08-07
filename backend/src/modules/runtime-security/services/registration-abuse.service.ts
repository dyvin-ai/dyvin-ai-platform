import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class RegistrationAbuseService {
  private readonly logger = new Logger(RegistrationAbuseService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkRegistration(email: string) {
    const isDisposable = email.includes('disposable') || email.includes('mailinator');
    return this.prisma.runtimeRegistrationAbuseLog.create({
      data: {
        email,
        isDisposable,
        riskScore: isDisposable ? 95.0 : 5.0,
      },
    });
  }
}
