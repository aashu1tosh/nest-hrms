import { ConfigService } from '@nestjs/config';
import { createApp } from './config/app.config';
import { CustomLoggerService } from './modules/logger/service/logger.service';

async function bootstrap() {
  const app = await createApp();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  const loggerService = await app.resolve(CustomLoggerService);
  const logger = loggerService.setContext('Bootstrap');

  await app.listen(port);

  const allowedOriginsStr = configService.get<string>('ALLOWED_ORIGINS');
  const allowedOrigins = allowedOriginsStr ? allowedOriginsStr.split(',') : [];
  logger.log(
    `CORS enabled for origins: ${allowedOrigins.join(', ') || 'none specified, defaulting to *'}`,
  );
  logger.log(`Server is running on port ${port}`);
}
bootstrap().catch((err: Error) => {
  const fallback = new CustomLoggerService(new ConfigService());
  fallback.error(
    'Error starting the application',
    err?.stack ?? String(err),
    'Bootstrap',
    {
      message: err?.message,
    },
  );
  process.exit(1);
});
