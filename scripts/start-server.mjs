#!/usr/bin/env node
/**
 * Start command for a single small server (Render free plan): applies database migrations,
 * then runs the API and the document worker side by side in one container.
 *
 * Free plans have no separate background-worker service, and with STORAGE_DRIVER=local the API
 * and the worker must share one disk anyway. If either process stops, the other is stopped too
 * and the command exits, so the platform restarts the whole service.
 */
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

console.log('Applying database migrations…');
const migrate = spawnSync(
  process.execPath,
  ['./node_modules/prisma/build/index.js', 'migrate', 'deploy'],
  { cwd: path.join(root, 'packages', 'db'), stdio: 'inherit' },
);
if (migrate.status !== 0) {
  console.error('Migrations failed: check DATABASE_URL. Not starting.');
  process.exit(1);
}

const children = [];
let stopping = false;

function stopAll(code) {
  if (stopping) return;
  stopping = true;
  for (const c of children) if (c.exitCode === null) c.kill('SIGTERM');
  setTimeout(() => process.exit(code), 5000).unref();
}

function start(name, app) {
  const child = spawn(process.execPath, ['dist/main.js'], {
    cwd: path.join(root, 'apps', app),
    stdio: 'inherit',
    env: process.env,
  });
  child.on('exit', (code, signal) => {
    if (!stopping) console.error(`${name} stopped (${signal ?? `exit code ${code}`}); stopping.`);
    stopAll(code ?? 1);
  });
  children.push(child);
}

start('worker', 'worker');
start('api', 'api');

for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => stopAll(0));
