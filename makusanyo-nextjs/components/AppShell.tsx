'use client';

import { useState } from 'react';
import type { User, Project, Expense, PoolTransaction, Approval } from '@prisma/client';
import { PERMS, stageMeta } from '@/lib/data';
import Login from './Login';
import Sidebar, { ViewKey } from './Sidebar';
import Dashboard from './Dashboard';
import CommonPool from './CommonPool';
import Projects from './Projects';
import Expenses from './Expenses';
import Approvals from './Approvals';

type ExpenseWithProject = Expense & { project: Project | null };
type ApprovalWithProject = Approval & { project: Project };

export default function AppShell({
  initialProjects, initialExpenses, initialPoolTx, initialPoolBalance, initialApprovals, users,
}: {
  initialProjects: Project[];
  initialExpenses: ExpenseWithProject[];
  initialPoolTx: PoolTransaction[];
  initialPoolBalance: number;
  initialApprovals: ApprovalWithProject[];
  users: User[];
}) {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewKey>('dashboard');

  if (!user) return <Login users={users} onLogin={setUser} />;

  const perm = PERMS[user.role as keyof typeof PERMS];
  const pending = initialApprovals.filter((a) => stageMeta(a).act).length;

  const titles: Record<ViewKey, [string, string]> = {
    dashboard: ['Dashboard', '941 Regt · unit financial overview'],
    approvals: ['Approvals', 'Verify & route monthly project profit'],
    pool: ['Common Pool', 'Master financial source · TZS'],
    projects: ['Projects', 'Income-generating units'],
    expenses: ['Expense Management', 'Disbursements against the Common Pool'],
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eef1f5]">
      <Sidebar view={view} setView={setView} user={user} perm={perm} pending={pending} onLogout={() => setUser(null)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex-none h-[66px] bg-white border-b border-slate-200 flex items-center gap-5 px-6">
          <div>
            <div className="text-lg font-semibold text-navy-950 leading-tight">{titles[view][0]}</div>
            <div className="text-[12.5px] text-slate-500">{titles[view][1]}</div>
          </div>
          <div className="flex-1" />
          <div className="text-right leading-tight">
            <div className="text-[13px] font-semibold text-navy-950 font-mono">10/07/2026</div>
            <div className="text-[11px] text-slate-500">Dar es Salaam</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-7">
          {view === 'dashboard' && (
            <Dashboard projects={initialProjects} poolTx={initialPoolTx} poolBalance={initialPoolBalance} approvals={initialApprovals} />
          )}
          {view === 'approvals' && <Approvals approvals={initialApprovals} perm={perm} />}
          {view === 'pool' && <CommonPool poolTx={initialPoolTx} poolBalance={initialPoolBalance} />}
          {view === 'projects' && <Projects projects={initialProjects} />}
          {view === 'expenses' && <Expenses expenses={initialExpenses} projects={initialProjects} />}
        </main>
      </div>
    </div>
  );
}
