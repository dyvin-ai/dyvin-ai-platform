import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({ description: 'Raw invitation token' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
