'use client';

import type { PoolTransaction } from '@prisma/client';
import { fmtTZS } from '@/lib/data';

export default function CommonPool({ poolTx, poolBalance }: { poolTx: PoolTransaction[]; poolBalance: number }) {
  const income = poolTx.filter((t) => t.type === 'in').reduce((s, t) => s + t.amount, 0);
  const expense = poolTx.filter((t) => t.type === 'out').reduce((s, t) => s + t.amount, 0);

  // poolTx arrives newest-first; walk backwards to compute the running balance at each row.
  let bal = poolBalance;
  const rows = poolTx.map((t) => {
    const balAfter = bal;
    bal = bal - (t.type === 'in' ? t.amount : -t.amount);
    return { ...t, balAfter };
  });

  return (
    <div className="animate-fadein">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl p-5 text-white bg-gradient-to-br from-navy-700 to-navy-900">
          <div className="text-[10.5px] uppercase text-gold-400 font-semibold">Current Balance</div>
          <div className="font-mono text-xl font-semibold mt-2">TZS {fmtTZS(poolBalance)}</div>
        </div>
        <div className="rounded-xl p-5 bg-white border border-slate-200">
          <div className="text-[10.5px] uppercase text-slate-500 font-semibold">Total Income</div>
          <div className="font-mono text-lg font-semibold mt-2 text-emerald-600">TZS {fmtTZS(income)}</div>
        </div>
        <div className="rounded-xl p-5 bg-white border border-slate-200">
          <div className="text-[10.5px] uppercase text-slate-500 font-semibold">Total Expenses</div>
          <div className="font-mono text-lg font-semibold mt-2 text-red-600">TZS {fmtTZS(expense)}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold text-navy-950">Transaction History</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10.5px] uppercase text-slate-400">
              <th className="py-2.5 px-5 font-semibold">Date</th>
              <th className="py-2.5 px-2 font-semibold">Ref</th>
              <th className="py-2.5 px-2 font-semibold">Description</th>
              <th className="py-2.5 px-2 font-semibold text-right">Amount</th>
              <th className="py-2.5 px-5 font-semibold text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="py-3 px-5 font-mono text-slate-600">{new Date(t.date).toLocaleDateString('en-GB')}</td>
                <td className="py-3 px-2 font-mono text-slate-400">{t.ref}</td>
                <td className="py-3 px-2">{t.desc}</td>
                <td className={'py-3 px-2 text-right font-mono font-medium ' + (t.type === 'in' ? 'text-emerald-600' : 'text-red-600')}>
                  {t.type === 'in' ? '+' : '−'}{fmtTZS(t.amount)}
                </td>
                <td className="py-3 px-5 text-right font-mono">{fmtTZS(t.balAfter)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
