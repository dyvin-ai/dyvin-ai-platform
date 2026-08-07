import { Injectable, Logger } from '@nestjs/common';
import { EcoAgentStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface ExportAgentInput {
  organizationId: string;
  packageName: string;
  version?: string;
  configJson?: Record<string, any>;
}

@Injectable()
export class AgentPackageExportService {
  private readonly logger = new Logger(AgentPackageExportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async exportAgentPackage(input: ExportAgentInput) {
    this.logger.log(`Exporting AI agent package ${input.packageName}`);

    return this.prisma.agentPackage.create({
      data: {
        organizationId: input.organizationId,
        packageName: input.packageName,
        version: input.version || '1.0.0',
        packageJson: input.configJson || { name: input.packageName, capabilities: ['SEO', 'Search'] },
      },
    });
  }

  async importAgentPackage(organizationId: string, packageJson: Record<string, any>) {
    return this.prisma.agentPackage.create({
      data: {
        organizationId,
        packageName: packageJson.name || 'imported_agent',
        version: packageJson.version || '1.0.0',
        packageJson,
      },
    });
  }

  async versionAgent(agentId: string, versionStr: string) {
    return this.prisma.agentVersion.create({
      data: {
        agentId,
        versionStr,
        status: EcoAgentStatus.PUBLISHED,
      },
    });
  }

  async rollbackAgent(agentId: string, targetVersion: string) {
    this.logger.log(`Rolling back agent ${agentId} to version ${targetVersion}`);
    return { agentId, rolledBackTo: targetVersion, status: 'SUCCESS' };
  }
}
