import { Test, TestingModule } from '@nestjs/testing';
import { APIKeyService } from './api-key.service';
import { OAuthServerService } from './oauth-server.service';
import { PrismaService } from '../../../database/prisma.service';
import { APIKeyStatus, OAuthGrantType } from '@prisma/client';

describe('APIKeyService & OAuthServerService', () => {
  let apiKeyService: APIKeyService;
  let oauthService: OAuthServerService;

  const mockPrismaService = {
    developerAPIKey: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'key-1', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    developerOAuthToken: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'tok-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        APIKeyService,
        OAuthServerService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    apiKeyService = module.get<APIKeyService>(APIKeyService);
    oauthService = module.get<OAuthServerService>(OAuthServerService);
  });

  it('should generate hashed API Key securely', async () => {
    const result = await apiKeyService.createAPIKey({
      applicationId: 'app-123',
    });

    expect(result).toBeDefined();
    expect(result.rawKey).toBeDefined();
    expect(result.rawKey).toContain('dyv_');
    expect(result.apiKey.keyHash).toBeDefined();
  });

  it('should issue OAuth2 access token for Client Credentials', async () => {
    const result = await oauthService.generateToken({
      clientId: 'client-123',
      grantType: OAuthGrantType.CLIENT_CREDENTIALS,
    });

    expect(result).toBeDefined();
    expect(result.accessToken).toContain('oauth_at_');
    expect(result.grantType).toBe(OAuthGrantType.CLIENT_CREDENTIALS);
  });
});
