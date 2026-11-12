/** Environment configuration. Secrets come from the environment only (PRD §25.2). */
export interface AppConfig {
  jwtSecret: Uint8Array;
  accessTokenTtlSeconds: number;
  refreshTokenTtlDays: number;
  webOrigins: string[];
  cookieSecure: boolean;
}

export const APP_CONFIG = Symbol('APP_CONFIG');

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const secret = env.JWT_SECRET ?? '';
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters.');
  }
  return {
    jwtSecret: new TextEncoder().encode(secret),
    accessTokenTtlSeconds: 15 * 60,
    refreshTokenTtlDays: 30,
    webOrigins: (env.WEB_ORIGIN ?? 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    cookieSecure: env.COOKIE_SECURE === 'true',
  };
}
