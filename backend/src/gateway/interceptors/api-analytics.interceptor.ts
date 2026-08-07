import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiAnalyticsInterceptor implements NestInterceptor {
  private readonly logger = new Logger('APIGateway');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const correlationId = req.correlationId || 'N/A';
    const method = req.method;
    const url = req.originalUrl || req.url;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        this.logger.log(
          `[TraceID: ${correlationId}] ${method} ${url} ${statusCode} - ${duration}ms`,
        );
      }),
    );
  }
}
