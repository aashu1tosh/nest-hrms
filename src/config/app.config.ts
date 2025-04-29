import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { AppModule } from 'src/app.module';
import { CustomLoggerService } from 'src/modules/logger/service/logger.service';
// import { GlobalExceptionFilter } from 'src/common/middleware/http-exception.middleware';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Get allowed origins from environment variables
  const allowedOriginsStr = configService.get<string>('ALLOWED_ORIGINS');
  const allowedOrigins = allowedOriginsStr
    ? allowedOriginsStr.split(',').map((origin) => origin.trim())
    : [];

  // Enable CORS with configuration
  app.enableCors({
    origin: allowedOrigins.length ? allowedOrigins : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 3600,
  });

  // I used this app module to create a global guard
  // const configService = app.get(ConfigService);
  // app.useGlobalGuards(new UserAgentGuard(configService));

  app.use(cookieParser());
  app.use(morgan('dev'));

  const logger = await app.resolve(CustomLoggerService);
  app.useLogger(logger);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  return app;
}
