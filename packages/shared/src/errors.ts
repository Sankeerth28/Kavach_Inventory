/** Stable error codes returned by the API. Clients map them to plain-language messages (PRD §25.4). */
export const ERROR_CODES = [
  'VALIDATION_FAILED',
  'UNAUTHENTICATED',
  'INVALID_CREDENTIALS',
  'ACCOUNT_DISABLED',
  'PASSWORD_CHANGE_REQUIRED',
  'PROJECT_REQUIRED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'STALE_VERSION',
  'IDENTIFIER_TAKEN',
  'MULTI_PROJECT_USER',
  'LAST_ADMIN',
  'MATERIAL_ALREADY_EXISTS',
  'POSSIBLE_DUPLICATE',
  'UNIT_INCOMPATIBLE',
  'RATE_LIMITED',
  'INTERNAL',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}
