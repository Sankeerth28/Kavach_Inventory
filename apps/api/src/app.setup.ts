import type { NestExpressApplication } from '@nestjs/platform-express';
import { UPLOAD_LIMITS, UPLOAD_MIME_TYPES } from '@kavach/shared';

/**
 * HTTP settings shared by the server and the integration tests, so tests exercise the same body
 * parsers and limits as production.
 */
export function configureApp(app: NestExpressApplication): void {
  app.disable('x-powered-by');
  // Document uploads arrive as the raw file bytes (PRD §7.2: JPG, PNG, PDF). Everything else is
  // JSON. The declared type only selects the parser: the real type is read from the bytes.
  app.useBodyParser('raw', {
    type: [...UPLOAD_MIME_TYPES, 'application/octet-stream'],
    // A little above the per-file limit, so the service can answer with a clear message.
    limit: UPLOAD_LIMITS.maxFileBytes + 1024 * 1024,
  });
}
