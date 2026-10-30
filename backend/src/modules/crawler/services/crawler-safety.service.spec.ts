import { CrawlerSafetyService } from './crawler-safety.service';

describe('CrawlerSafetyService', () => {
  let service: CrawlerSafetyService;

  beforeEach(() => {
    service = new CrawlerSafetyService();
  });

  describe('validateUrlSafety', () => {
    it('should allow valid public HTTPS and HTTP URLs', () => {
      expect(service.validateUrlSafety('https://example.com').isAllowed).toBe(true);
      expect(service.validateUrlSafety('https://stripe.com/docs').isAllowed).toBe(true);
      expect(service.validateUrlSafety('http://dyvin.ai/overview').isAllowed).toBe(true);
      expect(service.validateUrlSafety('https://github.com/torvalds/linux').isAllowed).toBe(true);
    });

    it('should reject non-HTTP protocols', () => {
      expect(service.validateUrlSafety('file:///etc/passwd').isAllowed).toBe(false);
      expect(service.validateUrlSafety('gopher://internal.vault').isAllowed).toBe(false);
      expect(service.validateUrlSafety('ftp://files.local').isAllowed).toBe(false);
      expect(service.validateUrlSafety('javascript:alert(1)').isAllowed).toBe(false);
    });

    it('should reject localhost and loopback IPv4 addresses', () => {
      expect(service.validateUrlSafety('http://localhost:3000').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://127.0.0.1/admin').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://127.127.127.127').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://0.0.0.0').isAllowed).toBe(false);
    });

    it('should reject IPv6 loopback and link-local addresses', () => {
      expect(service.validateUrlSafety('http://[::1]:8080').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://[fe80::1]').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://[fc00::1]').isAllowed).toBe(false);
    });

    it('should reject RFC 1918 private IPv4 subnets', () => {
      // 10.0.0.0/8
      expect(service.validateUrlSafety('http://10.0.0.1').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://10.255.255.255').isAllowed).toBe(false);
      // 172.16.0.0/12
      expect(service.validateUrlSafety('http://172.16.0.1').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://172.31.255.255').isAllowed).toBe(false);
      // 192.168.0.0/16
      expect(service.validateUrlSafety('http://192.168.1.1').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://192.168.0.254').isAllowed).toBe(false);
    });

    it('should reject AWS / Cloud Metadata and Link-Local (169.254.169.254)', () => {
      expect(service.validateUrlSafety('http://169.254.169.254/latest/meta-data').isAllowed).toBe(false);
      expect(service.validateUrlSafety('http://169.254.1.1').isAllowed).toBe(false);
    });

    it('should reject obfuscated IP address representations (decimal, hex, octal)', () => {
      // 2130706433 is 127.0.0.1 in decimal
      expect(service.validateUrlSafety('http://2130706433/').isAllowed).toBe(false);
      // 0x7f000001 is 127.0.0.1 in hex
      expect(service.validateUrlSafety('http://0x7f000001/').isAllowed).toBe(false);
      // 0177.0.0.1 is 127.0.0.1 in octal
      expect(service.validateUrlSafety('http://0177.0.0.1/').isAllowed).toBe(false);
    });

    it('should reject blocked non-HTML file extensions', () => {
      expect(service.validateUrlSafety('https://example.com/payload.exe').isAllowed).toBe(false);
      expect(service.validateUrlSafety('https://example.com/archive.zip').isAllowed).toBe(false);
      expect(service.validateUrlSafety('https://example.com/disk.iso').isAllowed).toBe(false);
    });

    it('should reject crawl depth exceeding maximum limit', () => {
      expect(service.validateUrlSafety('https://example.com/deep/page', 6).isAllowed).toBe(false);
      expect(service.validateUrlSafety('https://example.com/deep/page', 3).isAllowed).toBe(true);
    });
  });

  describe('isPrivateOrReservedIp', () => {
    it('should correctly classify public vs private IP addresses', () => {
      expect(service.isPrivateOrReservedIp('8.8.8.8')).toBe(false);
      expect(service.isPrivateOrReservedIp('1.1.1.1')).toBe(false);
      expect(service.isPrivateOrReservedIp('142.250.190.46')).toBe(false);

      expect(service.isPrivateOrReservedIp('127.0.0.1')).toBe(true);
      expect(service.isPrivateOrReservedIp('10.0.0.5')).toBe(true);
      expect(service.isPrivateOrReservedIp('172.20.0.1')).toBe(true);
      expect(service.isPrivateOrReservedIp('192.168.100.1')).toBe(true);
      expect(service.isPrivateOrReservedIp('169.254.169.254')).toBe(true);
      expect(service.isPrivateOrReservedIp('100.64.0.1')).toBe(true); // CGNAT
      expect(service.isPrivateOrReservedIp('224.0.0.1')).toBe(true); // Multicast
      expect(service.isPrivateOrReservedIp('255.255.255.255')).toBe(true); // Broadcast
    });
  });

  describe('detectLoop', () => {
    it('should detect cycles in redirect chain', () => {
      expect(service.detectLoop(['https://a.com', 'https://b.com', 'https://a.com'])).toBe(true);
      expect(service.detectLoop(['https://a.com', 'https://b.com', 'https://c.com'])).toBe(false);
    });
  });
});
