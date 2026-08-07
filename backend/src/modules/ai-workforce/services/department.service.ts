import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DepartmentService {
  private readonly logger = new Logger(DepartmentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createDepartment(departmentName: string, headcount = 5) {
    return this.prisma.employeeDepartment.create({
      data: {
        departmentName,
        headcount,
      },
    });
  }

  async getDepartments() {
    return [
      { departmentName: 'GEO & Search Visibility', headcount: 8 },
      { departmentName: 'Content & Technical Docs', headcount: 6 },
      { departmentName: 'Customer Success & Support', headcount: 5 },
      { departmentName: 'Engineering & DevOps', headcount: 10 },
    ];
  }
}
