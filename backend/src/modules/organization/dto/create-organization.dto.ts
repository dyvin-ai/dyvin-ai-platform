import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme AI Corp', description: 'Organization name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'https://cdn.dyvin.ai/logos/acme.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
