import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createSchedule(employeeId: string, shiftName = '24_7_CONTINUOUS') {
    return this.prisma.workforceSchedule.create({
      data: {
        employeeId,
        shiftName,
        status: 'ACTIVE',
      },
    });
  }

  async getWorkforceSchedules() {
    return this.prisma.workforceSchedule.findMany();
  }
}
