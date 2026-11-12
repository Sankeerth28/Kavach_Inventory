import { Injectable } from '@nestjs/common';
import {
  type AuthResponse,
  type MeResponse,
  type MembershipDto,
  ROLE_NAMES,
  isRoleCode,
  normaliseEmail,
  normalisePhone,
  permissionsForRole,
} from '@kavach/shared';
import { AuditService, type AuditActor } from '../../common/audit/audit.service';
import { PasswordService } from '../../common/auth/password.service';
import { type IssuedTokens, TokenService } from '../../common/auth/token.service';
import type { AuthContext } from '../../common/context/request-context';
import { DomainError, unauthenticated } from '../../common/errors/domain-error';
import { PrismaService } from '../../common/prisma/prisma.service';

export type RequestMeta = Pick<AuthContext, 'requestId' | 'ip' | 'userAgent'>;
export type AuthResult = Omit<AuthResponse, 'refreshToken'> & { tokens: IssuedTokens };

const MAX_FAILURES = 10;
const FAILURE_WINDOW_MS = 15 * 60_000;

/**
 * Authentication is account-level, not project-level, so this service reads users and
 * memberships across projects through the unscoped client.
 */
@Injectable()
export class AuthService {
  /** Failed logins per identifier. In-memory: enough for one API instance; Phase 5 moves it to Redis. */
  private readonly failures = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
    private readonly audit: AuditService,
  ) {}

  async login(identifier: string, password: string, meta: RequestMeta): Promise<AuthResult> {
    const key = identifier.trim().toLowerCase();
    this.assertNotLocked(key);

    const db = this.prisma.unscoped;
    const user = identifier.includes('@')
      ? await db.user.findUnique({ where: { email: normaliseEmail(identifier) } })
      : await db.user.findUnique({ where: { phone: normalisePhone(identifier) } });

    const ok = user
      ? await this.passwords.verify(user.passwordHash, password)
      : (await this.passwords.verifyAgainstNothing(password), false);

    if (!user || !ok) {
      this.recordFailure(key);
      await this.audit.writeAccount(db, this.actor(meta, user?.id ?? null), {
        action: 'auth.login_failed',
        entityType: 'user',
        entityId: user?.id ?? 'unknown',
      });
      // Same message for an unknown account and a wrong password.
      throw new DomainError('INVALID_CREDENTIALS', 'Wrong login or password.', 401);
    }
    if (user.status !== 'ACTIVE') {
      throw new DomainError('ACCOUNT_DISABLED', 'This account is disabled.', 403);
    }
    this.failures.delete(key);

    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await this.audit.writeAccount(db, this.actor(meta, user.id), {
      action: 'auth.login',
      entityType: 'user',
      entityId: user.id,
    });
    const tokens = await this.tokens.issue(user.id, meta.userAgent);
    return this.result(user.id, tokens);
  }

  async refresh(refreshToken: string, meta: RequestMeta): Promise<AuthResult> {
    const tokens = await this.tokens.rotate(refreshToken, meta.userAgent);
    const user = await this.prisma.unscoped.user.findUnique({ where: { id: tokens.userId } });
    if (!user || user.status !== 'ACTIVE') throw unauthenticated();
    return this.result(tokens.userId, tokens);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) await this.tokens.revokeByToken(refreshToken);
  }

  /** Changes the caller's own password and signs them out of every other session. */
  async changePassword(
    auth: AuthContext,
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthResult> {
    const db = this.prisma.unscoped;
    const user = await db.user.findUniqueOrThrow({ where: { id: auth.userId } });
    if (!(await this.passwords.verify(user.passwordHash, currentPassword))) {
      throw new DomainError('INVALID_CREDENTIALS', 'Your current password is wrong.', 400);
    }
    if (currentPassword === newPassword) {
      throw new DomainError('VALIDATION_FAILED', 'Choose a password you have not used here.', 400);
    }
    const passwordHash = await this.passwords.hash(newPassword);
    await db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash, mustChangePassword: false },
      });
      await this.tokens.revokeAllForUser(tx, user.id);
      await this.audit.writeAccount(tx, this.actor(auth, user.id), {
        action: 'auth.password_change',
        entityType: 'user',
        entityId: user.id,
      });
    });
    const tokens = await this.tokens.issue(user.id, auth.userAgent);
    return this.result(user.id, tokens);
  }

  async me(userId: string): Promise<MeResponse> {
    const user = await this.prisma.unscoped.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        memberships: {
          where: { status: 'ACTIVE', project: { status: 'ACTIVE' } },
          include: { project: true, role: true, stores: true },
          orderBy: { project: { name: 'asc' } },
        },
      },
    });
    const memberships: MembershipDto[] = [];
    for (const m of user.memberships) {
      if (!isRoleCode(m.role.code)) continue;
      memberships.push({
        projectId: m.projectId,
        projectCode: m.project.code,
        projectName: m.project.name,
        roleCode: m.role.code,
        roleName: ROLE_NAMES[m.role.code],
        permissions: permissionsForRole(m.role.code),
        storeIds: m.stores.map((s) => s.storeId),
      });
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        mustChangePassword: user.mustChangePassword,
      },
      memberships,
    };
  }

  private async result(userId: string, tokens: IssuedTokens): Promise<AuthResult> {
    return {
      ...(await this.me(userId)),
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      tokens,
    };
  }

  private actor(meta: RequestMeta, userId: string | null): AuditActor {
    return { userId, requestId: meta.requestId, ip: meta.ip, userAgent: meta.userAgent };
  }

  private assertNotLocked(key: string): void {
    const f = this.failures.get(key);
    if (f && f.resetAt > Date.now() && f.count >= MAX_FAILURES) {
      throw new DomainError(
        'RATE_LIMITED',
        'Too many failed attempts. Try again in 15 minutes.',
        429,
      );
    }
  }

  private recordFailure(key: string): void {
    const now = Date.now();
    const f = this.failures.get(key);
    if (!f || f.resetAt <= now)
      this.failures.set(key, { count: 1, resetAt: now + FAILURE_WINDOW_MS });
    else f.count += 1;
    if (this.failures.size > 10_000) {
      for (const [k, v] of this.failures) if (v.resetAt <= now) this.failures.delete(k);
    }
  }
}
