import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // Enable rawBody buffering so webhook signature verification can access the original payload bytes.
  // Stripe and Razorpay require the raw, un-parsed body for HMAC signature construction.
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  // Use Pino Logger globally
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const nodeEnv = configService.get<string>('app.nodeEnv') || 'development';

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Security & Middleware
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: nodeEnv === 'production' ? false : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Organization-Id', 'x-organization-id'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable Graceful Shutdown Hooks
  app.enableShutdownHooks();

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dyvin AI API')
    .setDescription(
      'Production API engine analyzing business AI visibility, identifying gaps, and optimizing intelligence layer recommendations.',
    )
    .setVersion('v1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(
    `Dyvin AI API running in [${nodeEnv}] mode on port ${port} | API Docs: http://localhost:${port}/docs`,
  );
}

bootstrap().catch((err) => {
  console.error('Fatal error during Dyvin AI API startup:', err);
  process.exit(1);
});
