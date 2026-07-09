import AppShell from '@/components/AppShell';
import { getProjects, getExpenses, getPoolTransactions, getPoolBalance, getApprovals, getUsers } from '@/lib/queries';

// Server Component: fetches everything from Postgres via Prisma, then hands
// it to the client shell as plain serializable props.
export default async function Page() {
  const [projects, expenses, poolTx, poolBalance, approvals, users] = await Promise.all([
    getProjects(),
    getExpenses(),
    getPoolTransactions(),
    getPoolBalance(),
    getApprovals(),
    getUsers(),
  ]);

  return (
    <AppShell
      initialProjects={projects}
      initialExpenses={expenses}
      initialPoolTx={poolTx}
      initialPoolBalance={poolBalance}
      initialApprovals={approvals}
      users={users}
    />
  );
}
