import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import Badge from '@/components/ui/Badge'

export default function OverallInfoSection({
  name,
  adminName,
  adminEmail,
  activeProducts,
}: {
  name: string
  adminName?: string
  adminEmail?: string
  activeProducts: string[]
}) {
  const adminDisplay =
    adminName && adminEmail
      ? `${adminName} (${adminEmail})`
      : adminEmail ?? adminName ?? '—'

  return (
    <SectionShell title="Overview">
      <MetricRow label="Company" value={name} />
      <MetricRow label="Admin contact" value={adminDisplay} />
      <MetricRow
        label="Active products"
        value={
          <div className="flex gap-1 flex-wrap justify-end">
            {activeProducts.length > 0
              ? activeProducts.map((p) => (
                  <Badge key={p} label={p} variant="blue" />
                ))
              : <Badge label="None" variant="gray" />}
          </div>
        }
      />
      <MetricRow
        label="Contract / plan dates"
        value={<Badge label="Coming soon (Hyperline)" variant="gray" />}
      />
    </SectionShell>
  )
}
