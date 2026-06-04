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
  return res.json()
}

export async function GET(req: NextRequest) {
  const gk = (req.nextUrl.searchParams.get('gk') ?? '66e2a303876e32967a945e8d').replace(/'/g, "\\'")

  // Check viewcompany by _id = gk
  const byId = await hogql(`
    SELECT _id, data
    FROM mongodb.viewcompany
    WHERE _id = '${gk}'
    LIMIT 1
  `)

  // Also check viewcompany schema (any row) to see available fields
  const schema = await hogql(`SELECT _id, data FROM mongodb.viewcompany LIMIT 1`)

  // Check if viewcompany uses a different id field inside data
  const pendingFields = await hogql(`
    SELECT
      data.employeesToOnboardCount,
      data.employeesToOffboardCount,
      data.employeesToOnboardOrOffboardCount
    FROM mongodb.viewcompany
    WHERE _id = '${gk}'
    LIMIT 1
  `)

  return NextResponse.json({ gk, byId, schema, pendingFields })
}
