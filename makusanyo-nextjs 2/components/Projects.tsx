'use client';

import type { Project } from '@prisma/client';
import { fmtTZS } from '@/lib/data';

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <div className="animate-fadein">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-slate-500">{projects.length} active projects contributing to the Common Pool</div>
        <button className="px-4 py-2 rounded-lg bg-navy-700 text-white text-sm font-semibold">+ Add New Project</button>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10.5px] uppercase text-slate-400">
              <th className="py-2.5 px-5 font-semibold">Project</th>
              <th className="py-2.5 px-2 font-semibold">Code</th>
              <th className="py-2.5 px-2 font-semibold">Manager</th>
              <th className="py-2.5 px-2 font-semibold text-right">Monthly Profit</th>
              <th className="py-2.5 px-2 font-semibold text-right">Annual Profit</th>
              <th className="py-2.5 px-5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.code} className="border-t border-slate-100">
                <td className="py-3 px-5 font-semibold text-navy-950">{p.name}</td>
                <td className="py-3 px-2 font-mono text-slate-400 text-xs">{p.code}</td>
                <td className="py-3 px-2 text-slate-600">{p.manager}</td>
                <td className="py-3 px-2 text-right font-mono">{fmtTZS(p.monthly)}</td>
                <td className="py-3 px-2 text-right font-mono text-slate-600">{fmtTZS(p.annual)}</td>
                <td className="py-3 px-5">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
