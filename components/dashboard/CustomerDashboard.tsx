'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import MetricRow from '@/components/ui/MetricRow'
import Badge from '@/components/ui/Badge'
import YesNo from '@/components/ui/YesNo'
import SectionShell from '@/components/ui/SectionShell'
import PrimoCockpitSection from './PrimoCockpitSection'
import type { CockpitMetrics, OrdersMetrics } from '@/lib/types'

type ModalId = 'mdm-edr' | 'iam' | 'orders' | null

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function ProductTile({
  label,
  active,
  summary,
  onClick,
}: {
  label: string
  active: boolean
  summary: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 border border-gray-200 rounded-xl p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all bg-white"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <Badge label={active ? 'Active' : 'Inactive'} variant={active ? 'green' : 'gray'} />
      </div>
      <p className="text-xs text-gray-400">{summary}</p>
    </button>
  )
}

export default function CustomerDashboard({
  name,
  activeProducts,
  trialPeriodEnabled,
  trialPeriodRemainingDays,
  isSelfSignup,
  hasMDM,
  hasEDRThreatdown,
  hasEDRSentinelOne,
  hasIAM,
  cockpit,
  orders,
}: {
  name: string
  activeProducts: string[]
  trialPeriodEnabled?: boolean
  trialPeriodRemainingDays?: number
  isSelfSignup?: boolean
  hasMDM: boolean
  hasEDRThreatdown: boolean
  hasEDRSentinelOne: boolean
  hasIAM: boolean
  cockpit: CockpitMetrics | null
  orders: OrdersMetrics | null
}) {
  const [modal, setModal] = useState<ModalId>(null)
  const edrActive = hasEDRThreatdown || hasEDRSentinelOne
  const edrType = hasEDRThreatdown && hasEDRSentinelOne
    ? 'Threatdown + SentinelOne'
    : hasEDRThreatdown ? 'Threatdown'
    : hasEDRSentinelOne ? 'SentinelOne'
    : null

  return (
    <>
      {/* Overview */}
      <SectionShell title="Overview">
        <MetricRow label="Company" value={name} />
        <MetricRow
          label="Products"
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
            label="Signup"
            value={<Badge label={isSelfSignup ? 'Self-signup' : 'Sales-led'} variant="gray" />}
          />
        )}
        <MetricRow
          label="Contract dates"
          value={<Badge label="Coming soon (Hyperline)" variant="gray" />}
        />
      </SectionShell>

      {/* Primo Cockpit */}
      <PrimoCockpitSection metrics={cockpit} activeProducts={activeProducts} />

      {/* Product tiles */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Products</p>
        <div className="flex gap-3">
          <ProductTile
            label="MDM / EDR"
            active={hasMDM || edrActive}
            summary={[hasMDM && 'MDM', edrType].filter(Boolean).join(' · ') || 'Not activated'}
            onClick={() => setModal('mdm-edr')}
          />
          <ProductTile
            label="IAM"
            active={hasIAM}
            summary={hasIAM ? 'Activated' : 'Not activated'}
            onClick={() => setModal('iam')}
          />
          <ProductTile
            label="Orders"
            active={(orders?.totalOrders ?? 0) > 0}
            summary={orders ? `${orders.totalOrders} order${orders.totalOrders !== 1 ? 's' : ''}` : '—'}
            onClick={() => setModal('orders')}
          />
        </div>
      </div>

      {/* MDM/EDR modal */}
      {modal === 'mdm-edr' && (
        <Modal title="MDM / EDR" onClose={() => setModal(null)}>
          <MetricRow label="MDM activated" value={<YesNo value={hasMDM} />} />
          <MetricRow label="EDR activated" value={<YesNo value={edrActive} />} />
          {edrActive && edrType && (
            <MetricRow label="EDR type" value={<Badge label={edrType} variant="blue" />} />
          )}
        </Modal>
      )}

      {/* IAM modal */}
      {modal === 'iam' && (
        <Modal title="IAM" onClose={() => setModal(null)}>
          <MetricRow label="IAM activated" value={<YesNo value={hasIAM} />} />
        </Modal>
      )}

      {/* Orders modal */}
      {modal === 'orders' && (
        <Modal title="Orders" onClose={() => setModal(null)}>
          <MetricRow label="Total orders" value={orders?.totalOrders ?? 0} />
          <MetricRow label="Last order" value={formatDate(orders?.lastOrderDate ?? null)} />
        </Modal>
      )}
    </>
  )
}
