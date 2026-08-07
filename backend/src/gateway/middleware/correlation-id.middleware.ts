import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const correlationHeader = req.headers['x-correlation-id'] || req.headers['x-request-id'];
    const correlationId = (Array.isArray(correlationHeader) ? correlationHeader[0] : correlationHeader) ||
      `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Set correlation ID on request object and outgoing response headers
    (req as any).correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    res.setHeader('X-Request-ID', correlationId);

    next();
  }
}
