import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  REDIS_URL!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(32, {
    message: 'JWT_SECRET must be at least 32 characters long for production security.',
  })
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  OPENAI_API_KEY!: string;

  @IsString()
  @IsNotEmpty()
  ANTHROPIC_API_KEY!: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_API_KEY!: string;

  @IsString()
  @IsNotEmpty()
  PERPLEXITY_API_KEY!: string;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map(
        (err) =>
          `${err.property}: ${Object.values(err.constraints || {}).join(', ')}`,
      )
      .join('\n');
    throw new Error(
      `[Configuration Error] Invalid environment configuration:\n${errorMessages}`,
    );
  }

  return validatedConfig;
}
