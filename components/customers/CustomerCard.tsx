import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { CustomerSummary } from '@/lib/types'

export default function CustomerCard({ customer }: { customer: CustomerSummary }) {
  return (
    <Link
      href={`/customers/${encodeURIComponent(customer.groupKey)}`}
      className="block border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <p className="font-semibold text-gray-900 mb-1 truncate">{customer.name}</p>
      {customer.adminEmail && (
        <p className="text-xs text-gray-400 mb-3 truncate">{customer.adminEmail}</p>
      )}
      <div className="flex flex-wrap gap-1">
        {customer.activeProducts.length > 0
          ? customer.activeProducts.map((p) => (
              <Badge key={p} label={p} variant="blue" />
            ))
          : <Badge label="No products" variant="gray" />}
      </div>
    </Link>
  )
}
