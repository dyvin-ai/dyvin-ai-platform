import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityNormalizationService {
  normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  normalizePhone(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+') && cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    return cleaned;
  }

  normalizeUrl(url: string): string {
    let trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
    }
    return trimmed.replace(/\/+$/, '');
  }

  canonicalizeName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\b(inc|llc|corp|corporation|ltd|limited|co)\b\.?/gi, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
