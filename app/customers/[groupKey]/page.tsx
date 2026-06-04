import { notFound } from 'next/navigation'
import { getCompanyGroup } from '@/lib/posthog/groups'
import { fetchCockpitMetrics, fetchMdmMetrics, fetchOrdersMetrics } from '@/lib/posthog/queries'
import CustomerDashboard from '@/components/dashboard/CustomerDashboard'
import Link from 'next/link'

export const revalidate = 300

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ groupKey: string }>
}) {
  const { groupKey: rawKey } = await params
  const groupKey = decodeURIComponent(rawKey)

  const group = await getCompanyGroup(groupKey)
  if (!group) notFound()

  const p = group.group_properties

  const activeProducts: string[] = []
  if (p.hasMDM) activeProducts.push('MDM')
  if (p.hasEDRThreatdown || p.hasEDRSentinelOne) activeProducts.push('EDR')
  if (p.hasIAM) activeProducts.push('IAM')

  const [cockpit, mdm, orders] = await Promise.all([
    fetchCockpitMetrics(groupKey).catch((e) => { console.error('[cockpit]', String(e)); return null }),
    fetchMdmMetrics(groupKey).catch((e) => { console.error('[mdm]', String(e)); return null }),
    fetchOrdersMetrics(groupKey).catch((e) => { console.error('[orders]', String(e)); return null }),
  ])

  return (
    <>
      <div className="mb-6">
        <Link href="/" className="text-xs text-gray-400 hover:text-[#0EC8CC] mb-2 inline-flex items-center gap-1 transition-colors">
          ← All customers
        </Link>
        <h1 className="text-xl font-semibold text-primo-dark">{p.name ?? groupKey}</h1>
      </div>

      <div className="space-y-4">
        <CustomerDashboard
          name={p.name ?? groupKey}
          activeProducts={activeProducts}
          trialPeriodEnabled={p.trialPeriodEnabled}
          trialPeriodRemainingDays={p.trialPeriodRemainingDays}
          isSelfSignup={p.isSelfSignup}
          hasMDM={p.hasMDM ?? false}
          hasEDRThreatdown={p.hasEDRThreatdown ?? false}
          hasEDRSentinelOne={p.hasEDRSentinelOne ?? false}
          hasIAM={p.hasIAM ?? false}
          ztdConfigured={p.ztdConfigured}
          devicesEnrolledCount={mdm?.enrolledDeviceCount ?? p.devicesEnrolledCount}
          committedDeviceCount={p.committedDeviceCount}
          cockpit={cockpit}
          orders={orders}
        />
      </div>
    </>
  )
}
