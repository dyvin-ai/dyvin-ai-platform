import {
  generateRandomToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from './password.util';

jest.setTimeout(30000);

describe('Password & Token Utilities', () => {
  it('should correctly hash and verify password using Argon2id', async () => {
    const password = 'SuperSecretPassword123!';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).toContain('$argon2id$');

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('WrongPassword', hash);
    expect(isInvalid).toBe(false);
  });

  it('should generate deterministic SHA-256 token hash', () => {
    const token = 'raw-test-token-string';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);

    expect(hash1).toHaveLength(64); // hex sha256
    expect(hash1).toBe(hash2);
  });

  it('should generate random token hex string', () => {
    const token1 = generateRandomToken(16);
    const token2 = generateRandomToken(16);

    expect(token1).toHaveLength(32);
    expect(token1).not.toBe(token2);
  });
});
