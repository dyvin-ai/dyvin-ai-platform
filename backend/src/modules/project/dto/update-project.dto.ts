import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus, ProjectVisibility } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Dyvin AI Enterprise' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated project description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'SaaS / AI' })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ example: '50-200' })
  @IsOptional()
  @IsString()
  businessSize?: string;

  @ApiPropertyOptional({ example: 'US' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'UTC' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'https://cdn.dyvin.ai/logos/dyvin-new.png' })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ example: 'https://dyvin.ai/favicon.ico' })
  @IsOptional()
  @IsUrl()
  favicon?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: ProjectVisibility })
  @IsOptional()
  @IsEnum(ProjectVisibility)
  visibility?: ProjectVisibility;
}
