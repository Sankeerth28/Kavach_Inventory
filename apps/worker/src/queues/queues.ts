import { z } from 'zod';

/** Queue names. `document` is reserved for the AI document pipeline (ARCHITECTURE §7.2). */
export const QUEUES = {
  health: 'health',
  document: 'document',
} as const;

export const PingJobSchema = z.object({
  message: z.string().min(1).default('ping'),
});

export type PingJob = z.infer<typeof PingJobSchema>;
