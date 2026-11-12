import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

/** One client per process. Callers own its lifecycle ($connect / $disconnect). */
export function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}
