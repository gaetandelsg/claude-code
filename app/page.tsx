import { listCompanyGroups } from '@/lib/posthog/groups'
import type { CustomerSummary } from '@/lib/types'
import CustomerSearch from '@/components/customers/CustomerSearch'

export const revalidate = 300

export default async function HomePage() {
  let customers: CustomerSummary[] = []

  try {
    const groups = await listCompanyGroups()
    customers = groups.map((g) => ({
      groupKey: g.group_key,
      name: g.group_properties.name ?? g.group_key,
      activeProducts: g.group_properties.active_products ?? [],
      adminName: g.group_properties.admin_name,
      adminEmail: g.group_properties.admin_email,
    }))
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
