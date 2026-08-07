import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class GatewayTimeoutInterceptor implements NestInterceptor {
  private static readonly DEFAULT_TIMEOUT = 30000;

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      timeout(GatewayTimeoutInterceptor.DEFAULT_TIMEOUT),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                'API Gateway request timed out.',
              ),
          );
        }

        return throwError(() => err);
      }),
    );
  }
}