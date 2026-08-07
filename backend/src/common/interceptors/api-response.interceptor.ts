import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { randomUUID } from 'crypto';

export interface StandardApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    nextCursor?: string;
    previousCursor?: string;
  };
  error: null | Record<string, any>;
  timestamp: string;
  correlationId: string;
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, StandardApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardApiResponse<T>> {
    const req = context.switchToHttp().getRequest();
    const correlationId = req.headers['x-correlation-id'] || randomUUID();

    return next.handle().pipe(
      map((responseBody) => {
        let data = responseBody;
        let meta = undefined;
        let pagination = undefined;

        if (responseBody && typeof responseBody === 'object' && !Array.isArray(responseBody)) {
          if ('data' in responseBody && ('meta' in responseBody || 'pagination' in responseBody)) {
            data = responseBody.data;
            meta = responseBody.meta;
            pagination = responseBody.pagination;
          }
        }

        return {
          success: true,
          data,
          meta,
          pagination,
          error: null,
          timestamp: new Date().toISOString(),
          correlationId,
        };
      }),
    );
  }
}
