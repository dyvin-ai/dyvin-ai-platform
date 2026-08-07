import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class UpdateWebsiteDto {
  @ApiPropertyOptional({ example: 'https://docs.dyvin.ai' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
