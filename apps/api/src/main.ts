import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  // Local development reads the repo-root .env; deployed environments inject real env vars.
  try {
    process.loadEnvFile('../../.env');
  } catch {
    // No .env file: rely on the process environment.
  }

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const port = Number(process.env.API_PORT ?? 3001);
  await app.listen(port);
  console.log(`api listening on http://localhost:${port}`);
}

void bootstrap();
