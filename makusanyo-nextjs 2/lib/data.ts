export type Role =
  | 'admin' | 'co' | 'upm' | 'paysgt' | 'cashier' | 'pm' | 'auditor' | 'viewer';

export interface Permission {
  approve: boolean;
  project: boolean;
  expense: boolean;
  collection: boolean;
  wht: boolean;
  users: boolean;
  readonly: boolean;
  scope: 'all' | 'cashier' | 'limited';
}

export const PERMS: Record<Role, Permission> = {
  admin:   { approve: true,  project: true,  expense: true,  collection: true,  wht: true,  users: true,  readonly: false, scope: 'all' },
  co:      { approve: true,  project: true,  expense: true,  collection: true,  wht: true,  users: false, readonly: false, scope: 'all' },
  upm:     { approve: true,  project: true,  expense: true,  collection: true,  wht: true,  users: false, readonly: false, scope: 'all' },
  paysgt:  { approve: true,  project: false, expense: true,  collection: false, wht: false, users: false, readonly: false, scope: 'all' },
  cashier: { approve: false, project: false, expense: false, collection: true,  wht: false, users: false, readonly: false, scope: 'cashier' },
  pm:      { approve: false, project: true,  expense: false, collection: false, wht: false, users: false, readonly: false, scope: 'all' },
  auditor: { approve: false, project: false, expense: false, collection: false, wht: false, users: false, readonly: true,  scope: 'all' },
  viewer:  { approve: false, project: false, expense: false, collection: false, wht: false, users: false, readonly: true,  scope: 'limited' },
};

export function fmtTZS(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

// Works against any object shaped like a Prisma Approval row.
export function stageMeta(a: { stage: number; returned: boolean }) {
  if (a.returned) return { status: 'Returned', actor: 'Project Manager', tone: 'text-red-600', bg: 'bg-red-50', act: true, wait: false };
  if (a.stage === 1) return { status: 'Awaiting UPM', actor: 'you', tone: 'text-gold-700', bg: 'bg-amber-50', act: true, wait: false };
  if (a.stage === 2) return { status: 'With Chief Ops', actor: 'Chief Operations', tone: 'text-blue-600', bg: 'bg-blue-50', act: false, wait: true };
  if (a.stage === 3) return { status: 'Final UPM check', actor: 'you', tone: 'text-gold-700', bg: 'bg-amber-50', act: true, wait: false };
  if (a.stage === 4) return { status: 'With Pay Sgt', actor: 'Pay Sergeant', tone: 'text-blue-600', bg: 'bg-blue-50', act: false, wait: true };
  return { status: 'Transferred', actor: 'Common Pool', tone: 'text-emerald-600', bg: 'bg-emerald-50', act: false, wait: false };
}

// NOTE: Project/Expense/PoolTransaction/Approval/User records now come from
// Postgres via Prisma (see lib/queries.ts + prisma/schema.prisma). This file
// only keeps the pure, DB-independent helpers (permissions, formatting,
// workflow-stage logic) that components on both server and client can use.
