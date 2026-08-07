import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Acme Global Corp' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'https://cdn.dyvin.ai/logos/acme-new.png' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
