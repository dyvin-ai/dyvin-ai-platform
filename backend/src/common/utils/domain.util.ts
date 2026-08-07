import { URL } from 'url';

/**
 * Normalizes a raw URL string to a clean, canonical format.
 * Fixes protocol, lowercases hostname, strips trailing slash, removes fragments.
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('URL string is required');
  }

  let cleaned = rawUrl.trim();

  // Add https protocol if missing
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const parsed = new URL(cleaned);
    parsed.hostname = parsed.hostname.toLowerCase();
    
    // Canonical format: protocol + hostname + pathname (without trailing slash unless root)
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    return `${parsed.protocol}//${parsed.hostname}${pathname === '/' ? '' : pathname}${parsed.search}`;
  } catch {
    throw new Error(`Invalid URL format: ${rawUrl}`);
  }
}

/**
 * Validates domain name syntax.
 */
export function validateDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') return false;
  const cleaned = domain.trim().toLowerCase();
  
  // RFC 1035 / RFC 1123 hostname regex pattern
  const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  
  return domainRegex.test(cleaned);
}

/**
 * Extracts apex domain (e.g., dyvin.ai from https://sub.dyvin.ai/path).
 */
export function extractDomain(rawUrl: string): string {
  const normalized = normalizeUrl(rawUrl);
  const parsed = new URL(normalized);
  const hostname = parsed.hostname;

  const parts = hostname.split('.');
  if (parts.length <= 2) {
    return hostname;
  }

  // Handle common TLDs with 2 parts like .co.uk, .com.au
  const doubleTlds = ['co.uk', 'com.au', 'co.jp', 'org.uk', 'gov.uk'];
  const lastTwo = parts.slice(-2).join('.');
  if (doubleTlds.includes(lastTwo) && parts.length > 2) {
    return parts.slice(-3).join('.');
  }

  return parts.slice(-2).join('.');
}

/**
 * Extracts subdomain portion (e.g., 'sub' or 'api.staging' or null if apex).
 */
export function extractSubdomain(rawUrl: string): string | null {
  const normalized = normalizeUrl(rawUrl);
  const parsed = new URL(normalized);
  const hostname = parsed.hostname;
  const apexDomain = extractDomain(rawUrl);

  if (hostname === apexDomain) {
    return null;
  }

  const subdomain = hostname.substring(0, hostname.length - apexDomain.length - 1);
  return subdomain.length > 0 ? subdomain : null;
}

/**
 * Generates canonical URL (stripping query parameters, hash fragments, and trailing slashes).
 */
export function generateCanonicalUrl(rawUrl: string): string {
  const normalized = normalizeUrl(rawUrl);
  const parsed = new URL(normalized);
  return `${parsed.protocol}//${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`;
}
