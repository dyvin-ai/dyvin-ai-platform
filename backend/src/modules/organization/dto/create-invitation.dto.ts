import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ example: 'team.member@company.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ enum: Role, default: Role.MEMBER })
  @IsEnum(Role)
  role: Role = Role.MEMBER;
}
