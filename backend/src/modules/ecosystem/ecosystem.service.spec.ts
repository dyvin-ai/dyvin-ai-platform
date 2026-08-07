import { Test, TestingModule } from '@nestjs/testing';
import { AgencyService } from './services/agency.service';
import { PartnerService } from './services/partner.service';
import { ReferralService } from './services/referral.service';
import { AcademyService } from './services/academy.service';
import { CommunityService } from './services/community.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase Q: Enterprise Partner Ecosystem Spec', () => {
  let agencyService: AgencyService;
  let partnerService: PartnerService;
  let referralService: ReferralService;
  let academyService: AcademyService;
  let communityService: CommunityService;

  const mockPrismaService = {
    agencyProfile: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'agency-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'agency-1', agencyName: 'Acme Agency' }]),
    },
    partnerProfile: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'partner-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'partner-1', companyName: 'CloudCorp' }]),
    },
    ecosystemReferral: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ref-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'ref-1', refCode: 'REF123' }]),
    },
    professionalCertificate: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'cert-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgencyService,
        PartnerService,
        ReferralService,
        AcademyService,
        CommunityService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    agencyService = module.get<AgencyService>(AgencyService);
    partnerService = module.get<PartnerService>(PartnerService);
    referralService = module.get<ReferralService>(ReferralService);
    academyService = module.get<AcademyService>(AcademyService);
    communityService = module.get<CommunityService>(CommunityService);
  });

  it('should register and verify certified agencies', async () => {
    const agency = await agencyService.registerAgency('Acme Agency', 'GOLD');
    expect(agency).toBeDefined();
    expect(agency.agencyName).toBe('Acme Agency');

    const list = await agencyService.getAgencies();
    expect(list.length).toBeGreaterThan(0);
  });

  it('should manage technology and consulting partners', async () => {
    const partner = await partnerService.registerPartner('CloudCorp', 'TECHNOLOGY');
    expect(partner.companyName).toBe('CloudCorp');
  });

  it('should create and track affiliate referrals', async () => {
    const ref = await referralService.createReferral('user-100', 'REF123');
    expect(ref.refCode).toBe('REF123');
    expect(ref.commissionUsd).toBe(250.0);
  });

  it('should list academy courses and issue professional certificates', async () => {
    const courses = await academyService.getCourses();
    expect(courses.length).toBeGreaterThan(0);

    const cert = await academyService.issueCertificate('user-100', 'Certified GEO Specialist');
    expect(cert.certName).toBe('Certified GEO Specialist');
  });

  it('should manage community posts and upcoming virtual webinars', async () => {
    const posts = await communityService.getPosts();
    expect(posts.length).toBeGreaterThan(0);

    const events = await communityService.getEvents();
    expect(events.length).toBeGreaterThan(0);
  });
});
