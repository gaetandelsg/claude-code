import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import YesNo from '@/components/ui/YesNo'
import type { SaasMetrics } from '@/lib/types'

export default function SaasSection({ metrics }: { metrics: SaasMetrics | null }) {
  return (
    <SectionShell title="SaaS">
      {metrics === null ? (
        <p className="text-sm text-gray-400 py-2">Data unavailable</p>
      ) : (
        <>
          <MetricRow
            label="Email provider connected"
            value={<YesNo value={metrics.emailProviderConnected} />}
          />
          <MetricRow
            label="SaaS apps discovered (auto)"
            value={metrics.discoveredSaasCount}
          />
        </>
      )}
    </SectionShell>
  )
}
