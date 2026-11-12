import type { INestApplication } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { type PermissionCode, roleHasPermission } from '@kavach/shared';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ACCESS_KEY, type AccessRule } from '../src/common/auth/access.decorators';
import {
  type Fixture,
  type Masters,
  PASSWORD,
  as,
  createApp,
  createFixture,
  loadMasters,
} from './helpers';

interface Route {
  method: string;
  path: string;
  rule: AccessRule | undefined;
}

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'ALL', 'OPTIONS', 'HEAD'];

/** Every HTTP route the application registers, with its access declaration. */
function discoverRoutes(app: INestApplication): Route[] {
  const routes: Route[] = [];
  for (const module of app.get(ModulesContainer).values()) {
    for (const wrapper of module.controllers.values()) {
      const controller = wrapper.metatype as (new () => unknown) | undefined;
      if (!controller) continue;
      const base = String(Reflect.getMetadata('path', controller) ?? '').replace(/^\/|\/$/g, '');
      const proto = controller.prototype as Record<string, unknown>;
      for (const name of Object.getOwnPropertyNames(proto)) {
        const handler = proto[name];
        if (name === 'constructor' || typeof handler !== 'function') continue;
        const sub = Reflect.getMetadata('path', handler) as string | undefined;
        if (sub === undefined) continue;
        const method = METHODS[Reflect.getMetadata('method', handler) as number] ?? '?';
        const path = '/' + [base, sub.replace(/^\/|\/$/g, '')].filter(Boolean).join('/');
        const rule = (Reflect.getMetadata(ACCESS_KEY, handler) ??
          Reflect.getMetadata(ACCESS_KEY, controller)) as AccessRule | undefined;
        routes.push({ method, path, rule });
      }
    }
  }
  return routes;
}

