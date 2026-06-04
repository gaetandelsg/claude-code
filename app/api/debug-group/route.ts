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
  return body.error ? { error: body.error } : body.results
}

export async function GET(req: NextRequest) {
  const gk = (req.nextUrl.searchParams.get('gk') ?? '66e2a303876e32967a945e8d').replace(/'/g, "\\'")

  // 1. Every event name that looks device / MDM / enrollment / license related, with counts.
  const eventCatalog = await hogql(`
    SELECT event, count() AS c
    FROM events
    WHERE event ILIKE '%device%'
       OR event ILIKE '%mdm%'
       OR event ILIKE '%enroll%'
       OR event ILIKE '%licen%'
       OR event ILIKE '%seat%'
    GROUP BY event
    ORDER BY c DESC
    LIMIT 50
  `)

  // 2. For this company, count instance_mdm_deployed_configured events.
  const mdmConfigCount = await hogql(`
    SELECT count()
    FROM events
    WHERE event = 'instance_mdm_deployed_configured'
      AND properties.id = '${gk}'
  `)

  // 3. Sample one instance_mdm_deployed_configured event's full properties for this company.
  const mdmSample = await hogql(`
    SELECT properties
    FROM events
    WHERE event = 'instance_mdm_deployed_configured'
      AND properties.id = '${gk}'
    ORDER BY timestamp DESC
    LIMIT 1
  `)

  return NextResponse.json({ gk, eventCatalog, mdmConfigCount, mdmSample })
}
