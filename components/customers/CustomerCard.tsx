import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { CustomerSummary } from '@/lib/types'

export default function CustomerCard({ customer }: { customer: CustomerSummary }) {
  return (
    <Link
      href={`/customers/${encodeURIComponent(customer.groupKey)}`}
      className="block bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-all"
    >
      <p className="font-semibold text-primo-dark mb-3 truncate">{customer.name}</p>
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
