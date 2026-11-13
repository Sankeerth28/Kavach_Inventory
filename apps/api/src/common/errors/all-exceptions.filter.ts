import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Prisma, ProjectScopeError } from '@kavach/db';
import type { ApiErrorBody, ErrorCode } from '@kavach/shared';
import type { Response } from 'express';
import { ZodError } from 'zod';
import { DomainError } from './domain-error';

const STATUS_CODES: Record<number, ErrorCode> = {
  400: 'VALIDATION_FAILED',
  401: 'UNAUTHENTICATED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  429: 'RATE_LIMITED',
};

/** Turns every failure into `{ error: { code, message, details? } }`. Internal details never leak. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Errors');

  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    const { status, body } = this.map(exception);
    res.status(status).json(body);
  }

  private map(e: unknown): { status: number; body: ApiErrorBody } {
    if (e instanceof DomainError) {
      return {
        status: e.status,
        body: { error: { code: e.code, message: e.message, details: e.details } },
      };
    }
    if (e instanceof ZodError) {
      return {
        status: 400,
        body: {
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Some fields are not valid.',
            details: e.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
          },
        },
      };
    }
    if (e instanceof HttpException) {
      const status = e.getStatus();
      const code = STATUS_CODES[status] ?? (status >= 500 ? 'INTERNAL' : 'VALIDATION_FAILED');
      return { status, body: { error: { code, message: e.message } } };
    }
    // The body parser refuses an upload above its limit before any handler runs.
    if ((e as { type?: string } | null)?.type === 'entity.too.large') {
      return {
        status: 413,
        body: { error: { code: 'FILE_TOO_LARGE', message: 'The file is larger than 15 MB.' } },
      };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique or foreign-key violation that a service did not translate itself.
      if (e.code === 'P2002' || e.code === 'P2003') {
        return {
          status: 409,
          body: { error: { code: 'CONFLICT', message: 'This conflicts with existing data.' } },
        };
      }
      if (e.code === 'P2025') {
        return { status: 404, body: { error: { code: 'NOT_FOUND', message: 'Not found.' } } };
      }
    }
    if (e instanceof ProjectScopeError) this.logger.error(`ISOLATION BUG: ${e.message}`, e.stack);
    else this.logger.error(e instanceof Error ? (e.stack ?? e.message) : String(e));
    return {
      status: 500,
      body: { error: { code: 'INTERNAL', message: 'Something went wrong. Please try again.' } },
    };
  }
}
