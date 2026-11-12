import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';
export * from './scope';
export * from './system-data';
export * from './provision';

/** One client per process. Callers own its lifecycle ($connect / $disconnect). */
export function createPrismaClient(url?: string): PrismaClient {
  return url ? new PrismaClient({ datasourceUrl: url }) : new PrismaClient();
}
