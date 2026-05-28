import { listCompanyGroups } from '@/lib/posthog/groups'
import type { CustomerSummary } from '@/lib/types'
import CustomerSearch from '@/components/customers/CustomerSearch'

export const revalidate = 300

export default async function HomePage() {
  let customers: CustomerSummary[] = []

  try {
    const groups = await listCompanyGroups()
    customers = groups.map((g) => {
      const p = g.group_properties
      const activeProducts: string[] = []
      if (p.hasMDM) activeProducts.push('MDM')
      if (p.hasEDRThreatdown || p.hasEDRSentinelOne) activeProducts.push('EDR')
      if (p.hasIAM) activeProducts.push('IAM')
      return {
        groupKey: g.group_key,
        name: p.name ?? g.group_key,
        activeProducts,
      }
    })
  } catch (err) {
    console.error('Failed to load customer groups:', err)
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-400 mt-0.5">{customers.length} companies</p>
      </div>
      <CustomerSearch customers={customers} />
    </>
  )
}
