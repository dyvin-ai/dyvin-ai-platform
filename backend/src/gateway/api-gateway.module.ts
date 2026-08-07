import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiAnalyticsInterceptor } from './interceptors/api-analytics.interceptor';
import { GatewayTimeoutInterceptor } from './interceptors/gateway-timeout.interceptor';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiAnalyticsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GatewayTimeoutInterceptor,
    },
  ],
  exports: [],
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
