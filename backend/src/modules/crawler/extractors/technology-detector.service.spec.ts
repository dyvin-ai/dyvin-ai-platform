import { TechnologyDetectorService } from './technology-detector.service';

describe('TechnologyDetectorService', () => {
  let service: TechnologyDetectorService;

  beforeEach(() => {
    service = new TechnologyDetectorService();
  });

  it('should detect Next.js and React signatures correctly', () => {
    const html = `
      <html>
      <body>
        <div id="__NEXT_DATA__">{}</div>
        <script src="/_next/static/chunks/main.js"></script>
      </body>
      </html>
    `;

    const techs = service.detectTechnologies(html, { server: 'cloudflare' });
    const names = techs.map((t) => t.name);

    expect(names).toContain('Next.js');
    expect(names).toContain('React');
    expect(names).toContain('Cloudflare');
  });
});
