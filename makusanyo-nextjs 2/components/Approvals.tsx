'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Approval, Project } from '@prisma/client';
import { fmtTZS, stageMeta, Permission } from '@/lib/data';
import { approveSubmission, returnSubmission } from '@/lib/actions';

export default function Approvals({
  approvals, perm,
}: {
  approvals: (Approval & { project: Project })[];
  perm: Permission;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function approve(id: number) {
    startTransition(async () => {
      await approveSubmission(id);
      router.refresh();
    });
  }
  function doReturn(id: number) {
    startTransition(async () => {
      await returnSubmission(id);
      router.refresh();
    });
  }

  const steps = ['Project Manager', 'Unit Pay Master', 'Chief Operations', 'Unit Pay Master', 'Pay Sergeant'];

  return (
    <div className="animate-fadein">
      <div className="bg-navy-700 rounded-xl p-5 text-white mb-4">
        <div className="text-xs text-gold-400 font-semibold uppercase tracking-wide mb-4">Profit Approval Workflow</div>
        <div className="flex items-center flex-wrap gap-0">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5 min-w-[96px]">
                <div
                  className={
                    'w-9 h-9 rounded-full flex items-center justify-center font-mono font-semibold text-sm ' +
                    (i === 1 || i === 3 ? 'bg-gold-500 text-navy-950' : 'bg-navy-500/40 text-slate-300 border border-navy-500')
                  }
                >
                  {i + 1}
                </div>
                <div className="text-[11.5px] text-center leading-tight text-slate-300">{label}</div>
              </div>
              {i < steps.length - 1 && <div className="w-8 h-0.5 bg-navy-500 mx-[-6px] mb-5" />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10.5px] uppercase text-slate-400">
              <th className="py-2.5 px-5 font-semibold">Project</th>
              <th className="py-2.5 px-2 font-semibold">Manager</th>
              <th className="py-2.5 px-2 font-semibold text-right">Amount</th>
              <th className="py-2.5 px-2 font-semibold">Status</th>
              <th className="py-2.5 px-5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((a) => {
              const m = stageMeta(a);
              const canAct = m.act && perm.approve;
              return (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="py-3 px-5">
                    <div className="font-semibold text-navy-950">{a.project.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{a.projectCode} · {a.month}</div>
                  </td>
                  <td className="py-3 px-2 text-slate-600">{a.managerName}</td>
                  <td className="py-3 px-2 text-right font-mono font-semibold">{fmtTZS(a.amount)}</td>
                  <td className="py-3 px-2">
                    <span className={'text-xs font-semibold px-2.5 py-1 rounded-full ' + m.tone + ' ' + m.bg}>{m.status}</span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    {canAct ? (
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => approve(a.id)}
                          disabled={pending}
                          className="px-3 py-1.5 rounded-lg bg-navy-700 text-white text-xs font-semibold disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => doReturn(a.id)}
                          disabled={pending}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs disabled:opacity-50"
                        >
                          Return
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Awaiting {m.actor}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
