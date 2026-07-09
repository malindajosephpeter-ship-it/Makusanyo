'use client';

import type { User } from '@prisma/client';
import { Permission } from '@/lib/data';

export type ViewKey =
  | 'dashboard' | 'approvals' | 'pool' | 'projects' | 'expenses';

const NAV_MAIN: { key: ViewKey; code: string; label: string }[] = [
  { key: 'dashboard', code: 'DB', label: 'Dashboard' },
  { key: 'approvals', code: 'AP', label: 'Approvals' },
  { key: 'pool', code: 'CP', label: 'Common Pool' },
  { key: 'projects', code: 'PR', label: 'Projects' },
];

const NAV_OPS: { key: ViewKey; code: string; label: string }[] = [
  { key: 'expenses', code: 'EX', label: 'Expenses' },
];

const ROLE_LABEL: Record<string, string> = {
  admin: 'System Administrator', co: 'Chief Operations (CO)', upm: 'Unit Pay Master',
  paysgt: 'Pay Sergeant', cashier: 'Cashier', pm: 'Project Manager', auditor: 'Auditor', viewer: 'Viewer',
};

export default function Sidebar({
  view, setView, user, perm, pending, onLogout,
}: {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  user: User;
  perm: Permission;
  pending: number;
  onLogout: () => void;
}) {
  const item = (v: { key: ViewKey; code: string; label: string }) => {
    const active = view === v.key;
    return (
      <button
        key={v.key}
        onClick={() => setView(v.key)}
        className={
          'flex items-center gap-2.5 w-full px-2.5 py-2 mb-0.5 rounded-lg text-sm text-left ' +
          (active ? 'bg-navy-600 text-amber-50 font-semibold shadow-[inset_3px_0_0_#c8a24a]' : 'text-slate-300 font-medium')
        }
      >
        <span
          className={
            'flex-none w-6.5 h-5.5 w-[26px] h-[22px] rounded flex items-center justify-center font-mono text-[9.5px] font-semibold ' +
            (active ? 'bg-gold-500 text-navy-950' : 'bg-navy-500/40 text-slate-400')
          }
        >
          {v.code}
        </span>
        <span className="flex-1">{v.label}</span>
        {v.key === 'approvals' && pending > 0 && (
          <span className="flex-none min-w-[18px] h-[18px] px-1 rounded-full bg-gold-500 text-navy-950 text-[10.5px] font-bold flex items-center justify-center">
            {pending}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="flex-none w-[246px] bg-navy-950 text-slate-300 flex flex-col border-r border-navy-600/40">
      <div className="p-5 flex items-center gap-3 border-b border-navy-600/40">
        <div className="flex-none w-[42px] h-[42px] rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center font-serif font-bold text-[15px] text-navy-950">
          941
        </div>
        <div>
          <div className="font-serif font-bold text-base text-amber-50">941 Regt</div>
          <div className="text-[10.5px] tracking-[.18em] uppercase text-gold-500 font-semibold">Makusanyo</div>
        </div>
      </div>

      <nav className="p-3 flex-1">
        <div className="text-[10px] tracking-[.16em] uppercase text-slate-500 font-semibold px-2 pt-1.5 pb-2">Overview</div>
        {NAV_MAIN.filter((v) => v.key !== 'approvals' || perm.approve || perm.scope === 'all').map(item)}

        {perm.scope === 'all' && (
          <>
            <div className="text-[10px] tracking-[.16em] uppercase text-slate-500 font-semibold px-2 pt-4 pb-2">Operations</div>
            {NAV_OPS.map(item)}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-navy-600/40 flex items-center gap-2.5">
        <div className="flex-none w-9 h-9 rounded-full bg-navy-600 border border-navy-500 flex items-center justify-center font-semibold text-[13px] text-gold-500">
          {user.name.split(' ').filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-slate-100 truncate">{user.name}</div>
          <div className="text-[11px] text-slate-400">{ROLE_LABEL[user.role] ?? user.role}</div>
        </div>
        <button onClick={onLogout} className="flex-none px-2.5 py-1.5 rounded-md border border-navy-600 bg-navy-900 text-red-400 text-[11px] font-semibold">
          Sign out
        </button>
      </div>
    </aside>
  );
}
