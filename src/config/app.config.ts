import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { AppModule } from 'src/app.module';
import { UserAgentGuard } from 'src/common/guards/userAgent.guard';

export async function createApp(): Promise<INestApplication> {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    const configService = app.get(ConfigService);
    app.useGlobalGuards(new UserAgentGuard(configService));

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
