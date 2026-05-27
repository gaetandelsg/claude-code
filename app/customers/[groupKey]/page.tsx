import { notFound } from 'next/navigation'
import { getCompanyGroup } from '@/lib/posthog/groups'
import {
  fetchCockpitMetrics,
  fetchMdmEdrMetrics,
  fetchSaasMetrics,
  fetchOrdersMetrics,
} from '@/lib/posthog/queries'
import OverallInfoSection from '@/components/dashboard/OverallInfoSection'
import PrimoCockpitSection from '@/components/dashboard/PrimoCockpitSection'
import MdmEdrSection from '@/components/dashboard/MdmEdrSection'
import SaasSection from '@/components/dashboard/SaasSection'
import OrdersSection from '@/components/dashboard/OrdersSection'
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

  const props = group.group_properties
  const activeProducts = props.active_products ?? []

  const [cockpit, mdmEdr, saas, orders] = await Promise.all([
    fetchCockpitMetrics(groupKey, {
      committed_headcount: props.committed_headcount,
      hr_system_connected: props.hr_system_connected,
    }).catch(() => null),
    fetchMdmEdrMetrics(groupKey, {
      mdm_activated: props.mdm_activated,
      committed_device_count: props.committed_device_count,
      ztd_configured: props.ztd_configured,
      active_products: activeProducts,
    }).catch(() => null),
    fetchSaasMetrics(groupKey, {
      email_provider_connected: props.email_provider_connected,
    }).catch(() => null),
    fetchOrdersMetrics(groupKey).catch(() => null),
  ])

  return (
    <>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-2 inline-block">
          ← All customers
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">
          {props.name ?? groupKey}
        </h1>
      </div>

      <div className="space-y-4">
        <OverallInfoSection
          name={props.name ?? groupKey}
          adminName={props.admin_name}
          adminEmail={props.admin_email}
          activeProducts={activeProducts}
        />
        <PrimoCockpitSection metrics={cockpit} activeProducts={activeProducts} />
        <MdmEdrSection metrics={mdmEdr} />
        <SaasSection metrics={saas} />
        <OrdersSection metrics={orders} />
      </div>
    </>
  )
}
