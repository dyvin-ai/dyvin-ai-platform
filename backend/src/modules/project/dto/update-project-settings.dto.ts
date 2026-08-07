import { ApiPropertyOptional } from '@nestjs/swagger';
import { ScanFrequency } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateProjectSettingsDto {
  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ enum: ScanFrequency, example: ScanFrequency.WEEKLY })
  @IsOptional()
  @IsEnum(ScanFrequency)
  scanFrequency?: ScanFrequency;

  @ApiPropertyOptional({ example: { email: true, slack: false } })
  @IsOptional()
  @IsObject()
  notificationPreferences?: Record<string, any>;

  @ApiPropertyOptional({ example: { openai: true, anthropic: true, perplexity: true } })
  @IsOptional()
  @IsObject()
  aiProvidersEnabled?: Record<string, any>;

  @ApiPropertyOptional({ example: { format: 'pdf', includeGraphs: true } })
  @IsOptional()
  @IsObject()
  defaultReportSettings?: Record<string, any>;
}
