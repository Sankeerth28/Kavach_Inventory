'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Alert, Card, PageHeader } from '@/components/ui';
import { api, errorMessage, useSession } from '@/lib/session';
import { cn } from '@/lib/utils';

function Stat({ label, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </Card>
  );
}

/** PRD §5.2: four large quick actions. They open in Phase 2 (Out, Return, Stock) and Phase 3 (In). */
const QUICK_ACTIONS = [
  { label: 'Material In', phase: 3 },
  { label: 'Material Out', phase: 2 },
  { label: 'Return Material', phase: 2 },
  { label: 'View Stock', phase: 2 },
];

export default function DashboardPage() {
  const { membership, can } = useSession();
  const summary = useQuery({ queryKey: ['dashboard'], queryFn: api.dashboard.get });
  const d = summary.data;

  return (
    <>
      <PageHeader title="Dashboard" description={membership?.projectName} />
      {summary.error && <Alert>{errorMessage(summary.error)}</Alert>}

      {can('dashboard:view_operational') && (
        <section aria-label="Quick actions" className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <div
              key={a.label}
              aria-disabled="true"
              className={cn(
                'flex h-28 flex-col items-center justify-center rounded-lg border border-dashed',
                'border-border bg-surface text-center text-muted-foreground',
              )}
            >
              <span className="text-lg font-semibold">{a.label}</span>
              <span className="text-xs">Arrives in Phase {a.phase}</span>
            </div>
          ))}
        </section>
      )}

      <section aria-label="Overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Material types"
          value={d?.materialCount ?? '–'}
          note={
            d && d.inactiveMaterialCount > 0 ? `${d.inactiveMaterialCount} inactive` : undefined
          }
        />
        <Stat label="Categories" value={d?.categoryCount ?? '–'} />
        <Stat label={d?.view === 'FULL' ? 'Stores' : 'My stores'} value={d?.storeCount ?? '–'} />
        <Stat label="Locations" value={d?.locationCount ?? '–'} />
        {d?.memberCount != null && <Stat label="Active users" value={d.memberCount} />}
      </section>

      <Card className="mt-6 p-4 text-sm">
        <p className="font-medium">What comes next</p>
        <p className="mt-1 text-muted-foreground">
          Stock levels, low-stock alerts, today&apos;s receipts and issues and recent transactions
          appear here once the inventory engine is in place (Phase 2). The AI processing overview
          follows with invoice scanning (Phase 3).
        </p>
        <p className="mt-3">
          <Link href="/materials" className="text-primary hover:underline">
            Open the Material Master →
          </Link>
        </p>
      </Card>
    </>
  );
}
