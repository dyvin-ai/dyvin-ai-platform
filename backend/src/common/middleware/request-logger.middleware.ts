import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      const contentLength = res.get('content-length') || '0';

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength}b - ${responseTime}ms [${ip}] "${userAgent}"`,
      );
    });

    next();
  }
}
