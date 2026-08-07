import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DigitalEmployeeService {
  private readonly logger = new Logger(DigitalEmployeeService.name);

  constructor(private readonly prisma: PrismaService) {}

  async hireEmployee(organizationId: string, employeeName: string, role: string, department = 'GEO_MARKETING') {
    return this.prisma.digitalEmployee.create({
      data: {
        organizationId,
        employeeName,
        role,
        department,
        availability: 'AVAILABLE',
      },
    });
  }

  async getEmployees(organizationId: string) {
    return this.prisma.digitalEmployee.findMany({
      where: { organizationId },
    });
  }
}
