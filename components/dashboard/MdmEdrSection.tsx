import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import Badge from '@/components/ui/Badge'
import YesNo from '@/components/ui/YesNo'

export default function MdmEdrSection({
  hasMDM,
  hasEDRThreatdown,
  hasEDRSentinelOne,
}: {
  hasMDM: boolean
  hasEDRThreatdown: boolean
  hasEDRSentinelOne: boolean
}) {
  const edrActive = hasEDRThreatdown || hasEDRSentinelOne
  const edrType = hasEDRThreatdown && hasEDRSentinelOne
    ? 'Threatdown + SentinelOne'
    : hasEDRThreatdown
    ? 'Threatdown'
    : hasEDRSentinelOne
    ? 'SentinelOne'
    : null

  return (
    <SectionShell title="MDM / EDR">
      <MetricRow label="MDM activated" value={<YesNo value={hasMDM} />} />
      <MetricRow label="EDR activated" value={<YesNo value={edrActive} />} />
      {edrActive && edrType && (
        <MetricRow label="EDR type" value={<Badge label={edrType} variant="blue" />} />
      )}
    </SectionShell>
  )
}
