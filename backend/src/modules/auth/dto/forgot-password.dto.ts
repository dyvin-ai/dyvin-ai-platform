import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'alex@company.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