describe('backend permissions (PRD §3, CLAUDE.md invariant 7)', () => {
  let app: INestApplication;
  let fx: Fixture;
  let m: Masters;
  let routes: Route[];
  /** Admin-only requests, keyed "METHOD /route/pattern". Bodies are valid, so only the role differs. */
  let adminOnly: Record<string, { url: string; body?: object }>;

  beforeAll(async () => {
    app = await createApp();
    fx = await createFixture(app);
    m = await loadMasters(app, fx.admin, fx.projectId);
    routes = discoverRoutes(app);

    const admin = as(app, fx.admin, fx.projectId);
    const material = (
      await admin
        .post('/materials', {
          name: 'Permission Test Putty',
          categoryId: m.categoryId('Paint and Finishing'),
          stockUnitId: m.unitId('KG'),
        })
        .expect(201)
    ).body as { id: string; version: number };
    const location = (
      await admin.post('/locations', { name: 'Tower P', type: 'TOWER' }).expect(201)
    ).body as { id: string };
    const unit = (
      await admin
        .post('/units', {
          code: 'DRUM',
          name: 'Drums',
          symbol: 'drum',
          dimension: 'COUNT',
          decimalPlaces: 0,
        })
        .expect(201)
    ).body as { id: string };
    const conversion = (
      await admin
        .post('/unit-conversions', { fromUnitId: unit.id, toUnitId: m.unitId('L'), factor: '200' })
        .expect(201)
    ).body as { id: string };

    adminOnly = {
      'PATCH /projects/current': { url: '/projects/current', body: { name: 'Renamed by SM' } },
      'POST /stores': { url: '/stores', body: { code: 'SM-STORE', name: 'SM store' } },
      'PATCH /stores/:id': { url: `/stores/${fx.storeId}`, body: { name: 'Renamed' } },
      'POST /locations': { url: '/locations', body: { name: 'Tower SM', type: 'TOWER' } },
      'PATCH /locations/:id': { url: `/locations/${location.id}`, body: { name: 'Renamed' } },
      'POST /categories': { url: '/categories', body: { name: 'SM category' } },
      'PATCH /categories/:id': {
        url: `/categories/${m.categoryId('Hardware')}`,
        body: { name: 'Renamed' },
      },
      'POST /units': {
        url: '/units',
        body: { code: 'SMU', name: 'SM unit', symbol: 'smu', dimension: 'COUNT', decimalPlaces: 0 },
      },
      'PATCH /units/:id': { url: `/units/${unit.id}`, body: { name: 'Renamed' } },
      'POST /unit-conversions': {
        url: '/unit-conversions',
        body: { fromUnitId: m.unitId('BAG'), toUnitId: m.unitId('KG'), factor: '50' },
      },
      'PATCH /unit-conversions/:id': {
        url: `/unit-conversions/${conversion.id}`,
        body: { isActive: false },
      },
      'POST /materials': {
        url: '/materials',
        body: {
          name: 'SM Manual Material',
          categoryId: m.categoryId('Hardware'),
          stockUnitId: m.unitId('NOS'),
        },
      },
      'PATCH /materials/:id': {
        url: `/materials/${material.id}`,
        body: { description: 'edited', version: material.version },
      },
      'POST /materials/:id/deactivate': { url: `/materials/${material.id}/deactivate` },
      'POST /materials/:id/activate': { url: `/materials/${material.id}/activate` },
      'GET /users': { url: '/users' },
      'POST /users': {
        url: '/users',
        body: {
          name: 'Made by SM',
          email: `sm-made.${Date.now()}@test.local`,
          roleCode: 'PROJECT_ADMIN',
          password: PASSWORD,
        },
      },
      'PATCH /users/:userId': {
        url: `/users/${fx.manager.userId}`,
        body: { roleCode: 'PROJECT_ADMIN' },
      },
      'POST /users/:userId/reset-password': {
        url: `/users/${fx.admin.userId}/reset-password`,
        body: { password: 'Hijack3d!1' },
      },
      'GET /audit-logs': { url: '/audit-logs' },
    };
  });

  afterAll(async () => {
    await app.close();
  });

  it('every route declares its access (default-deny has nothing to catch)', () => {
    expect(routes.length).toBeGreaterThan(25);
    const undeclared = routes.filter((r) => !r.rule).map((r) => `${r.method} ${r.path}`);
    expect(undeclared).toEqual([]);
  });

  it('only health, login, refresh and logout are public', () => {
    const open = routes
      .filter((r) => r.rule?.kind === 'public')
      .map((r) => `${r.method} ${r.path}`)
      .sort();
    expect(open).toEqual([
      'GET /health',
      'POST /auth/login',
      'POST /auth/logout',
      'POST /auth/refresh',
    ]);
  });

  it('the admin-only request table covers every route a Store Manager may not use', () => {
    const closedToManager = routes
      .filter(
        (r) =>
          r.rule?.kind === 'permission' &&
          !r.rule.anyOf.some((p: PermissionCode) => roleHasPermission('STORE_MANAGER', p)),
      )
      .map((r) => `${r.method} ${r.path}`)
      .sort();
    expect(Object.keys(adminOnly).sort()).toEqual(closedToManager);
  });

  it('denies the Store Manager every admin-only action', async () => {
    const manager = as(app, fx.manager, fx.projectId);
    for (const [key, { url, body }] of Object.entries(adminOnly)) {
      const method = key.split(' ')[0]!.toLowerCase() as 'get' | 'post' | 'patch';
      const res = method === 'get' ? await manager.get(url) : await manager[method](url, body);
      expect(res.status, key).toBe(403);
      expect(res.body.error.code, key).toBe('FORBIDDEN');
    }
  });

  it('none of the denied requests changed anything', async () => {
    const admin = as(app, fx.admin, fx.projectId);
    const project = (await admin.get('/projects/current').expect(200)).body;
    expect(project.name).not.toBe('Renamed by SM');
    const stores = (await admin.get('/stores').expect(200)).body as { code: string }[];
    expect(stores.map((s) => s.code)).not.toContain('SM-STORE');
    const users = (await admin.get('/users').expect(200)).body as {
      name: string;
      roleCode: string;
    }[];
    expect(users.map((u) => u.name)).not.toContain('Made by SM');
    expect(users.filter((u) => u.roleCode === 'PROJECT_ADMIN')).toHaveLength(1);
    const materials = (await admin.get('/materials?q=SM Manual').expect(200)).body;
    expect(materials.total).toBe(0);
  });

  it('lets the Project Admin through the same requests', async () => {
    const admin = as(app, fx.admin, fx.projectId);
    for (const [key, { url, body }] of Object.entries(adminOnly)) {
      // Resetting your own password and demoting the manager are covered in users.spec.ts.
      if (key.startsWith('POST /users/:userId/reset-password')) continue;
      const method = key.split(' ')[0]!.toLowerCase() as 'get' | 'post' | 'patch';
      const res = method === 'get' ? await admin.get(url) : await admin[method](url, body);
      expect(res.status, `${key} → ${JSON.stringify(res.body)}`).toBeLessThan(300);
    }
  });

  it('lets the Store Manager read what the matrix grants (PRD §3.2)', async () => {
    const temp = await createFixture(app);
    const manager = as(app, temp.manager, temp.projectId);
    for (const url of [
      '/dashboard',
      '/projects/current',
      '/stores',
      '/locations',
      '/categories',
      '/units',
      '/unit-conversions',
      '/materials',
    ]) {
      const res = await manager.get(url);
      expect(res.status, url).toBe(200);
    }
    const tm = await loadMasters(app, temp.manager, temp.projectId);
    await manager
      .post('/materials/check-duplicates', {
        name: 'Anything',
        categoryId: tm.categoryId('Hardware'),
        stockUnitId: tm.unitId('NOS'),
      })
      .expect(200);
    const dashboard = (await manager.get('/dashboard').expect(200)).body;
    expect(dashboard).toMatchObject({ view: 'OPERATIONAL', memberCount: null });
  });

  it('a Store Manager sees only the stores they are assigned to (Q2)', async () => {
    const temp = await createFixture(app);
    await as(app, temp.admin, temp.projectId)
      .post('/stores', { code: 'TWR-B', name: 'Tower B Store' })
      .expect(201);
    const adminView = (await as(app, temp.admin, temp.projectId).get('/stores').expect(200)).body;
    const managerView = (await as(app, temp.manager, temp.projectId).get('/stores').expect(200))
      .body;
    expect(adminView).toHaveLength(2);
    expect(managerView).toHaveLength(1);
    expect(managerView[0].id).toBe(temp.storeId);
  });

  it('a removed member loses access immediately, with the token still valid', async () => {
    const temp = await createFixture(app);
    await as(app, temp.manager, temp.projectId).get('/materials').expect(200);
    await as(app, temp.admin, temp.projectId)
      .patch(`/users/${temp.manager.userId}`, { status: 'REMOVED' })
      .expect(200);
    await as(app, temp.manager, temp.projectId).get('/materials').expect(403);
  });
});
