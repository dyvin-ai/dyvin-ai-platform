import { ApiProperty } from '@nestjs/swagger';
import { VerificationMethod } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class InitiateVerificationDto {
  @ApiProperty({ enum: VerificationMethod, example: VerificationMethod.DNS_TXT })
  @IsEnum(VerificationMethod)
  @IsNotEmpty()
  method!: VerificationMethod;
}
