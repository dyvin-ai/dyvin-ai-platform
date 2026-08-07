import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

export interface SecurityEvaluation {
  hasHttps: boolean;
  hsts: boolean;
  csp: boolean;
  xFrameOptions: boolean;
  robotsMeta: string | null;
  score: number;
}

@Injectable()
export class SecurityDetectorService {
  evaluateSecurity(
    url: string,
    html: string,
    headers: Record<string, any> = {},
  ): SecurityEvaluation {
    const $ = cheerio.load(html);
    const hasHttps = url.toLowerCase().startsWith('https://');
    const hsts = Boolean(
      headers['strict-transport-security'] ||
        headers['Strict-Transport-Security'],
    );
    const csp = Boolean(
      headers['content-security-policy'] ||
        headers['Content-Security-Policy'] ||
        $('meta[http-equiv="Content-Security-Policy"]').length > 0,
    );
    const xFrameOptions = Boolean(
      headers['x-frame-options'] ||
        headers['X-Frame-Options'] ||
        $('meta[http-equiv="X-Frame-Options"]').length > 0,
    );

    const robotsMeta =
      $('meta[name="robots"]').attr('content')?.trim() ||
      (headers['x-robots-tag'] as string) ||
      null;

    let score = 0;
    if (hasHttps) score += 40;
    if (hsts) score += 25;
    if (csp) score += 20;
    if (xFrameOptions) score += 15;

    return {
      hasHttps,
      hsts,
      csp,
      xFrameOptions,
      robotsMeta,
      score,
    };
  }
}
