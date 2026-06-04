'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import MetricRow from '@/components/ui/MetricRow'
import Badge from '@/components/ui/Badge'
import YesNo from '@/components/ui/YesNo'
import SectionShell from '@/components/ui/SectionShell'
import PrimoCockpitSection from './PrimoCockpitSection'
import type { CockpitMetrics, OrdersMetrics } from '@/lib/types'

type ModalId = 'mdm' | 'edr' | 'saas' | 'orders' | null

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function pct(num: number | undefined, denom: number | undefined): string {
  if (!num || !denom) return '—'
  return `${Math.round((num / denom) * 100)}%`
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
      className="bg-white rounded-2xl shadow-sm p-4 text-left hover:shadow-md transition-all w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-primo-dark">{label}</span>
        <Badge label={active ? 'Active' : 'Inactive'} variant={active ? 'green' : 'gray'} />
      </div>
      <p className="text-xs text-gray-400">{summary}</p>
      {active && (
        <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full w-full rounded-full bg-[#0EC8CC]" />
        </div>
      )}
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
  ztdConfigured,
  devicesEnrolledCount,
  committedDeviceCount,
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
  ztdConfigured?: boolean
  devicesEnrolledCount?: number
  committedDeviceCount?: number
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

  const enrolledPct = pct(devicesEnrolledCount, committedDeviceCount)

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
        <div className="grid grid-cols-2 gap-3">
          <ProductTile
            label="MDM"
            active={hasMDM}
            summary={
              hasMDM
                ? devicesEnrolledCount != null && committedDeviceCount != null
                  ? `${enrolledPct} enrolled`
                  : devicesEnrolledCount != null
                  ? `${devicesEnrolledCount} enrolled`
                  : 'Activated'
                : 'Not activated'
            }
            onClick={() => setModal('mdm')}
          />
          <ProductTile
            label="EDR"
            active={edrActive}
            summary={edrType ?? 'Not activated'}
            onClick={() => setModal('edr')}
          />
          <ProductTile
            label="SaaS Management"
            active={hasIAM}
            summary={hasIAM ? 'Activated' : 'Not activated'}
            onClick={() => setModal('saas')}
          />
          <ProductTile
            label="Orders"
            active={(orders?.totalOrders ?? 0) > 0}
            summary={orders ? `${orders.totalOrders} order${orders.totalOrders !== 1 ? 's' : ''}` : '—'}
            onClick={() => setModal('orders')}
          />
        </div>
      </div>

      {/* MDM modal */}
      {modal === 'mdm' && (
        <Modal title="MDM" onClose={() => setModal(null)}>
          <MetricRow label="MDM activated" value={<YesNo value={hasMDM} />} />
          <MetricRow
            label="Devices enrolled"
            value={
              devicesEnrolledCount != null
                ? committedDeviceCount != null
                  ? `${devicesEnrolledCount} / ${committedDeviceCount} (${enrolledPct})`
                  : String(devicesEnrolledCount)
                : '—'
            }
          />
          <MetricRow
            label="ZTD configured"
            value={ztdConfigured != null ? <YesNo value={ztdConfigured} /> : '—'}
          />
        </Modal>
      )}

      {/* EDR modal */}
      {modal === 'edr' && (
        <Modal title="EDR" onClose={() => setModal(null)}>
          <MetricRow label="EDR activated" value={<YesNo value={edrActive} />} />
          {edrType && (
            <MetricRow label="Type" value={<Badge label={edrType} variant="blue" />} />
          )}
        </Modal>
      )}

      {/* SaaS Management modal */}
      {modal === 'saas' && (
        <Modal title="SaaS Management" onClose={() => setModal(null)}>
          <MetricRow label="Activated" value={<YesNo value={hasIAM} />} />
        </Modal>
      )}

      {/* Orders modal */}
      {modal === 'orders' && (
        <Modal title="Orders" onClose={() => setModal(null)}>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Total</p>
              <p className="text-xl font-semibold text-primo-dark">{orders?.totalOrders ?? 0}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Last 6 months</p>
              <p className="text-xl font-semibold text-primo-dark">{orders?.ordersLast6m ?? 0}</p>
              {(orders?.amountLast6m ?? 0) > 0 && (
                <p className="text-xs text-[#0EC8CC] mt-0.5">{Math.round(orders!.amountLast6m).toLocaleString('fr-FR')} €</p>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Countries</p>
              <p className="text-xl font-semibold text-primo-dark">{orders?.shippedCountries ?? '—'}</p>
            </div>
          </div>

          <MetricRow label="Last order" value={formatDate(orders?.lastOrderDate ?? null)} />

          {(orders?.recentOrders?.length ?? 0) > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Recent orders</p>
              <div className="space-y-3">
                {orders!.recentOrders.map((order, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono text-gray-500">{order.reference ?? '—'}</span>
                      <div className="flex items-center gap-2">
                        {order.status && (
                          <Badge label={order.status} variant="gray" />
                        )}
                        <span className="text-xs text-gray-400">{formatDate(order.date)}</span>
                      </div>
                    </div>
                    {order.products.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {order.products.map((p, j) => (
                          <li key={j} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{p.name}</span>
                            {p.priceNoVAT != null && (
                              <span className="text-gray-400 text-xs">{p.priceNoVAT.toLocaleString('fr-FR')} €</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {order.priceNoVAT != null && (
                      <div className="mt-2 pt-1.5 border-t border-gray-200 flex justify-between text-xs">
                        <span className="text-gray-400">Total HT</span>
                        <span className="font-medium text-primo-dark">{order.priceNoVAT.toLocaleString('fr-FR')} €</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
