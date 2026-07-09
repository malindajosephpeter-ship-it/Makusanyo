import { prisma } from '@/lib/prisma';

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { monthly: 'desc' } });
}

export async function getExpenses() {
  return prisma.expense.findMany({ orderBy: { date: 'desc' }, include: { project: true } });
}

export async function getPoolTransactions() {
  return prisma.poolTransaction.findMany({ orderBy: { date: 'desc' } });
}

export async function getPoolBalance() {
  const txs = await prisma.poolTransaction.findMany();
  return txs.reduce((bal, t) => bal + (t.type === 'in' ? t.amount : -t.amount), 0);
}

export async function getApprovals() {
  return prisma.approval.findMany({ include: { project: true }, orderBy: { id: 'asc' } });
}

export async function getUsers() {
  return prisma.user.findMany({ orderBy: { username: 'asc' } });
}
