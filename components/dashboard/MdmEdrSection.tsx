import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import YesNo from '@/components/ui/YesNo'
import type { MdmEdrMetrics } from '@/lib/types'

function pct(num: number, denom: number): string {
  if (!denom) return '—'
  return `${Math.round((num / denom) * 100)}%`
}

export default function MdmEdrSection({ metrics }: { metrics: MdmEdrMetrics | null }) {
  return (
    <SectionShell title="MDM / EDR">
      {metrics === null ? (
        <p className="text-sm text-gray-400 py-2">Data unavailable</p>
      ) : (
        <>
          <MetricRow
            label="MDM instance activated"
            value={<YesNo value={metrics.mdmActivated} />}
          />
          <MetricRow
            label="Devices enrolled / committed"
            value={`${metrics.enrolledDevices} / ${metrics.committedDeviceCount || '—'} (${pct(metrics.enrolledDevices, metrics.committedDeviceCount)})`}
          />
          <MetricRow
            label="ZTD configured"
            value={<YesNo value={metrics.ztdConfigured} />}
          />
          {metrics.edrEnrolledDevices !== null && (
            <MetricRow
              label="Devices with EDR"
              value={`${metrics.edrEnrolledDevices} / ${metrics.enrolledDevices} (${pct(metrics.edrEnrolledDevices, metrics.enrolledDevices)})`}
            />
          )}
        </>
      )}
    </SectionShell>
  )
}
