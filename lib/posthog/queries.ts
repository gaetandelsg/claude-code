import 'server-only'
import { phPost } from './client'
import type { HogQLResult, AdminRecord, CockpitMetrics, MdmMetrics, OrdersMetrics } from '../types'

async function runHogQL(query: string): Promise<HogQLResult> {
  return phPost<HogQLResult>('/query/', {
    query: { kind: 'HogQLQuery', query },
  })
}

function firstRow(result: HogQLResult | null): unknown[] {
  return (result?.results ?? [])[0] ?? []
}

export async function fetchCockpitMetrics(groupKey: string): Promise<CockpitMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")

  const [adminsResult, pendingResult] = await Promise.all([
    runHogQL(`
      SELECT
        person.properties.firstName  AS first_name,
        person.properties.lastName   AS last_name,
        person.properties.email      AS email,
        max(timestamp)               AS last_seen
      FROM events
      WHERE $group_1 = '${gk}'
        AND person.properties.isAdmin = true
        AND person.properties.email NOT LIKE '%@getprimo.com'
      GROUP BY first_name, last_name, email
      ORDER BY last_seen DESC
      LIMIT 20
    `),
    runHogQL(`
      SELECT
        data.employeesToOnboardCount,
        data.employeesToOffboardCount
      FROM mongodb.viewcompany
      WHERE _id = '${gk}'
      LIMIT 1
    `).catch(() => null),
  ])

  const admins: AdminRecord[] = adminsResult.results.map((row) => ({
    first_name: (row[0] as string | null) ?? null,
    last_name: (row[1] as string | null) ?? null,
    email: (row[2] as string | null) ?? null,
    last_seen: (row[3] as string | null) ?? null,
  }))

  const pendingRow = firstRow(pendingResult)
  return {
    admins,
    pendingOnboardings: pendingResult ? Number(pendingRow[0] ?? 0) : 0,
    pendingOffboardings: pendingResult ? Number(pendingRow[1] ?? 0) : 0,
  }
}

export async function fetchMdmMetrics(groupKey: string): Promise<MdmMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")

  // viewcompanymetrics is pre-aggregated per company — single row lookup, much faster
  // than scanning viewdevice rows.
  const result = await runHogQL(`
    SELECT data.deviceMdm.countMdmOn AS enrolled
    FROM mongodb.viewcompanymetrics
    WHERE _id = '${gk}'
    LIMIT 1
  `).catch(() => null)

  const row = firstRow(result)
  return {
    enrolledDeviceCount: result && row[0] != null ? Number(row[0]) : null,
    committedDeviceCount: null,
  }
}

export async function fetchOrdersMetrics(groupKey: string): Promise<OrdersMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")

  const summaryResult = await runHogQL(`
    SELECT
      count()        AS total_orders,
      max(timestamp) AS last_order_date
    FROM events
    WHERE event = 'order_placed'
      AND properties.company.id = '${gk}'
  `)

  const summaryRow = firstRow(summaryResult)

  return {
    totalOrders: Number(summaryRow[0] ?? 0),
    lastOrderDate: (summaryRow[1] as string | null) ?? null,
    ordersLast6m: 0,
    amountLast6m: 0,
    shippedCountries: 0,
    recentOrders: [],
  }
}
