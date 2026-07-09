# Makusanyo — Next.js + Tailwind

A Next.js 14 (App Router) + TypeScript + Tailwind CSS implementation of the
941 Regt Makusanyo financial management prototype.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Demo login: username `admin` (or `co`, `upm`,
`paysgt`, `cashier`, `pm`, `auditor`, `viewer`), password `941`.

## What's implemented here

This repo is a **real, running Next.js app** — not a static export of the
HTML prototype — covering the core architecture and the highest-value
screens, built to the same navy/gold visual system (IBM Plex Sans/Serif/Mono,
TZS currency, DD/MM/YYYY dates):

- Username/password login (`components/Login.tsx`)
- App shell with role-aware sidebar navigation (`components/AppShell.tsx`, `Sidebar.tsx`)
- Role-based permissions model (`lib/data.ts` → `PERMS`)
- Dashboard with KPIs, project performance, recent transactions (`Dashboard.tsx`)
- Common Pool ledger with running balance (`CommonPool.tsx`)
- Projects register (`Projects.tsx`)
- Expense register (`Expenses.tsx`)
- Interactive Approvals workflow — Manager → UPM → CO → UPM → Pay Sgt, with
  working Approve/Return actions (`Approvals.tsx`)

## Database (Prisma + PostgreSQL)

This app is now wired to a real Postgres database via Prisma.

```bash
cp .env.example .env        # point DATABASE_URL at your Postgres instance
npm install                 # also runs `prisma generate`
npm run db:migrate          # creates tables from prisma/schema.prisma
npm run db:seed             # loads the same demo data as before
npm run dev
```

- **Schema**: `prisma/schema.prisma` — `User`, `Project`, `Expense`,
  `PoolTransaction`, `Approval`, `MonthlyCollection`, `AuditLog`.
- **Seed**: `prisma/seed.ts` — repopulates the 8 default projects, sample
  expenses, pool transactions, and the approval-workflow queue.
- **Reads**: `lib/queries.ts` — Server Component data fetchers used in
  `app/page.tsx` (a Server Component that loads everything from Postgres and
  passes it down as props — no client-side fetching needed for initial load).
- **Writes**: `lib/actions.ts` — Next.js Server Actions (`'use server'`) for
  `approveSubmission`, `returnSubmission`, `createExpense`. Each one mutates
  Postgres in a `prisma.$transaction`, writes an `AuditLog` row, and calls
  `revalidatePath('/')`. Client components call these directly and then
  `router.refresh()` to pull the fresh Server-Component data.
- Local Postgres quickly via Docker: `docker run --name makusanyo-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16`
  (matches the default `.env.example` connection string).
- For a hosted DB (Neon, Supabase, RDS), just drop their connection string into `DATABASE_URL`.

**Not yet wired to the DB**: authentication is still the demo username/password
check against the seeded `User` rows (real passwords are stored in plaintext
for demo purposes — replace with a hashed-password + NextAuth/Auth.js flow
before any real deployment). Hospital, WHT, Reports, Users admin UI, Audit
Log UI, Comms, and the Loan Calculator (see "What the original prototype
also includes" below) have `Prisma` models partially represented (`AuditLog`,
`MonthlyCollection`) but no UI yet — follow the same
query-in-`lib/queries.ts` / mutate-in-`lib/actions.ts` / render-in-`components/`
pattern to add them.



The full HTML/DC prototype (see the sibling `.dc.html` files in the parent
project) additionally has: Hospital Daily Collections + hospital bank
balance, Withholding Tax module with edit/delete, Reports (Monthly
Statement, Cash Flow, Project Comparison, Hospital Report — with Excel/PDF
export), User Management (admin-only, with password/login-key visibility),
Audit Log, Internal Comms channel with live auto-updating notices, a Loan
Advance Calculator (6 banks, reducing-balance amortization schedule, PDF
export), 2FA + QR password recovery on login, a forex ticker, and dedicated
tablet / mobile / smart-screen (kiosk) layouts.

**To extend:** each of those follows the same pattern already established
here — add a data shape + mock records to `lib/data.ts`, build a component
in `components/`, add its `ViewKey` to `Sidebar.tsx`, and render it in
`AppShell.tsx`'s view switch. The HTML prototype is the fidelity reference
for copy, layout, and interaction details.

## Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS (custom `navy`/`gold` palette + IBM Plex fonts in `tailwind.config.ts`)
- No backend/database — all data is in-memory mock data in `lib/data.ts`.
  Wire up your API/DB of choice (Prisma + PostgreSQL, per the original spec)
  behind the same component props.
