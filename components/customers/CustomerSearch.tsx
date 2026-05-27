'use client'

import { useState } from 'react'
import type { CustomerSummary } from '@/lib/types'
import CustomerCard from './CustomerCard'

export default function CustomerSearch({ customers }: { customers: CustomerSummary[] }) {
  const [query, setQuery] = useState('')

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <input
        type="search"
        placeholder="Search customers…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-sm mb-6 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">No customers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CustomerCard key={c.groupKey} customer={c} />
          ))}
        </div>
      )}
    </div>
  )
}
