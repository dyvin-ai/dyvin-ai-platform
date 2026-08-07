import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

export interface DetectedTechnology {
  name: string;
  category: string;
  confidence: number;
  version?: string;
}

@Injectable()
export class TechnologyDetectorService {
  detectTechnologies(
    html: string,
    headers: Record<string, any> = {},
  ): DetectedTechnology[] {
    const $ = cheerio.load(html);
    const detected: DetectedTechnology[] = [];
    const htmlString = $.html();
    const serverHeader = String(headers['server'] || '');

    // Next.js
    if (
      $('#__NEXT_DATA__').length > 0 ||
      htmlString.includes('_next/static') ||
      headers['x-nextjs-cache']
    ) {
      detected.push({
        name: 'Next.js',
        category: 'Web Framework',
        confidence: 100,
      });
      detected.push({ name: 'React', category: 'JavaScript UI Library', confidence: 100 });
    }

    // React
    if (
      !detected.some((t) => t.name === 'React') &&
      (htmlString.includes('data-reactroot') ||
        htmlString.includes('react-dom') ||
        htmlString.includes('_reactListening'))
    ) {
      detected.push({ name: 'React', category: 'JavaScript UI Library', confidence: 90 });
    }

    // Vue.js
    if (
      htmlString.includes('data-v-') ||
      htmlString.includes('vue.global.js') ||
      htmlString.includes('vue.runtime')
    ) {
      detected.push({ name: 'Vue.js', category: 'Web Framework', confidence: 95 });
    }

    // Angular
    if (
      htmlString.includes('ng-version=') ||
      htmlString.includes('ng-app=') ||
      htmlString.includes('ng-content=')
    ) {
      const versionMatch = htmlString.match(/ng-version="([^"]+)"/);
      detected.push({
        name: 'Angular',
        category: 'Web Framework',
        confidence: 100,
        version: versionMatch ? versionMatch[1] : undefined,
      });
    }

    // WordPress
    if (
      htmlString.includes('wp-content') ||
      htmlString.includes('wp-includes') ||
      $('meta[name="generator"]').attr('content')?.includes('WordPress')
    ) {
      detected.push({ name: 'WordPress', category: 'CMS', confidence: 100 });
    }

    // Shopify
    if (
      htmlString.includes('cdn.shopify.com') ||
      htmlString.includes('Shopify.theme')
    ) {
      detected.push({ name: 'Shopify', category: 'E-commerce Platform', confidence: 100 });
    }

    // Webflow
    if (
      htmlString.includes('w-custom-compiler') ||
      $('html').attr('data-wf-page') ||
      htmlString.includes('uploads-ssl.webflow.com')
    ) {
      detected.push({ name: 'Webflow', category: 'Site Builder', confidence: 100 });
    }

    // Wix
    if (
      htmlString.includes('wix.com') ||
      htmlString.includes('static.wixstatic.com') ||
      $('meta[name="generator"]').attr('content')?.includes('Wix.com')
    ) {
      detected.push({ name: 'Wix', category: 'Site Builder', confidence: 100 });
    }

    // Cloudflare
    if (
      serverHeader.toLowerCase().includes('cloudflare') ||
      headers['cf-ray'] ||
      htmlString.includes('cf-email')
    ) {
      detected.push({ name: 'Cloudflare', category: 'CDN / Security', confidence: 100 });
    }

    // Google Analytics / GTM
    if (
      htmlString.includes('google-analytics.com') ||
      htmlString.includes('gtag(') ||
      htmlString.includes('ga(\'create')
    ) {
      detected.push({ name: 'Google Analytics', category: 'Analytics', confidence: 100 });
    }

    if (
      htmlString.includes('googletagmanager.com/gtm.js') ||
      htmlString.includes('GTM-')
    ) {
      detected.push({ name: 'Google Tag Manager', category: 'Tag Management', confidence: 100 });
    }

    // Meta Pixel
    if (
      htmlString.includes('connect.facebook.net') ||
      htmlString.includes('fbq(\'init')
    ) {
      detected.push({ name: 'Meta Pixel', category: 'Analytics / Advertising', confidence: 100 });
    }

    return detected;
  }
}
