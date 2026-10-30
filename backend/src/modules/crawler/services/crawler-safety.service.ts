import { Injectable, Logger } from '@nestjs/common';
import * as dns from 'dns';
import * as net from 'net';


export interface CrawlerSafetyOptions {
  maxDepth?: number;
  maxRedirects?: number;
  maxPageSizeBytes?: number;
  blockedExtensions?: string[];
  requestTimeoutMs?: number;
}

@Injectable()
export class CrawlerSafetyService {
  private readonly logger = new Logger(CrawlerSafetyService.name);
  private readonly defaultOptions: Required<CrawlerSafetyOptions> = {
    maxDepth: 5,
    maxRedirects: 3,
    maxPageSizeBytes: 10 * 1024 * 1024, // 10MB
    blockedExtensions: ['.pdf', '.zip', '.exe', '.mp4', '.mp3', '.tar.gz', '.iso', '.dmg'],
    requestTimeoutMs: 10000, // 10s
  };

  /**
   * Helper to check if an IP address belongs to private, loopback, or reserved ranges.
   */
  isPrivateOrReservedIp(ip: string): boolean {
    const cleanIp = ip.toLowerCase().replace(/^\[|\]$/g, '');

    // IPv4-mapped IPv6 check (::ffff:127.0.0.1)
    if (cleanIp.startsWith('::ffff:')) {
      const v4Part = cleanIp.slice(7);
      if (net.isIPv4(v4Part)) {
        return this.isPrivateOrReservedIp(v4Part);
      }
    }

    // IPv4 checks
    if (net.isIPv4(cleanIp)) {
      const parts = cleanIp.split('.').map((p) => parseInt(p, 10));
      const [a, b, c, d] = parts;

      if (a === 127) return true; // 127.0.0.0/8 Loopback
      if (a === 10) return true; // 10.0.0.0/8 Private
      if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 Private
      if (a === 192 && b === 168) return true; // 192.168.0.0/16 Private
      if (a === 169 && b === 254) return true; // 169.254.0.0/16 Link-Local / Cloud Metadata
      if (a === 0) return true; // 0.0.0.0/8
      if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 Carrier NAT
      if (a === 192 && b === 0 && c === 2) return true; // 192.0.2.0/24 TEST-NET-1
      if (a === 198 && b === 51 && c === 100) return true; // 198.51.100.0/24 TEST-NET-2
      if (a === 203 && b === 0 && c === 113) return true; // 203.0.113.0/24 TEST-NET-3
      if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 Benchmark
      if (a >= 224 && a <= 239) return true; // 224.0.0.0/4 Multicast
      if (a >= 240) return true; // 240.0.0.0/4 Reserved & Broadcast (255.255.255.255)
      return false;
    }

    // IPv6 checks
    if (net.isIPv6(cleanIp)) {
      if (cleanIp === '::1' || cleanIp === '::') return true; // Loopback & Unspecified
      if (/^fe[89ab]/i.test(cleanIp)) return true; // fe80::/10 Link-Local
      if (/^f[cd]/i.test(cleanIp)) return true; // fc00::/7 & fd00::/8 Unique Local
      if (/^ff/i.test(cleanIp)) return true; // ff00::/8 Multicast
      return false;
    }

    return false;
  }

  /**
   * Parse potential obfuscated IPv4 representations (decimal, hex, octal).
   */
  parseObfuscatedIp(host: string): string | null {
    // 32-bit integer decimal (e.g., 2130706433 -> 127.0.0.1)
    if (/^\d+$/.test(host)) {
      const num = parseInt(host, 10);
      if (num >= 0 && num <= 0xffffffff) {
        return [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255,
        ].join('.');
      }
    }

    // Hex representation (e.g., 0x7f000001)
    if (/^0x[0-9a-fA-F]+$/.test(host)) {
      const num = parseInt(host, 16);
      if (num >= 0 && num <= 0xffffffff) {
        return [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255,
        ].join('.');
      }
    }

    // Octal dotted notation (e.g. 0177.0.0.1)
    if (/^0\d+(\.0\d+)*$/.test(host)) {
      const parts = host.split('.');
      if (parts.length === 4) {
        const parsed = parts.map((p) => parseInt(p, 8));
        if (parsed.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
          return parsed.join('.');
        }
      }
    }

    return null;
  }

