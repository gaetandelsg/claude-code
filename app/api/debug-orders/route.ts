import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const groupKey = req.nextUrl.searchParams.get('gk') ?? '66e2a303876e32967a945e8d'
  const gk = groupKey.replace(/'/g, "\\'")

  const BASE_URL = process.env.POSTHOG_HOST!
  const PROJECT = process.env.POSTHOG_PROJECT_ID!
  const API_KEY = process.env.POSTHOG_API_KEY!

  const query = `SELECT count() AS total_orders, max(timestamp) AS last_order_date FROM events WHERE event = 'order_placed' AND properties.company.id = '${gk}'`

  const res = await fetch(`${BASE_URL}/api/projects/${PROJECT}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
    cache: 'no-store',
  })

  const status = res.status
  const body = await res.json()

  return NextResponse.json({ status, groupKey, query, body })
}
