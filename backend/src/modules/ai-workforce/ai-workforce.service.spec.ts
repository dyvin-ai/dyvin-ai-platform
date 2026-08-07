import { Test, TestingModule } from '@nestjs/testing';
import { WorkforceDashboardService } from './services/workforce-dashboard.service';
import { DigitalEmployeeService } from './services/digital-employee.service';
import { DepartmentService } from './services/department.service';
import { TaskAssignmentService } from './services/task-assignment.service';
import { CollaborationService } from './services/collaboration.service';
import { PerformanceService } from './services/performance.service';
import { TrainingService } from './services/training.service';
import { SchedulingService } from './services/scheduling.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase V: Enterprise Autonomous AI Workforce Spec', () => {
  let dashboardService: WorkforceDashboardService;
  let employeeService: DigitalEmployeeService;
  let departmentService: DepartmentService;
  let taskService: TaskAssignmentService;
  let collaborationService: CollaborationService;
  let performanceService: PerformanceService;
  let trainingService: TrainingService;
  let schedulingService: SchedulingService;

  const mockPrismaService = {
    digitalEmployee: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'emp-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'emp-1', employeeName: 'Alex GEO Specialist' }]),
    },
    employeeDepartment: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'dept-1', ...data })),
    },
    workforceTask: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'task-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'task-1', taskTitle: 'Publish Wikipedia Citations' }]),
    },
    workforcePerformance: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'perf-1', ...data })),
    },
    workforceTraining: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'train-1', ...data })),
    },
    workforceCertification: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'cert-1', ...data })),
    },
    workforceSchedule: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'sched-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'sched-1', shiftName: '24_7_CONTINUOUS' }]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkforceDashboardService,
        DigitalEmployeeService,
        DepartmentService,
        TaskAssignmentService,
        CollaborationService,
        PerformanceService,
        TrainingService,
        SchedulingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    dashboardService = module.get<WorkforceDashboardService>(WorkforceDashboardService);
    employeeService = module.get<DigitalEmployeeService>(DigitalEmployeeService);
    departmentService = module.get<DepartmentService>(DepartmentService);
    taskService = module.get<TaskAssignmentService>(TaskAssignmentService);
    collaborationService = module.get<CollaborationService>(CollaborationService);
    performanceService = module.get<PerformanceService>(PerformanceService);
    trainingService = module.get<TrainingService>(TrainingService);
    schedulingService = module.get<SchedulingService>(SchedulingService);
  });

  it('should hire AI Digital Employees and list departments', async () => {
    const emp = await employeeService.hireEmployee('org-1', 'Alex GEO Specialist', 'GEO_ENGINEER', 'GEO_MARKETING');
    expect(emp.employeeName).toBe('Alex GEO Specialist');
    expect(emp.department).toBe('GEO_MARKETING');

    const depts = await departmentService.getDepartments();
    expect(depts.length).toBeGreaterThan(0);
  });

  it('should assign workforce tasks and facilitate collaboration', async () => {
    const task = await taskService.assignTask('org-1', 'Publish Technical Docs', 'emp-1');
    expect(task.taskTitle).toBe('Publish Technical Docs');

    const collab = await collaborationService.logCollaborationEvent('emp-1', 'user-1', 'Completed citation verification');
    expect(collab.status).toBe('HANDOFF_COMPLETED');
  });

  it('should measure workforce performance and issue training certifications', async () => {
    const perf = await performanceService.evaluateEmployee('emp-1', 140, 99.2);
    expect(perf.accuracyPct).toBe(99.2);

    const cert = await trainingService.issueCertification('emp-1', 'Certified GEO Specialist');
    expect(cert.certificateName).toBe('Certified GEO Specialist');
  });

  it('should manage 24/7 continuous work schedules', async () => {
    const sched = await schedulingService.createSchedule('emp-1', '24_7_CONTINUOUS');
    expect(sched.shiftName).toBe('24_7_CONTINUOUS');

    const schedules = await schedulingService.getWorkforceSchedules();
    expect(schedules.length).toBeGreaterThan(0);
  });

  it('should provide executive workforce dashboard metrics', async () => {
    const overview = await dashboardService.getWorkforceOverview();
    expect(overview.activeDigitalEmployeesCount).toBeGreaterThan(0);
  });
});
