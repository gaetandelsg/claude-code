import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.POSTHOG_HOST!
const PROJECT = process.env.POSTHOG_PROJECT_ID!
const API_KEY = process.env.POSTHOG_API_KEY!

async function hogql(query: string) {
  const res = await fetch(`${BASE_URL}/api/projects/${PROJECT}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
    cache: 'no-store',
  })
  const body = await res.json()
  // Return full body so we can see errors in any format
  return body
}

export async function GET(req: NextRequest) {
  const gk = (req.nextUrl.searchParams.get('gk') ?? '66e2a303876e32967a945e8d').replace(/'/g, "\\'")

  // Discover actual column names — no WHERE so it doesn't fail on unknown columns
  const metricsSchema = await hogql(`SELECT * FROM mongodb.viewcompanymetrics LIMIT 1`)
  const deviceSchema = await hogql(`SELECT * FROM mongodb.viewdevice LIMIT 3`)

  return NextResponse.json({ gk, metricsSchema, deviceSchema })
}
