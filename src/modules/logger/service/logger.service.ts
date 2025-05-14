/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';
import { Environment } from 'src/constant/enum';
import winston from 'winston';

const LEVEL_COLOR_METHODS: Record<string, chalk.Chalk> = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  debug: chalk.blue,
  verbose: chalk.cyan,
  silly: chalk.magenta,
};

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  private context?: string;
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    // 1. Define your color map
    winston.addColors({
      error: 'red',
      warn: 'yellow',
      info: 'green',
      debug: 'blue',
      verbose: 'cyan',
      silly: 'magenta',
    });

    const isProd =
      this.configService.get<Environment>('NODE_ENV') ===
      Environment.PRODUCTION;

    // 2. Pick transports based on environment
    const transports: winston.transport[] = [];

    if (isProd) {
      // only file in prod
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
      );
      transports.push(
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      );
    } else {
      // console + chalk formatting in dev
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.ms(),
            // custom printf with chalk
            winston.format.printf(
              ({ timestamp, level, message, context, ms, ...meta }) => {
                const tsStr = String(timestamp);
                const ctxName = JSON.stringify(
                  context ?? 'HRMS APPLICATION',
                  null,
                  2,
                );
                const levelKey = String(level).toLowerCase();
                const levelLabel = levelKey.toUpperCase();

                // 2. Colorize pieces:
                const ts = chalk.gray(tsStr);
                const ctx = chalk.blue(`[${ctxName}]`);
                const colorFn = LEVEL_COLOR_METHODS[levelKey] || chalk.white;
                const lvl = colorFn(levelLabel);

                const msg =
                  typeof message === 'string'
                    ? message
                    : JSON.stringify(message);
                const extras = Object.keys(meta).length
                  ? chalk.gray(JSON.stringify(meta))
                  : '';
                const duration =
                  typeof ms === 'string' ? chalk.magenta(`+${ms}`) : '';

                return `${ts} ${ctx} ${lvl}: ${msg} ${extras} ${duration}`;
              },
            ),
          ),
        }),
      );
    }

    // 3. Create the Winston logger
    this.logger = winston.createLogger({
      level: isProd ? 'info' : 'debug',
      defaultMeta: { service: 'nest-application' },
      transports,
    });
  }

  setContext(context: string) {
    this.context = context;
    return this;
  }

  log(message: any, context?: string, meta?: Record<string, any>) {
    return this.logger.info(message, {
      context: context || this.context,
      ...meta,
    });
  }

  error(
    message: any,
    trace?: string,
    context?: string,
    meta?: Record<string, any>,
  ) {
    return this.logger.error(message, {
      trace,
      context: context || this.context,
      ...meta,
    });
  }

  warn(message: any, context?: string, meta?: Record<string, any>) {
    return this.logger.warn(message, {
      context: context || this.context,
      ...meta,
    });
  }

  debug(message: any, context?: string, meta?: Record<string, any>) {
    return this.logger.debug(message, {
      context: context || this.context,
      ...meta,
    });
  }

  verbose(message: any, context?: string, meta?: Record<string, any>) {
    return this.logger.verbose(message, {
      context: context || this.context,
      ...meta,
    });
  }
}
