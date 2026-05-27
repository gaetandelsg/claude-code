import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import type { OrdersMetrics } from '@/lib/types'

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function OrdersSection({ metrics }: { metrics: OrdersMetrics | null }) {
  return (
    <SectionShell title="Orders">
      {metrics === null ? (
        <p className="text-sm text-gray-400 py-2">Data unavailable</p>
      ) : (
        <>
          <MetricRow label="Total orders" value={metrics.totalOrders} />
          <MetricRow label="Last order" value={formatDate(metrics.lastOrderDate)} />
        </>
      )}
    </SectionShell>
  )
}
