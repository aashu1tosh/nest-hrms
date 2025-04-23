import { ConfigService } from '@nestjs/config';
import { createApp } from './config/app.config';

async function bootstrap() {
  const app = await createApp();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;

  await app.listen(port);
  console.log("Server is running on port", port);
}
bootstrap().catch(() => {
  console.error('Error starting the application');
  process.exit(1);
});
