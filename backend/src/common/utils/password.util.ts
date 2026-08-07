import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';

/**
 * Hashes a plaintext password using Argon2id with production security parameters.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * Verifies a plaintext password against an Argon2id hash.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Generates a SHA-256 hash of a raw token for secure database storage.
 */
export function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Generates a cryptographically secure random token string.
 */
export function generateRandomToken(bytes: number = 32): string {
  return randomBytes(bytes).toString('hex');
}
