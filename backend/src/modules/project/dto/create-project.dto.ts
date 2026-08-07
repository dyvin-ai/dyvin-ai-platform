import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectVisibility } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Dyvin AI Platform', description: 'Project / Business Name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'https://dyvin.ai', description: 'Primary Website URL' })
  @IsUrl()
  @IsNotEmpty()
  primaryUrl!: string;

  @ApiPropertyOptional({ example: 'AI visibility and optimization intelligence engine.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Software / Artificial Intelligence' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ example: '10-50 employees' })
  @IsOptional()
  @IsString()
  businessSize?: string;

  @ApiPropertyOptional({ example: 'US' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'https://cdn.dyvin.ai/logos/dyvin.png' })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://dyvin.ai/favicon.ico' })
  @IsOptional()
  @IsUrl()
  favicon?: string;

  @ApiPropertyOptional({ enum: ProjectVisibility, default: ProjectVisibility.TEAM })
  @IsOptional()
  @IsEnum(ProjectVisibility)
  visibility?: ProjectVisibility;
}
