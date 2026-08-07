import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateWebsiteDto {
  @ApiProperty({ example: 'https://blog.dyvin.ai', description: 'Website URL' })
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @ApiPropertyOptional({ example: false, description: 'Set as primary website domain' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
