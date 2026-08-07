import 'reflect-metadata';
import { validateEnvironment } from './env.validation';

describe('Environment Validation', () => {
  const validEnv = {
    NODE_ENV: 'development',
    PORT: 3000,
    DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
    REDIS_URL: 'redis://localhost:6379',
    JWT_SECRET: 'super-secret-jwt-key-change-in-production-min-32-chars',
    OPENAI_API_KEY: 'sk-proj-test-key',
    ANTHROPIC_API_KEY: 'sk-ant-test-key',
    GOOGLE_API_KEY: 'AIzaSyTestKey',
    PERPLEXITY_API_KEY: 'pplx-test-key',
  };

  it('should validate and parse valid environment variables', () => {
    const result = validateEnvironment(validEnv);
    expect(result.NODE_ENV).toBe('development');
    expect(result.PORT).toBe(3000);
    expect(result.DATABASE_URL).toBe(validEnv.DATABASE_URL);
    expect(result.REDIS_URL).toBe(validEnv.REDIS_URL);
    expect(result.JWT_SECRET).toBe(validEnv.JWT_SECRET);
    expect(result.OPENAI_API_KEY).toBe(validEnv.OPENAI_API_KEY);
    expect(result.ANTHROPIC_API_KEY).toBe(validEnv.ANTHROPIC_API_KEY);
    expect(result.GOOGLE_API_KEY).toBe(validEnv.GOOGLE_API_KEY);
    expect(result.PERPLEXITY_API_KEY).toBe(validEnv.PERPLEXITY_API_KEY);
  });

  it('should throw an error if a required key is missing', () => {
    const invalidEnv = { ...validEnv, DATABASE_URL: '' };
    expect(() => validateEnvironment(invalidEnv)).toThrow(
      /DATABASE_URL: DATABASE_URL should not be empty/,
    );
  });

  it('should throw an error if JWT_SECRET is less than 32 characters', () => {
    const invalidEnv = { ...validEnv, JWT_SECRET: 'short-secret' };
    expect(() => validateEnvironment(invalidEnv)).toThrow(
      /JWT_SECRET must be at least 32 characters long/,
    );
  });
});
