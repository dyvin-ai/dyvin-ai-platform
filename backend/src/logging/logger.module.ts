import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                  },
                },
            autoLogging: true,
            customProps: () => ({
              context: 'HTTP',
            }),
            serializers: {
              req: (req: Record<string, any>) => ({
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                headers: {
                  host: req.headers.host,
                  'user-agent': req.headers['user-agent'],
                },
              }),
              res: (res: Record<string, any>) => ({
                statusCode: res.statusCode,
              }),
            },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
