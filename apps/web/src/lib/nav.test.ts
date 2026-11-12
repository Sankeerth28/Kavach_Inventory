import { permissionsForRole } from '@kavach/shared';
import { describe, expect, it } from 'vitest';
import { canOpen, navFor } from './nav';

const labels = (role: 'PROJECT_ADMIN' | 'STORE_MANAGER') =>
  navFor(permissionsForRole(role)).map((n) => n.label);

describe('navigation follows the permission matrices (PRD §3, §20.2, §20.3, Q30)', () => {
  it('Store Manager: daily work and read-only inventory, no setup or audit', () => {
    expect(labels('STORE_MANAGER')).toEqual([
      'Dashboard',
      'Material In',
      'Material Out',
      'Return Material',
      'Material Master',
      'Current Stock',
      'Stock Verification',
      'Transactions',
      'Reports',
      'AI Processing',
    ]);
  });

  it('Project Admin: everything, including the pages the PRD list left out', () => {
    const admin = labels('PROJECT_ADMIN');
    for (const label of [
      'Dashboard',
      'Material Master',
      'Categories',
      'Units',
      'Locations',
      'Stores',
      'User Management',
      'Settings',
      'Audit Logs',
      'Stock Verification',
    ]) {
      expect(admin, label).toContain(label);
    }
  });

  it('keeps a Store Manager off the setup pages and everyone off unbuilt modules', () => {
    const sm = permissionsForRole('STORE_MANAGER');
    const pa = permissionsForRole('PROJECT_ADMIN');
    for (const path of ['/users', '/settings', '/audit-logs', '/categories', '/units', '/stores']) {
      expect(canOpen(path, sm), path).toBe(false);
      expect(canOpen(path, pa), path).toBe(true);
    }
    expect(canOpen('/materials', sm)).toBe(true);
    expect(canOpen('/stock', pa)).toBe(false); // Phase 2
  });
});
