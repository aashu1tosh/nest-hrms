// src/logger/custom-logger.service.ts
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
    private context?: string;
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.json()
            ),
            defaultMeta: { service: 'nest-application' },
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                            return `${String(timestamp)} [${String(context) || 'Application'}] ${String(level)}: ${String(message)} ${Object.keys(meta).length ? JSON.stringify(meta) : ''
                                }`;
                        }),

                    ),
                }),
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
        });
    }

    setContext(context: string) {
        this.context = context;
        return this;
    }

    log(message: any, context?: string, meta?: Record<string, any>) {
        return this.logger.info(message, {
            context: context || this.context,
            ...meta
        });
    }

    error(message: any, trace?: string, context?: string, meta?: Record<string, any>) {
        return this.logger.error(message, {
            trace,
            context: context || this.context,
            ...meta
        });
    }

    warn(message: any, context?: string, meta?: Record<string, any>) {
        return this.logger.warn(message, {
            context: context || this.context,
            ...meta
        });
    }

    debug(message: any, context?: string, meta?: Record<string, any>) {
        return this.logger.debug(message, {
            context: context || this.context,
            ...meta
        });
    }

    verbose(message: any, context?: string, meta?: Record<string, any>) {
        return this.logger.verbose(message, {
            context: context || this.context,
            ...meta
        });
    }
}