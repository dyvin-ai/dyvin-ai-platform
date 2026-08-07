import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProjectSettingsDto } from './dto/update-project-settings.dto';

@Injectable()
export class ProjectSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(projectId: string) {
    const settings = await this.prisma.projectSettings.findUnique({
      where: { projectId },
    });

    if (!settings) {
      throw new NotFoundException('Project settings not found.');
    }

    return settings;
  }

  async updateSettings(projectId: string, dto: UpdateProjectSettingsDto) {
    const settings = await this.getSettings(projectId);

    return this.prisma.projectSettings.update({
      where: { id: settings.id },
      data: {
        ...(dto.language !== undefined && { language: dto.language }),
        ...(dto.scanFrequency !== undefined && { scanFrequency: dto.scanFrequency }),
        ...(dto.notificationPreferences !== undefined && {
          notificationPreferences: dto.notificationPreferences,
        }),
        ...(dto.aiProvidersEnabled !== undefined && {
          aiProvidersEnabled: dto.aiProvidersEnabled,
        }),
        ...(dto.defaultReportSettings !== undefined && {
          defaultReportSettings: dto.defaultReportSettings,
        }),
      },
    });
  }
}
