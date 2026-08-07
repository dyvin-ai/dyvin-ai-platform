import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : null;

    const correlationId = request.headers['x-correlation-id'] || randomUUID();
    const message =
      typeof exceptionResponse === 'object' && exceptionResponse?.message
        ? exceptionResponse.message
        : exception instanceof Error
        ? exception.message
        : 'Internal Server Error';

    const errorCode =
      typeof exceptionResponse === 'object' && exceptionResponse?.error
        ? exceptionResponse.error.toUpperCase().replace(/\s+/g, '_')
        : HttpStatus[status] || 'UNKNOWN_ERROR';

    this.logger.error(
      `[${correlationId}] ${request.method} ${request.url} - ${status} ${errorCode}: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      success: false,
      data: null,
      error: {
        code: errorCode,
        message,
        details: typeof exceptionResponse === 'object' ? exceptionResponse : null,
        correlationId,
        timestamp: new Date().toISOString(),
        documentationLink: 'https://docs.dyvin.ai/errors#' + errorCode.toLowerCase(),
      },
      timestamp: new Date().toISOString(),
      correlationId,
    });
  }
}
