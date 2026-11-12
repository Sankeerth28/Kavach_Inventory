import { Worker } from 'bullmq';
import { processPing } from './processors/ping.processor';
import { QUEUES } from './queues/queues';
import { redisConnection } from './redis';

// Local development reads the repo-root .env; deployed environments inject real env vars.
try {
  process.loadEnvFile('../../.env');
} catch {
  // No .env file: rely on the process environment.
}

const worker = new Worker(QUEUES.health, processPing, { connection: redisConnection() });

worker.on('ready', () => console.log(`worker ready, consuming "${QUEUES.health}"`));
worker.on('failed', (job, err) => console.error(`job ${job?.id ?? '?'} failed: ${err.message}`));
worker.on('error', (err) => console.error(`worker error: ${err.message}`));

async function shutdown(): Promise<void> {
  await worker.close();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
