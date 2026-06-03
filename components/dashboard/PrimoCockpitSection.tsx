'use client'

import { useState } from 'react'
import SectionShell from '@/components/ui/SectionShell'
import MetricRow from '@/components/ui/MetricRow'
import Badge from '@/components/ui/Badge'
import type { CockpitMetrics } from '@/lib/types'

function formatRelative(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function PrimoCockpitSection({
  metrics,
  activeProducts,
}: {
  metrics: CockpitMetrics | null
  activeProducts: string[]
}) {
  const [adminsOpen, setAdminsOpen] = useState(false)

  return (
    <SectionShell title="Primo Cockpit">
      <div className="py-3 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Activated products</p>
        <div className="flex gap-1 flex-wrap">
          {['MDM', 'EDR', 'IAM'].map((p) => (
            <Badge key={p} label={p} variant={activeProducts.includes(p) ? 'green' : 'gray'} />
          ))}
        </div>
      </div>

      {metrics === null ? (
        <p className="text-sm text-gray-400 py-3">Data unavailable</p>
      ) : (
        <>
          <button
            onClick={() => setAdminsOpen((v) => !v)}
            className="w-full flex items-center justify-between py-2 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors"
          >
            <span className="text-sm text-gray-500">Admins</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{metrics.admins.length}</span>
              <svg
                className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${adminsOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {adminsOpen && (
            <div className="bg-gray-50 -mx-6 px-6 py-3 border-b border-gray-100">
              {metrics.admins.length === 0 ? (
                <p className="text-sm text-gray-400">No admins found</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase tracking-wide">
                      <th className="text-left pb-2 font-medium">Name</th>
                      <th className="text-left pb-2 font-medium">Email</th>
                      <th className="text-right pb-2 font-medium">Last connected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.admins.map((a, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="py-1.5 pr-4 text-gray-800">
                          {[a.first_name, a.last_name].filter(Boolean).join(' ') || '—'}
                        </td>
                        <td className="py-1.5 pr-4 text-gray-500 truncate max-w-[180px]">{a.email ?? '—'}</td>
                        <td className="py-1.5 text-right text-gray-400">{formatRelative(a.last_seen)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <MetricRow label="Pending onboardings" value={metrics.pendingOnboardings} />
          <MetricRow label="Pending offboardings" value={metrics.pendingOffboardings} />
        </>
      )}
    </SectionShell>
  )
}
