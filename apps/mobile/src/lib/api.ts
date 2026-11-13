import { ApiError, createApiClient } from '@kavach/api-client';
import * as SecureStore from 'expo-secure-store';

const REFRESH_KEY = 'kavach.refreshToken';

let currentProjectId: string | null = null;
let onExpired: (() => void) | null = null;

export function setProjectId(id: string | null): void {
  currentProjectId = id;
}

export function onSessionExpired(handler: (() => void) | null): void {
  onExpired = handler;
}

/**
 * One API client for the app. The access token stays in memory; the refresh token is kept in the
 * device keystore (SecureStore), never in plain storage (ARCHITECTURE §8).
 */
export const api = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001',
  mode: 'mobile',
  getProjectId: () => currentProjectId,
  tokenStore: {
    get: () => SecureStore.getItemAsync(REFRESH_KEY),
    set: async (token) => {
      if (token) await SecureStore.setItemAsync(REFRESH_KEY, token);
      else await SecureStore.deleteItemAsync(REFRESH_KEY);
    },
  },
  onSessionExpired: () => onExpired?.(),
});

/** A plain-language message for any failure (PRD §21.5 "Clear success/error messages"). */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'NETWORK')
      return 'No connection to the server. Check the network and try again.';
    if (error.code === 'VALIDATION_FAILED' && Array.isArray(error.details)) {
      const first = error.details[0] as { path?: string; message?: string } | undefined;
      if (first?.message) return first.message;
    }
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

export { ApiError };
