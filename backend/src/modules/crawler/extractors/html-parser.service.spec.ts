import { HtmlParserService } from './html-parser.service';

describe('HtmlParserService', () => {
  let service: HtmlParserService;

  beforeEach(() => {
    service = new HtmlParserService();
  });

  it('should parse HTML metadata, headings, word count, and links correctly', () => {
    const sampleHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Dyvin AI - Visibility Intelligence Engine</title>
        <meta name="description" content="Help businesses become understood by AI" />
        <meta name="keywords" content="AI, SEO, Visibility" />
        <meta property="og:title" content="Dyvin AI Platform" />
        <link rel="canonical" href="https://dyvin.ai/" />
      </head>
      <body>
        <h1>Welcome to Dyvin AI</h1>
        <h2>Empowering Business Visibility</h2>
        <p>Dyvin AI analyzes how AI systems understand your business entity across the web.</p>
        <a href="https://dyvin.ai/pricing">Pricing</a>
        <a href="https://google.com">Google Search</a>
        <img src="https://dyvin.ai/logo.png" alt="Dyvin Logo" />
      </body>
      </html>
    `;

    const result = service.parseHtml(sampleHtml, 'https://dyvin.ai');

    expect(result.title).toBe('Dyvin AI - Visibility Intelligence Engine');
    expect(result.metaDescription).toBe('Help businesses become understood by AI');
    expect(result.keywords).toBe('AI, SEO, Visibility');
    expect(result.canonicalUrl).toBe('https://dyvin.ai/');
    expect(result.headings.h1).toContain('Welcome to Dyvin AI');
    expect(result.headings.h2).toContain('Empowering Business Visibility');
    expect(result.wordCount).toBeGreaterThan(5);
    expect(result.internalLinks).toHaveLength(1);
    expect(result.externalLinks).toHaveLength(1);
    expect(result.images).toHaveLength(1);
    expect(result.contentHash).toBeDefined();
    expect(result.language).toBe('en');
  });
});
