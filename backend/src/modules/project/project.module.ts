import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectSettingsService } from './project-settings.service';
import { ProjectService } from './project.service';
import { VerificationService } from './verification.service';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  controllers: [ProjectController, WebsiteController],
  providers: [
    ProjectService,
    WebsiteService,
    ProjectSettingsService,
    VerificationService,
  ],
  exports: [
    ProjectService,
    WebsiteService,
    ProjectSettingsService,
    VerificationService,
  ],
})
export class ProjectModule {}
