import { Test, TestingModule } from '@nestjs/testing';
import { PromptEngine } from '../../ai/services/prompt-engine.service';
import { ProviderRouter } from '../../ai/services/provider-router.service';
import { ContentGeneratorService } from './content-generator.service';

describe('ContentGeneratorService', () => {
  let service: ContentGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentGeneratorService,
        { provide: ProviderRouter, useValue: {} },
        { provide: PromptEngine, useValue: {} },
      ],
    }).compile();

    service = module.get<ContentGeneratorService>(ContentGeneratorService);
  });

  it('should generate valid JSON-LD schema asset', async () => {
    const asset = await service.generateSchemaAsset('Add Organization Schema', 'SCHEMA');
    expect(asset.exportFormat).toBe('json');
    expect(asset.codeContent).toContain('schema.org');
  });

  it('should generate valid SEO metadata asset', async () => {
    const asset = await service.generateSeoAsset('Optimize Meta Description');
    expect(asset.exportFormat).toBe('html');
    expect(asset.codeContent).toContain('<title>');
  });
});
