'use client';

import type { Project, PoolTransaction, Approval } from '@prisma/client';
import { fmtTZS, stageMeta } from '@/lib/data';

export default function Dashboard({
  projects, poolTx, poolBalance, approvals,
}: {
  projects: Project[];
  poolTx: PoolTransaction[];
  poolBalance: number;
  approvals: Approval[];
}) {
  const monthlyTotal = projects.reduce((t, p) => t + p.monthly, 0);
  const maxMonthly = Math.max(1, ...projects.map((p) => p.monthly));
  const pending = approvals.filter((a) => stageMeta(a).act);

  return (
    <div className="animate-fadein">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-5 text-white bg-gradient-to-br from-navy-700 to-navy-900 relative overflow-hidden">
          <div className="text-[11px] tracking-wide uppercase text-gold-400 font-semibold">Common Pool Balance</div>
          <div className="font-mono text-[27px] font-semibold mt-2">TZS {fmtTZS(poolBalance)}</div>
          <div className="text-[11.5px] text-slate-300 mt-1.5">master financial source</div>
        </div>
        <div className="rounded-xl p-5 bg-white border border-slate-200">
          <div className="text-[11px] tracking-wide uppercase text-slate-500 font-semibold">Monthly Profit</div>
          <div className="font-mono text-2xl font-semibold mt-2 text-navy-950">TZS {fmtTZS(monthlyTotal)}</div>
          <div className="text-[11.5px] text-emerald-600 mt-1.5 font-medium">{projects.length} projects consolidated</div>
        </div>
        <div className="rounded-xl p-5 bg-white border border-slate-200">
          <div className="text-[11px] tracking-wide uppercase text-slate-500 font-semibold">Recent Expense</div>
          <div className="font-mono text-2xl font-semibold mt-2 text-navy-950">
            TZS {fmtTZS(poolTx.find((t) => t.type === 'out')?.amount ?? 0)}
          </div>
        </div>
        <div className="rounded-xl p-5 bg-amber-50 border border-amber-200">
          <div className="text-[11px] tracking-wide uppercase text-gold-700 font-semibold">Pending Approval</div>
          <div className="font-mono text-2xl font-semibold mt-2 text-gold-700">{pending.length} submissions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mt-4">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 font-semibold text-navy-950">Project Performance</div>
          <table className="w-full text-sm">
            <tbody>
              {projects.map((p) => (
                <tr key={p.code} className="border-t border-slate-100">
                  <td className="py-3 px-5">
                    <div className="font-semibold text-navy-950">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{p.code}</div>
                  </td>
                  <td className="py-3 px-2 text-slate-600">{p.manager}</td>
                  <td className="py-3 px-5 text-right font-mono">{fmtTZS(p.monthly)}</td>
                  <td className="py-3 pr-5 w-[130px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded overflow-hidden">
                        <div
                          className="h-full rounded bg-gradient-to-r from-gold-500 to-gold-400"
                          style={{ width: `${Math.round((p.monthly / maxMonthly) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono w-9 text-right">
                        {monthlyTotal ? Math.round((p.monthly / monthlyTotal) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 font-semibold text-navy-950">Recent Transactions</div>
          {poolTx.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-5 py-3 border-t border-slate-100">
              <div className={'w-2 h-2 rounded-full ' + (t.type === 'in' ? 'bg-emerald-500' : 'bg-red-500')} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-navy-950 font-medium truncate">{t.desc}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {new Date(t.date).toLocaleDateString('en-GB')} · {t.ref}
                </div>
              </div>
              <div className={'font-mono text-sm font-semibold ' + (t.type === 'in' ? 'text-emerald-600' : 'text-red-600')}>
                {t.type === 'in' ? '+' : '−'}{fmtTZS(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
