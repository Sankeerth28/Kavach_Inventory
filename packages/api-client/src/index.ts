import type {
  ApiErrorBody,
  AuditListQuery,
  AuditLogDto,
  AuthResponse,
  CategoryDto,
  ChangePasswordInput,
  CheckDuplicatesInput,
  ConversionDto,
  CreateCategoryInput,
  CreateConversionInput,
  CreateLocationInput,
  CreateMaterialInput,
  CreateStoreInput,
  CreateUnitInput,
  CreateUserInput,
  DashboardSummaryDto,
  DuplicateCheckResult,
  ErrorCode,
  LocationDto,
  MaterialDto,
  MaterialListQuery,
  MeResponse,
  MemberDto,
  Paginated,
  ProjectDto,
  StoreDto,
  UnitDto,
  UpdateCategoryInput,
  UpdateLocationInput,
  UpdateMaterialInput,
  UpdateProjectInput,
  UpdateStoreInput,
  UpdateUnitInput,
  UpdateUserInput,
} from '@kavach/shared';

/**
 * Typed client for the KAVACH API, shared by web and mobile (ARCHITECTURE §2).
 *
 * - The access token lives in memory only.
 * - web: the refresh token is an httpOnly cookie the browser sends by itself.
 * - mobile: the refresh token is kept by the `tokenStore` the app provides (SecureStore).
 * - A 401 triggers one refresh and one retry; parallel requests share that refresh.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode | 'NETWORK',
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface TokenStore {
  get(): Promise<string | null>;
  set(token: string | null): Promise<void>;
}

export interface ApiClientOptions {
  baseUrl: string;
  mode: 'web' | 'mobile';
  /** The project every scoped request is made in. */
  getProjectId: () => string | null;
  /** mobile only */
  tokenStore?: TokenStore;
  /** Called when the session cannot be refreshed: show the login screen. */
  onSessionExpired?: () => void;
  fetch?: typeof fetch;
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions {
  body?: unknown;
  query?: Query;
  /** false for login / refresh: no bearer token, no project header, no retry. */
  auth?: boolean;
}

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiClient(options: ApiClientOptions) {
  const doFetch = options.fetch ?? fetch;
  let accessToken: string | null = null;
  let refreshing: Promise<AuthResponse | null> | null = null;

  async function raw<T>(method: string, path: string, opts: RequestOptions): Promise<T> {
    const url = new URL(options.baseUrl.replace(/\/$/, '') + path);
    for (const [k, v] of Object.entries(opts.query ?? {})) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
    const headers: Record<string, string> = {};
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    if (opts.auth !== false) {
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      const projectId = options.getProjectId();
      if (projectId) headers['X-Project-Id'] = projectId;
    }
    let res: Response;
    try {
      res = await doFetch(url, {
        method,
        headers,
        body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
        credentials: options.mode === 'web' ? 'include' : 'omit',
      });
    } catch {
      throw new ApiError(0, 'NETWORK', 'Cannot reach the server. Check your connection.');
    }
    if (res.status === 204) return undefined as T;
    const data: unknown = await res.json().catch(() => null);
    if (!res.ok) {
      const error = (data as ApiErrorBody | null)?.error;
      throw new ApiError(
        res.status,
        error?.code ?? 'INTERNAL',
        error?.message ?? 'Something went wrong. Please try again.',
        error?.details,
      );
    }
    return data as T;
  }

  async function adopt(auth: AuthResponse): Promise<AuthResponse> {
    accessToken = auth.accessToken;
    if (options.mode === 'mobile' && auth.refreshToken) {
      await options.tokenStore?.set(auth.refreshToken);
    }
    return auth;
  }

  async function clear(): Promise<void> {
    accessToken = null;
    if (options.mode === 'mobile') await options.tokenStore?.set(null);
  }

  /** Gets a new access token from the refresh token. Returns null when there is no session. */
  function refresh(): Promise<AuthResponse | null> {
    refreshing ??= (async () => {
      try {
        let body: { refreshToken?: string } = {};
        if (options.mode === 'mobile') {
          const stored = await options.tokenStore?.get();
          if (!stored) return null;
          body = { refreshToken: stored };
        }
        return await adopt(await raw<AuthResponse>('POST', '/auth/refresh', { body, auth: false }));
      } catch (e) {
        // A network failure is not a logout: keep the stored token and let the caller retry.
        if (e instanceof ApiError && e.code === 'NETWORK') throw e;
        await clear();
        return null;
      } finally {
        refreshing = null;
      }
    })();
    return refreshing;
  }

  async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
    try {
      return await raw<T>(method, path, opts);
    } catch (e) {
      if (!(e instanceof ApiError) || e.status !== 401 || e.code !== 'UNAUTHENTICATED') throw e;
      if (opts.auth === false) throw e;
      const session = await refresh();
      if (!session) {
        options.onSessionExpired?.();
        throw e;
      }
      return raw<T>(method, path, opts);
    }
  }

  const get = <T>(path: string, query?: Query) => request<T>('GET', path, { query });
  const post = <T>(path: string, body: unknown = {}) => request<T>('POST', path, { body });
  const patch = <T>(path: string, body: unknown) => request<T>('PATCH', path, { body });

  return {
    auth: {
      async login(identifier: string, password: string): Promise<AuthResponse> {
        const body = { identifier, password, client: options.mode };
        return adopt(await raw<AuthResponse>('POST', '/auth/login', { body, auth: false }));
      },
      /** Call once at start-up: resumes the session if a refresh token exists. */
      restore: (): Promise<MeResponse | null> => refresh(),
      async logout(): Promise<void> {
        const refreshToken =
          options.mode === 'mobile' ? ((await options.tokenStore?.get()) ?? undefined) : undefined;
        await raw<void>('POST', '/auth/logout', { body: { refreshToken }, auth: false }).catch(
          () => undefined,
        );
        await clear();
      },
      async changePassword(input: ChangePasswordInput): Promise<AuthResponse> {
        return adopt(await post<AuthResponse>('/auth/change-password', input));
      },
      me: () => get<MeResponse>('/auth/me'),
      isSignedIn: () => accessToken !== null,
    },
    dashboard: { get: () => get<DashboardSummaryDto>('/dashboard') },
    project: {
      get: () => get<ProjectDto>('/projects/current'),
      update: (input: UpdateProjectInput) => patch<ProjectDto>('/projects/current', input),
    },
    stores: {
      list: () => get<StoreDto[]>('/stores'),
      create: (input: CreateStoreInput) => post<StoreDto>('/stores', input),
      update: (id: string, input: UpdateStoreInput) => patch<StoreDto>(`/stores/${id}`, input),
    },
    locations: {
      list: () => get<LocationDto[]>('/locations'),
      create: (input: CreateLocationInput) => post<LocationDto>('/locations', input),
      update: (id: string, input: UpdateLocationInput) =>
        patch<LocationDto>(`/locations/${id}`, input),
    },
    categories: {
      list: () => get<CategoryDto[]>('/categories'),
      create: (input: CreateCategoryInput) => post<CategoryDto>('/categories', input),
      update: (id: string, input: UpdateCategoryInput) =>
        patch<CategoryDto>(`/categories/${id}`, input),
    },
    units: {
      list: () => get<UnitDto[]>('/units'),
      create: (input: CreateUnitInput) => post<UnitDto>('/units', input),
      update: (id: string, input: UpdateUnitInput) => patch<UnitDto>(`/units/${id}`, input),
    },
    conversions: {
      list: () => get<ConversionDto[]>('/unit-conversions'),
      create: (input: CreateConversionInput) => post<ConversionDto>('/unit-conversions', input),
      setActive: (id: string, isActive: boolean) =>
        patch<ConversionDto>(`/unit-conversions/${id}`, { isActive }),
    },
    materials: {
      list: (query: MaterialListQuery = {}) =>
        get<Paginated<MaterialDto>>('/materials', query as Query),
      get: (id: string) => get<MaterialDto>(`/materials/${id}`),
      checkDuplicates: (input: CheckDuplicatesInput) =>
        post<DuplicateCheckResult>('/materials/check-duplicates', input),
      create: (input: CreateMaterialInput) => post<MaterialDto>('/materials', input),
      update: (id: string, input: UpdateMaterialInput) =>
        patch<MaterialDto>(`/materials/${id}`, input),
      deactivate: (id: string) => post<MaterialDto>(`/materials/${id}/deactivate`),
      activate: (id: string) => post<MaterialDto>(`/materials/${id}/activate`),
    },
    users: {
      list: () => get<MemberDto[]>('/users'),
      create: (input: CreateUserInput) => post<MemberDto>('/users', input),
      update: (userId: string, input: UpdateUserInput) =>
        patch<MemberDto>(`/users/${userId}`, input),
      resetPassword: (userId: string, password: string) =>
        post<void>(`/users/${userId}/reset-password`, { password }),
    },
    auditLogs: {
      list: (query: Omit<AuditListQuery, 'from' | 'to'> = {}) =>
        get<Paginated<AuditLogDto>>('/audit-logs', query as Query),
    },
  };
}
