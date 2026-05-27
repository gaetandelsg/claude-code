import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import Badge from '@/components/ui/Badge'
import YesNo from '@/components/ui/YesNo'
import type { CockpitMetrics } from '@/lib/types'

export default function PrimoCockpitSection({
  metrics,
  activeProducts,
}: {
  metrics: CockpitMetrics | null
  activeProducts: string[]
}) {
  return (
    <SectionShell title="Primo Cockpit">
      <div className="mb-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Activated products</p>
        <div className="flex gap-1 flex-wrap">
          {['MDM', 'EDR', 'SaaS'].map((p) => (
            <Badge
              key={p}
              label={p}
              variant={activeProducts.includes(p) ? 'green' : 'gray'}
            />
          ))}
        </div>
      </div>
      {metrics === null ? (
        <p className="text-sm text-gray-400 py-2">Data unavailable</p>
      ) : (
        <>
          <MetricRow
            label="HR system connected"
            value={<YesNo value={metrics.hrSystemConnected} />}
          />
          <MetricRow
            label="Admins"
            value={
              metrics.admins.length > 0
                ? metrics.admins
                    .map((a) => [a.first_name, a.last_name].filter(Boolean).join(' ') || a.email)
                    .join(', ')
                : '—'
            }
          />
          <MetricRow
            label="Active employees / committed"
            value={`${metrics.activeEmployees} / ${metrics.committedHeadcount || '—'}`}
          />
          <MetricRow
            label="Pending onboardings"
            value={metrics.pendingOnboardings}
          />
          <MetricRow
            label="Pending offboardings"
            value={metrics.pendingOffboardings}
          />
        </>
      )}
    </SectionShell>
  )
}
