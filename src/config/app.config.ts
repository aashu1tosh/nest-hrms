import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { AppModule } from 'src/app.module';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // I used this app module to create a global guard
  // const configService = app.get(ConfigService);
  // app.useGlobalGuards(new UserAgentGuard(configService));

  app.use(cookieParser());
  app.use(morgan('dev'));
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
