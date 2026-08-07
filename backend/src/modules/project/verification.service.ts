import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { VerificationMethod, VerificationStatus } from '@prisma/client';
import { generateRandomToken } from '../../common/utils/password.util';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { InitiateVerificationDto } from './dto/initiate-verification.dto';

export interface VerificationInstructions {
  method: VerificationMethod;
  verificationToken: string;
  instructions: {
    dnsRecord?: { type: 'TXT'; name: string; value: string };
    metaTag?: { name: 'dyvin-verification'; content: string };
    htmlFile?: { fileName: string; fileContent: string; expectedUrl: string };
  };
}

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async initiateVerification(
    websiteId: string,
    dto: InitiateVerificationDto,
    userId: string,
    organizationId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<VerificationInstructions> {
    const website = await this.prisma.website.findFirst({
      where: { id: websiteId, deletedAt: null },
    });

    if (!website) {
      throw new NotFoundException('Website not found.');
    }

    const verificationToken = `dyvin-verify-${generateRandomToken(16)}`;

    // Create verification request record
    const record = await this.prisma.websiteVerification.create({
      data: {
        websiteId,
        method: dto.method,
        verificationToken,
        status: VerificationStatus.PENDING,
      },
    });

    // Update website verificationStatus to PENDING
    await this.prisma.website.update({
      where: { id: websiteId },
      data: {
        verificationStatus: VerificationStatus.PENDING,
        verificationMethod: dto.method,
      },
    });

    await this.auditService.logAction({
      userId,
      organizationId,
      action: 'VERIFICATION_REQUESTED',
      ipAddress,
      userAgent,
      metadata: { websiteId, method: dto.method, verificationToken },
    });

    let instructions: VerificationInstructions['instructions'] = {};

    switch (dto.method) {
      case VerificationMethod.DNS_TXT:
        instructions = {
          dnsRecord: {
            type: 'TXT',
            name: `@`,
            value: `dyvin-verification=${verificationToken}`,
          },
        };
        break;
      case VerificationMethod.META_TAG:
        instructions = {
          metaTag: {
            name: 'dyvin-verification',
            content: verificationToken,
          },
        };
        break;
      case VerificationMethod.HTML_FILE:
        const fileName = `dyvin-${verificationToken.substring(0, 10)}.html`;
        instructions = {
          htmlFile: {
            fileName,
            fileContent: `dyvin-verification=${verificationToken}`,
            expectedUrl: `${website.url}/${fileName}`,
          },
        };
        break;
      default:
        throw new BadRequestException('Unsupported verification method.');
    }

    return {
      method: dto.method,
      verificationToken,
      instructions,
    };
  }
}
