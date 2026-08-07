import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';
    let errorName = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resPayload = exception.getResponse();

      if (typeof resPayload === 'object' && resPayload !== null) {
        const payloadObj = resPayload as Record<string, any>;
        message = payloadObj['message'] || exception.message;
        errorName = payloadObj['error'] || exception.name;
      } else {
        message = resPayload || exception.message;
        errorName = exception.name;
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled Error on ${request.method} ${request.url}: ${exception.message}`,
        exception.stack,
      );
      message = exception.message;
      errorName = exception.name;
    } else {
      this.logger.error(
        `Unknown Exception caught on ${request.method} ${request.url}:`,
        exception,
      );
    }

    const responseBody: ErrorResponseBody = {
      success: false,
      statusCode: status,
      message,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }
}
