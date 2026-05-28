import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import Badge from '@/components/ui/Badge'

export default function OverallInfoSection({
  name,
  activeProducts,
  trialPeriodEnabled,
  trialPeriodRemainingDays,
  isSelfSignup,
}: {
  name: string
  activeProducts: string[]
  trialPeriodEnabled?: boolean
  trialPeriodRemainingDays?: number
  isSelfSignup?: boolean
}) {
  return (
    <SectionShell title="Overview">
      <MetricRow label="Company" value={name} />
      <MetricRow
        label="Active products"
        value={
          <div className="flex gap-1 flex-wrap justify-end">
            {activeProducts.length > 0
              ? activeProducts.map((p) => <Badge key={p} label={p} variant="blue" />)
              : <Badge label="None" variant="gray" />}
          </div>
        }
      />
      {trialPeriodEnabled && (
        <MetricRow
          label="Trial"
          value={
            trialPeriodRemainingDays != null
              ? <Badge label={`${trialPeriodRemainingDays} days left`} variant={trialPeriodRemainingDays <= 7 ? 'red' : 'blue'} />
              : <Badge label="Active" variant="blue" />
          }
        />
      )}
      {isSelfSignup != null && (
        <MetricRow
          label="Signup type"
          value={<Badge label={isSelfSignup ? 'Self-signup' : 'Sales-led'} variant="gray" />}
        />
      )}
      <MetricRow
        label="Contract / plan dates"
        value={<Badge label="Coming soon (Hyperline)" variant="gray" />}
      />
    </SectionShell>
  )
}
