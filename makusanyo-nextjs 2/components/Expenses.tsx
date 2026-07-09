'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Expense, Project } from '@prisma/client';
import { fmtTZS } from '@/lib/data';
import { createExpense } from '@/lib/actions';

const CATEGORIES = ['Office Expenses', 'Fuel', 'Staff Welfare', 'Repairs', 'Utilities', 'Food', 'Training', 'Transport', 'Medical Support', 'Emergency', 'Development', 'Maintenance', 'Miscellaneous'];

export default function Expenses({ expenses, projects }: { expenses: (Expense & { project: Project | null })[]; projects: Project[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [projectCode, setProjectCode] = useState('');

  function submit() {
    const amt = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (!desc || !amt) return;
    startTransition(async () => {
      await createExpense({ desc, category, amount: amt, projectCode: projectCode || undefined });
      setOpen(false);
      setDesc(''); setAmount(''); setProjectCode('');
      router.refresh();
    });
  }

  return (
    <div className="animate-fadein">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="font-semibold text-navy-950">Expense Register</div>
          <button onClick={() => setOpen(true)} className="px-3.5 py-2 rounded-lg bg-navy-700 text-white text-xs font-semibold">
            + New Expense
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase text-slate-400">
              <th className="py-2.5 px-5 font-semibold">Exp #</th>
              <th className="py-2.5 px-2 font-semibold">Date</th>
              <th className="py-2.5 px-2 font-semibold">Description</th>
              <th className="py-2.5 px-2 font-semibold">Category</th>
              <th className="py-2.5 px-2 font-semibold">Project</th>
              <th className="py-2.5 px-5 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.no} className="border-t border-slate-100">
                <td className="py-2.5 px-5 font-mono text-slate-400 text-[11.5px]">{e.no}</td>
                <td className="py-2.5 px-2 font-mono text-slate-600 text-xs">{new Date(e.date).toLocaleDateString('en-GB')}</td>
                <td className="py-2.5 px-2">{e.desc}</td>
                <td className="py-2.5 px-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{e.category}</span>
                </td>
                <td className="py-2.5 px-2 text-slate-600">{e.project?.name ?? '—'}</td>
                <td className="py-2.5 px-5 text-right font-mono font-medium text-red-600">{fmtTZS(e.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-6" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="font-semibold text-navy-950 mb-4">New Expense</div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description *</label>
                <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Project</label>
                  <select value={projectCode} onChange={(e) => setProjectCode(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                    <option value="">— none —</option>
                    {projects.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Amount (TZS) *</label>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono" />
              </div>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setOpen(false)} className="flex-none px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600">Cancel</button>
                <button onClick={submit} disabled={pending} className="flex-1 px-4 py-2 rounded-lg bg-navy-700 text-white text-sm font-semibold disabled:opacity-50">
                  {pending ? 'Posting…' : 'Post Expense'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
