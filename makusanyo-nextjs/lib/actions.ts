'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Mirrors the stageMeta() transition logic from lib/data.ts, but persisted.
export async function approveSubmission(id: number) {
  const a = await prisma.approval.findUniqueOrThrow({ where: { id } });

  if (a.returned) {
    await prisma.approval.update({ where: { id }, data: { returned: false, stage: 1 } });
  } else if (a.stage === 3) {
    // Final UPM check → credit the Common Pool and forward to Pay Sgt
    await prisma.$transaction([
      prisma.approval.update({ where: { id }, data: { stage: 4 } }),
      prisma.poolTransaction.create({
        data: {
          ref: `CP-${Date.now()}`,
          desc: `Profit — ${(await prisma.project.findUnique({ where: { code: a.projectCode } }))?.name} (approved)`,
          type: 'in',
          amount: a.amount,
        },
      }),
    ]);
  } else {
    await prisma.approval.update({ where: { id }, data: { stage: Math.min(a.stage + 1, 5) } });
  }

  await prisma.auditLog.create({
    data: { category: 'Approval', action: `Advanced submission #${id}`, detail: `${a.projectCode} · stage ${a.stage} → next` },
  });

  revalidatePath('/');
}

export async function returnSubmission(id: number) {
  await prisma.approval.update({ where: { id }, data: { returned: true, stage: 0 } });
  await prisma.auditLog.create({ data: { category: 'Approval', action: `Returned submission #${id}`, detail: 'Sent back for correction' } });
  revalidatePath('/');
}

export async function createExpense(input: {
  desc: string;
  category: string;
  amount: number;
  projectCode?: string;
  paidBy?: string;
  fundedFrom?: string;
}) {
  const count = await prisma.expense.count();
  const no = `EXP-2026-${String(42 + count).padStart(3, '0')}`;

  await prisma.$transaction([
    prisma.expense.create({
      data: {
        no,
        desc: input.desc,
        category: input.category,
        amount: input.amount,
        projectCode: input.projectCode,
        paidBy: input.paidBy,
        fundedFrom: input.fundedFrom ?? 'Common Pool',
      },
    }),
    prisma.poolTransaction.create({
      data: { ref: `CP-${Date.now()}`, desc: `Expense — ${input.desc}`, type: 'out', amount: input.amount },
    }),
  ]);

  await prisma.auditLog.create({
    data: { category: 'Expense', action: `Posted expense ${no}`, detail: `${input.category} · TZS ${input.amount.toLocaleString()}` },
  });

  revalidatePath('/');
}
