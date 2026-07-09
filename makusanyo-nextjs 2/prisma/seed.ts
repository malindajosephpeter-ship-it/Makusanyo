import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  const users = [
    { username: 'admin',   name: 'Maj. P. Massawe',  role: 'admin' as const },
    { username: 'co',      name: 'Lt.Col. H. Ndosi', role: 'co' as const },
    { username: 'upm',     name: 'WO2 W. Komba',     role: 'upm' as const },
    { username: 'paysgt',  name: 'Sgt. B. Otieno',   role: 'paysgt' as const },
    { username: 'cashier', name: 'Pte. L. Mrema',    role: 'cashier' as const },
    { username: 'pm',      name: 'Cpl. A. Kimaro',   role: 'pm' as const },
    { username: 'auditor', name: 'Mr. S. Fungo',     role: 'auditor' as const },
    { username: 'viewer',  name: 'Capt. G. Mtei',    role: 'viewer' as const },
  ];
  for (const u of users) {
    await prisma.user.upsert({ where: { username: u.username }, update: {}, create: u });
  }

  const projects = [
    { code: 'CAT-01', name: 'Catering',     manager: 'Sgt. J. Mushi',   monthly: 12400000, annual: 138000000 },
    { code: 'RES-02', name: 'Resort',       manager: 'Cpl. A. Kimaro',  monthly: 18750000, annual: 205000000 },
    { code: 'SUP-03', name: 'Supu',         manager: 'Pte. R. Ngassa',  monthly: 4200000,  annual: 47500000 },
    { code: 'GAS-04', name: 'Gas',          manager: 'Sgt. M. Haule',   monthly: 9600000,  annual: 108000000 },
    { code: 'MNA-05', name: 'Money Agency', manager: 'Cpl. S. Lyimo',   monthly: 7300000,  annual: 82000000 },
    { code: 'TOF-06', name: 'Tofali',       manager: 'Pte. E. Massawe', monthly: 5850000,  annual: 61000000 },
    { code: 'KUK-07', name: 'Kukopeshana',  manager: 'Sgt. D. Kessy',   monthly: 11200000, annual: 121000000 },
    { code: 'BUS-08', name: 'Bustani',      manager: 'Pte. F. Mbwana',  monthly: 3150000,  annual: 34000000 },
  ];
  for (const p of projects) {
    await prisma.project.upsert({ where: { code: p.code }, update: {}, create: p });
  }

  const poolTx = [
    { ref: 'CP-1181', desc: 'Opening balance carried forward', type: 'in', amount: 241900000, date: new Date('2026-07-01') },
    { ref: 'CP-1182', desc: 'Profit — Gas (approved)', type: 'in', amount: 9600000, date: new Date('2026-07-01') },
    { ref: 'CP-1183', desc: 'Expense — Staff welfare (Catering)', type: 'out', amount: 2100000, date: new Date('2026-07-02') },
    { ref: 'CP-1184', desc: 'Profit — Catering (approved)', type: 'in', amount: 12400000, date: new Date('2026-07-03') },
    { ref: 'CP-1185', desc: 'Expense — Generator repair (Resort)', type: 'out', amount: 3600000, date: new Date('2026-07-05') },
    { ref: 'CP-1186', desc: 'Profit — Resort (approved)', type: 'in', amount: 18750000, date: new Date('2026-07-05') },
    { ref: 'CP-1187', desc: 'Expense — Vehicle fuel (Gas)', type: 'out', amount: 1240000, date: new Date('2026-07-06') },
  ];
  for (const t of poolTx) {
    await prisma.poolTransaction.upsert({ where: { ref: t.ref }, update: {}, create: t });
  }

  const expenses = [
    { no: 'EXP-2026-041', desc: 'Vehicle fuel — supply run', category: 'Fuel', amount: 1240000, projectCode: 'GAS-04', date: new Date('2026-07-06') },
    { no: 'EXP-2026-040', desc: 'Generator repair', category: 'Repairs', amount: 3600000, projectCode: 'RES-02', date: new Date('2026-07-05') },
    { no: 'EXP-2026-039', desc: 'Staff welfare — mess provisions', category: 'Staff Welfare', amount: 2100000, projectCode: 'CAT-01', date: new Date('2026-07-04') },
    { no: 'EXP-2026-038', desc: 'Office supplies & stationery', category: 'Office Expenses', amount: 780000, projectCode: null, date: new Date('2026-07-03') },
  ];
  for (const e of expenses) {
    await prisma.expense.upsert({ where: { no: e.no }, update: {}, create: e });
  }

  const approvals = [
    { projectCode: 'RES-02', month: '07/2026', amount: 18750000, managerName: 'Cpl. A. Kimaro', stage: 1 },
    { projectCode: 'CAT-01', month: '07/2026', amount: 12400000, managerName: 'Sgt. J. Mushi', stage: 1 },
    { projectCode: 'GAS-04', month: '07/2026', amount: 9600000, managerName: 'Sgt. M. Haule', stage: 3 },
    { projectCode: 'MNA-05', month: '07/2026', amount: 7300000, managerName: 'Cpl. S. Lyimo', stage: 2 },
    { projectCode: 'SUP-03', month: '07/2026', amount: 4200000, managerName: 'Pte. R. Ngassa', stage: 4 },
    { projectCode: 'TOF-06', month: '07/2026', amount: 5850000, managerName: 'Pte. E. Massawe', stage: 0, returned: true },
  ];
  for (const a of approvals) {
    await prisma.approval.create({ data: a });
  }

  console.log('Seed complete.');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
