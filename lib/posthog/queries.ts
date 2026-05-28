import 'server-only'
import { phPost } from './client'
import type { HogQLResult, AdminRecord, CockpitMetrics, OrdersMetrics } from '../types'

async function runHogQL(query: string): Promise<HogQLResult> {
  return phPost<HogQLResult>('/query/', {
    query: { kind: 'HogQLQuery', query },
  })
}

function firstRow(result: HogQLResult): unknown[] {
  return result.results[0] ?? []
}

export async function fetchCockpitMetrics(groupKey: string): Promise<CockpitMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")

  const [adminsResult, onboardResult, offboardResult] = await Promise.all([
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
      SELECT count(DISTINCT person.id) AS count
      FROM events
      WHERE $group_1 = '${gk}'
        AND person.properties.hasPendingOnboarding = true
        AND timestamp >= now() - INTERVAL 365 DAY
    `),
    runHogQL(`
      SELECT count(DISTINCT person.id) AS count
      FROM events
      WHERE $group_1 = '${gk}'
        AND person.properties.hasPendingOffboarding = true
        AND timestamp >= now() - INTERVAL 365 DAY
    `),
  ])

  const admins: AdminRecord[] = adminsResult.results.map((row) => ({
    first_name: (row[0] as string | null) ?? null,
    last_name: (row[1] as string | null) ?? null,
    email: (row[2] as string | null) ?? null,
    last_seen: (row[3] as string | null) ?? null,
  }))

  return {
    admins,
    pendingOnboardings: Number(firstRow(onboardResult)[0] ?? 0),
    pendingOffboardings: Number(firstRow(offboardResult)[0] ?? 0),
  }
}

export async function fetchOrdersMetrics(groupKey: string): Promise<OrdersMetrics> {
  const gk = groupKey.replace(/'/g, "\\'")

  const result = await runHogQL(`
    SELECT
      count()        AS total_orders,
      max(timestamp) AS last_order_date
    FROM events
    WHERE event = 'order_placed'
      AND $group_1 = '${gk}'
  `)

  const row = firstRow(result)
  return {
    totalOrders: Number(row[0] ?? 0),
    lastOrderDate: (row[1] as string | null) ?? null,
  }
}
