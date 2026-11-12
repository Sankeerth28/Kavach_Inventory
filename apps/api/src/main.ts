import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { loadConfig } from './common/config';

async function bootstrap(): Promise<void> {
  // Local development reads the repo-root .env; deployed environments inject real env vars.
  try {
    process.loadEnvFile('../../.env');
  } catch {
    // No .env file: rely on the process environment.
  }
  const config = loadConfig(); // fails fast when JWT_SECRET is missing

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableShutdownHooks();
  app.disable('x-powered-by');
  // The web app sends the refresh cookie, so CORS names its origins instead of using "*".
  app.enableCors({
    origin: config.webOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Project-Id', 'Idempotency-Key'],
  });

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
  console.log(`api listening on http://localhost:${port}`);
}

void bootstrap();