  validateUrlSafety(url: string, currentDepth: number = 0): { isAllowed: boolean; reason?: string } {
    try {
      const parsed = new URL(url);

      // 1. Check protocol
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { isAllowed: false, reason: `Unsupported protocol: ${parsed.protocol}` };
      }

      // 2. Normalize and check hostname
      const rawHost = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

      if (rawHost === 'localhost') {
        return {
          isAllowed: false,
          reason: 'Access to localhost network addresses is prohibited',
        };
      }

      // Check if host is direct or obfuscated IP
      const resolvedIp = this.parseObfuscatedIp(rawHost) || rawHost;
      if (this.isPrivateOrReservedIp(resolvedIp)) {
        return {
          isAllowed: false,
          reason: 'Access to private, loopback, or cloud metadata network addresses is prohibited',
        };
      }

      // Pattern regex checks for dotted subnets
      if (
        /^127\./.test(rawHost) ||
        /^169\.254\./.test(rawHost) ||
        /^10\./.test(rawHost) ||
        /^192\.168\./.test(rawHost) ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(rawHost) ||
        /^fe80:/i.test(rawHost) ||
        /^fc00:/i.test(rawHost) ||
        /^fd00:/i.test(rawHost)
      ) {
        return {
          isAllowed: false,
          reason: 'Access to private, loopback, or cloud metadata network addresses is prohibited',
        };
      }

      // 3. Check blocked file extensions
      const ext = parsed.pathname.substring(parsed.pathname.lastIndexOf('.')).toLowerCase();
      if (this.defaultOptions.blockedExtensions.includes(ext)) {
        return { isAllowed: false, reason: `Blocked file extension: ${ext}` };
      }

      // 4. Check crawl depth limit
      if (currentDepth > this.defaultOptions.maxDepth) {
        return { isAllowed: false, reason: `Crawl depth limit exceeded: ${currentDepth} > ${this.defaultOptions.maxDepth}` };
      }

      return { isAllowed: true };
    } catch {
      return { isAllowed: false, reason: 'Invalid URL structure' };
    }
  }

  /**
   * Asynchronously resolve hostname and verify resolved IP addresses against private networks.
   * Prevents DNS rebinding and nip.io / localtest.me style SSRF bypasses.
   */
  async validateDnsSafety(url: string): Promise<{ isAllowed: boolean; reason?: string }> {
    const basicCheck = this.validateUrlSafety(url);
    if (!basicCheck.isAllowed) {
      return basicCheck;
    }

    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

      // If already an IP address, basicCheck already validated it
      if (net.isIP(hostname)) {
        return { isAllowed: true };
      }

      // Resolve DNS records
      const addresses = await dns.promises.lookup(hostname, { all: true });
      for (const addr of addresses) {
        if (this.isPrivateOrReservedIp(addr.address)) {
          return {
            isAllowed: false,
            reason: `Target hostname resolves to private network address (${addr.address}), which is prohibited`,
          };
        }
      }

      return { isAllowed: true };
    } catch (err: any) {
      this.logger.warn(`DNS lookup failed for URL [${url}]: ${err.message}`);
      return { isAllowed: false, reason: `Unable to resolve host: ${err.message}` };
    }
  }


  normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      parsed.hash = ''; // Remove fragments
      if (parsed.pathname.endsWith('/') && parsed.pathname.length > 1) {
        parsed.pathname = parsed.pathname.slice(0, -1);
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }

  detectLoop(redirectChain: string[]): boolean {
    const set = new Set(redirectChain);
    return set.size !== redirectChain.length;
  }
}
