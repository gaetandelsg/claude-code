import 'server-only'
import { phPost } from './client'
import type {
  HogQLResult,
  AdminRecord,
  CockpitMetrics,
  MdmEdrMetrics,
  SaasMetrics,
  OrdersMetrics,
} from '../types'

// All event names and property names below are placeholders.
// Verify against PostHog > Events list and your group/person properties.
// $group_0 must match the group_type_index of the "company" group type.

async function runHogQL(query: string): Promise<HogQLResult> {
  return phPost<HogQLResult>('/query/', {
    query: { kind: 'HogQLQuery', query },
  })
}

function firstRow(result: HogQLResult): unknown[] {
  return result.results[0] ?? []
}

export async function fetchCockpitMetrics(
  groupKey: string,
  groupProps: { committed_headcount?: number; hr_system_connected?: boolean }
): Promise<CockpitMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")

  const [adminsResult, onboardResult, offboardResult] = await Promise.all([
    runHogQL(`
      SELECT
        person.properties.first_name,
        person.properties.last_name,
        person.properties.email
      FROM persons
      WHERE person.properties.company_id = '${gk}'
        AND person.properties.is_admin = true
      LIMIT 50
    `),
    runHogQL(`
      SELECT count() AS pending_count
      FROM events
      WHERE event = 'employee_onboarding_started'
        AND $group_0 = '${gk}'
        AND properties.status = 'pending'
        AND timestamp >= now() - INTERVAL 90 DAY
    `),
    runHogQL(`
      SELECT count() AS pending_count
      FROM events
      WHERE event = 'employee_offboarding_started'
        AND $group_0 = '${gk}'
        AND properties.status = 'pending'
        AND timestamp >= now() - INTERVAL 90 DAY
    `),
  ])

  const admins: AdminRecord[] = adminsResult.results.map((row) => ({
    first_name: (row[0] as string | null) ?? null,
    last_name: (row[1] as string | null) ?? null,
    email: (row[2] as string | null) ?? null,
  }))

  const activeEmployees = admins.length

  return {
    admins,
    activeEmployees,
    committedHeadcount: groupProps.committed_headcount ?? 0,
    pendingOnboardings: Number(firstRow(onboardResult)[0] ?? 0),
    pendingOffboardings: Number(firstRow(offboardResult)[0] ?? 0),
    hrSystemConnected: groupProps.hr_system_connected ?? false,
  }
}

export async function fetchMdmEdrMetrics(
  groupKey: string,
  groupProps: {
    mdm_activated?: boolean
    committed_device_count?: number
    ztd_configured?: boolean
    active_products?: string[]
  }
): Promise<MdmEdrMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")
  const edrActive = groupProps.active_products?.includes('EDR') ?? false

  const queries: Promise<HogQLResult>[] = [
    runHogQL(`
      SELECT count(DISTINCT properties.device_id) AS enrolled_devices
      FROM events
      WHERE event = 'device_enrolled'
        AND $group_0 = '${gk}'
    `),
  ]

  if (edrActive) {
    queries.push(
      runHogQL(`
        SELECT count(DISTINCT properties.device_id) AS edr_enrolled
        FROM events
        WHERE event = 'edr_agent_installed'
          AND $group_0 = '${gk}'
      `)
    )
  }

  const [enrolledResult, edrResult] = await Promise.all(queries)

  return {
    mdmActivated: groupProps.mdm_activated ?? false,
    enrolledDevices: Number(firstRow(enrolledResult)[0] ?? 0),
    committedDeviceCount: groupProps.committed_device_count ?? 0,
    ztdConfigured: groupProps.ztd_configured ?? false,
    edrEnrolledDevices: edrActive && edrResult
      ? Number(firstRow(edrResult)[0] ?? 0)
      : null,
  }
}

export async function fetchSaasMetrics(
  groupKey: string,
  groupProps: { email_provider_connected?: boolean }
): Promise<SaasMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")

  const result = await runHogQL(`
    SELECT count(DISTINCT properties.app_name) AS saas_count
    FROM events
    WHERE event = 'saas_app_discovered'
      AND $group_0 = '${gk}'
  `)

  return {
    emailProviderConnected: groupProps.email_provider_connected ?? false,
    discoveredSaasCount: Number(firstRow(result)[0] ?? 0),
  }
}

export async function fetchOrdersMetrics(groupKey: string): Promise<OrdersMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")

  const result = await runHogQL(`
    SELECT
      count()        AS total_orders,
      max(timestamp) AS last_order_date
    FROM events
    WHERE event = 'order_created'
      AND $group_0 = '${gk}'
  `)

  const row = firstRow(result)
  return {
    totalOrders: Number(row[0] ?? 0),
    lastOrderDate: (row[1] as string | null) ?? null,
  }
}
