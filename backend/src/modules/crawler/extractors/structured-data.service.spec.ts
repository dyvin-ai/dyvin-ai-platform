import { StructuredDataService } from './structured-data.service';

describe('StructuredDataService', () => {
  let service: StructuredDataService;

  beforeEach(() => {
    service = new StructuredDataService();
  });

  it('should extract schema.org JSON-LD blocks correctly', () => {
    const htmlWithJsonLd = `
      <html>
      <head>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Dyvin AI",
          "url": "https://dyvin.ai"
        }
        </script>
      </head>
      <body></body>
      </html>
    `;

    const results = service.extractStructuredData(htmlWithJsonLd);
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('Organization');
    expect(results[0].rawJson.name).toBe('Dyvin AI');
  });
});
