import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import YesNo from '@/components/ui/YesNo'

export default function SaasSection({ hasIAM }: { hasIAM: boolean }) {
  return (
    <SectionShell title="IAM">
      <MetricRow label="IAM activated" value={<YesNo value={hasIAM} />} />
    </SectionShell>
  )
}
